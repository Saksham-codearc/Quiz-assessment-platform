# QuizChain – Online Assessment Platform

QuizChain is a full-stack online assessment platform that allows administrators to create and manage assessments while students can securely take quizzes and receive their results.

The platform provides separate workflows for administrators and students with authentication, role-based access control, assessment management, quiz submission, result calculation, and performance analytics.

---

## Features

### Admin Features

- Secure admin login
- Create assessments
- Add multiple-choice questions
- Configure:
  - Assessment title
  - Subject
  - Description
  - Marks per question
  - Negative marking
  - Passing percentage
  - Duration
- Save and update assessments
- View assessments
- View assessment results directly
- View total attempts
- View average score
- View highest score
- View pass rate
- View student attempt details

### Student Features

- Secure student login
- View available assessments
- View assessment details
- Start an assessment
- Answer multiple-choice questions
- Submit assessment
- Automatic result calculation
- View score and percentage
- View pass/fail status
- Save assessment attempt

### Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Role-based access control
- Protected admin routes
- Protected API endpoints
- CORS configuration
- Environment variables for sensitive configuration

---

## Technology Stack

### Frontend

- React.js
- React Router
- JavaScript
- HTML
- CSS
- Vite

### Backend

- Python
- FastAPI
- Pydantic
- JWT
- bcrypt

### Database

- MongoDB
- PyMongo

### Development Tools

- VS Code
- Git
- GitHub
- Postman / Swagger UI

---

## System Architecture

```text
                 ┌─────────────────────┐
                 │       Student       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │   React Frontend    │
                 │                     │
                 │ Login / Quiz /      │
                 │ Results / Dashboard │
                 └──────────┬──────────┘
                            │ REST API
                            ▼
                 ┌─────────────────────┐
                 │   FastAPI Backend   │
                 │                     │
                 │ Authentication      │
                 │ Assessments         │
                 │ Attempts            │
                 │ Authorization       │
                 └──────────┬──────────┘
                            │
                            ▼
                 ┌─────────────────────┐
                 │      MongoDB        │
                 │                     │
                 │ Users               │
                 │ Assessments         │
                 │ Attempts            │
                 └─────────────────────┘

Application Workflow
Admin Workflow
Admin Login
     ↓
Admin Dashboard
     ↓
Create Assessment
     ↓
Add Questions
     ↓
Save Assessment
     ↓
Assessment Available
     ↓
View Results
     ↓
View Student Attempts
Student Workflow
Student Login
     ↓
View Assessments
     ↓
Select Assessment
     ↓
Start Quiz
     ↓
Answer Questions
     ↓
Submit Quiz
     ↓
Calculate Result
     ↓
Save Attempt
     ↓
Display Result
API Endpoints
Method	Endpoint	Purpose
GET	/api/health	Check backend status
POST	/api/login	User login
POST	/api/register	User registration endpoint
POST	/api/assessments	Create assessment
GET	/api/assessments	Get assessments
GET	/api/assessments/{id}	Get assessment details
PUT	/api/assessments/{id}	Update assessment
POST	/api/attempts	Save student attempt
GET	/api/assessments/{id}/attempts	Get attempts for an assessment
Authentication

QuizChain uses JWT authentication.

After successful login, the backend generates a JWT token containing user information such as:

User ID
Email
Role
Token expiration

The frontend uses the authenticated session to determine whether the user is an administrator or student.

Database Collections
Users

Stores user authentication and role information.

Example fields:

_id
name
email
password
role
Assessments

Stores assessment configuration and questions.

Example fields:

_id
title
subject
description
marksPerQuestion
negativeMarking
passingPercentage
duration
questions
Attempts

Stores student assessment attempts.

Example fields:

_id
assessmentId
candidateName
candidateEmail
answers
correct
incorrect
unanswered
score
totalMarks
percentage
passed
submittedAt
Running the Project Locally
Prerequisites

Make sure the following are installed:

Node.js
Python
MongoDB
Git
1. Clone the repository
git clone https://github.com/Saksham-codearc/Quiz-assessment-platform.git
cd Quiz-assessment-platform
2. Backend Setup

Go to the backend directory:

cd backend

Create and activate a virtual environment:

python -m venv venv

Windows:

venv\Scripts\activate

Install dependencies:

pip install fastapi uvicorn pymongo bcrypt pyjwt python-dotenv

Create a .env file inside the backend directory:

MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

Start the backend:

uvicorn main:app --reload

Backend will normally run at:

http://127.0.0.1:8000

Swagger API documentation:

http://127.0.0.1:8000/docs
3. Frontend Setup

Open another terminal and go to:

cd frontend

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally run at:

http://localhost:5173
Environment Variables

Sensitive information should not be committed to GitHub.

Example:

MONGO_URI=your_mongodb_connection_string
SECRET_KEY=your_secret_key

The actual .env file is excluded from the repository using .gitignore.

Project Structure
Quiz-assessment-platform/
│
├── backend/
│   ├── main.py
│   ├── .gitignore
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── CreateAssessment.jsx
│   │   │   ├── QuestionBuilder.jsx
│   │   │   ├── AssessmentDetails.jsx
│   │   │   ├── CandidateDetails.jsx
│   │   │   ├── TakeAssessment.jsx
│   │   │   ├── Results.jsx
│   │   │   └── AttemptDetails.jsx
│   │   │
│   │   ├── App.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── App.css
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── package.json
├── package-lock.json
└── README.md
Future Enhancements

Possible future improvements include:

Server-side result calculation
Question randomization
Assessment scheduling
Email notifications
Detailed student performance reports
Admin dashboard charts
Timer enforcement on the backend
Password reset functionality
Deployment to a cloud platform
Improved analytics and reporting
Project Status

The core QuizChain assessment workflow is complete and functional.

The application supports authenticated administrator and student workflows, assessment creation, quiz participation, attempt storage, and result analytics.

Author

Saksham

B.Tech – Computer Science & Engineering

GitHub:
https://github.com/Saksham-codearc
