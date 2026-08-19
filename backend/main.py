import os


from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pymongo import MongoClient
from pydantic import BaseModel, Field
from jose import jwt
from datetime import datetime, timedelta, timezone
from typing import Dict
from typing import List, Dict, Any
from bson import ObjectId
import bcrypt

SECRET_KEY = "quizchain-development-secret-key"
ALGORITHM = "HS256"

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    try:
        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        return payload

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

def get_current_admin(
    current_user: dict = Depends(get_current_user)
):
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user    



load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")

if not MONGODB_URL:
    raise RuntimeError("MONGODB_URL is not configured in .env")


client = MongoClient(MONGODB_URL)

db = client["QuizChain"]
assessments_collection = db["assessments"]
attempts_collection = db["attempts"]
users_collection = db["users"]


app = FastAPI(
    title="QuizChain API",
    description="Backend API for the QuizChain assessment platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class User(BaseModel):
    name: str
    email: str
    password: str
    role: str

class LoginRequest(BaseModel):
    email: str
    password: str    


class Question(BaseModel):
    id: int
    question: str
    options: Dict[str, str]
    correctAnswer: str


class Assessment(BaseModel):
    title: str
    subject: str
    description: str = ""
    marksPerQuestion: float = 1
    negativeMarking: float = 0
    passingPercentage: float = 40
    duration: int = 30
    questions: List[Question] = []

class Attempt(BaseModel):
    assessmentId: str
    candidateName: str
    candidateEmail: str
    answers: Dict[str, str]
    correct: int
    incorrect: int
    unanswered: int
    score: float
    totalMarks: float
    percentage: float
    passed: bool
    submittedAt: datetime = None

@app.get("/")
def root():
    return {
        "message": "QuizChain API is running"
    }


@app.get("/api/health")
def health_check():
    try:
        client.admin.command("ping")

        return {
            "status": "healthy",
            "database": "connected"
        }

    except Exception as error:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(error)
        }


@app.post("/api/assessments")
def create_assessment(
    assessment: Assessment,
    current_admin: dict = Depends(get_current_admin)
):
    try:
        assessment_data = assessment.model_dump()

        result = assessments_collection.insert_one(
            assessment_data
        )

        return {
            "message": "Assessment created successfully",
            "assessment_id": str(result.inserted_id)
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.put("/api/assessments/{assessment_id}")
def update_assessment(
    assessment_id: str,
    assessment: Assessment,
    current_admin: dict = Depends(get_current_admin)
):
    try:
        assessment_data = assessment.model_dump()

        result = assessments_collection.update_one(
            {"_id": ObjectId(assessment_id)},
            {
                "$set": assessment_data
            }
        )

        if result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Assessment not found"
            )

        return {
            "message": "Assessment updated successfully",
            "assessment_id": assessment_id
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )   

@app.get("/api/assessments")
def get_assessments():
    try:
        assessments = list(
            assessments_collection.find()
        )

        for assessment in assessments:
            assessment["_id"] = str(assessment["_id"])

        return assessments

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get("/api/assessments/{assessment_id}")
def get_assessment(assessment_id: str):
    try:
        from bson import ObjectId

        assessment = assessments_collection.find_one(
            {"_id": ObjectId(assessment_id)}
        )

        if not assessment:
            raise HTTPException(
                status_code=404,
                detail="Assessment not found"
            )

        assessment["_id"] = str(assessment["_id"])

        return assessment

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.post("/api/attempts")
def create_attempt(
    attempt: Attempt,
    current_user: dict = Depends(get_current_user)
):
    try:
        user = users_collection.find_one(
            {"_id": ObjectId(current_user["user_id"])}
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        attempt_data = attempt.model_dump()

        # Use authenticated user's identity
        attempt_data["candidateName"] = user["name"]
        attempt_data["candidateEmail"] = user["email"]

        # Set submission time on the server
        attempt_data["submittedAt"] = datetime.now(timezone.utc)

        result = attempts_collection.insert_one(
            attempt_data
        )

        return {
            "message": "Attempt saved successfully",
            "attempt_id": str(result.inserted_id)
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )

@app.get("/api/assessments/{assessment_id}/attempts")
def get_assessment_attempts(
    assessment_id: str,
    current_admin: dict = Depends(get_current_admin)
):
    try:
        attempts = list(
            attempts_collection.find(
                {"assessmentId": assessment_id}
            )
        )

        for attempt in attempts:
            attempt["_id"] = str(attempt["_id"])

        return attempts

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )        

@app.post("/api/register")
def register_user(user: User):
    try:
        existing_user = users_collection.find_one(
            {"email": user.email}
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="User with this email already exists"
            )

        user_data = user.model_dump()

        hashed_password = bcrypt.hashpw(
        user.password.encode("utf-8"),
        bcrypt.gensalt()
        ).decode("utf-8")

        user_data["password"] = hashed_password

        result = users_collection.insert_one(
            user_data
        )

        return {
            "message": "User registered successfully",
            "user_id": str(result.inserted_id)
        }

    except HTTPException:
        raise

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=str(error)
        )    

@app.post("/api/login")
def login_user(login: LoginRequest):
    try:
        user = users_collection.find_one(
            {"email": login.email}
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        password_matches = bcrypt.checkpw(
            login.password.encode("utf-8"),
            user["password"].encode("utf-8")
        )

        if not password_matches:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        token = jwt.encode(
    {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=2)
    },
    SECRET_KEY,
    algorithm=ALGORITHM
)

        return {
        "message": "Login successful",
        "token": token,
        "user": {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
        }
         }

    except HTTPException:
     raise

    except Exception as error:
     raise HTTPException(
            status_code=500,
            detail=str(error)
        )    