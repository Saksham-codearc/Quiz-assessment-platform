import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom'

import CreateAssessment from './pages/CreateAssessment'
import QuestionBuilder from './pages/QuestionBuilder'
import AssessmentDetails from './pages/AssessmentDetails'
import TakeAssessment from './pages/TakeAssessment'
import Results from './pages/Results'
import CandidateDetails from './pages/CandidateDetails'
import AttemptDetails from './pages/AttemptDetails'
import Login from './pages/Login'
import ProtectedRoute from './ProtectedRoute'
import './App.css'

function Home() {
   const navigate = useNavigate()
   const [currentUser, setCurrentUser] = useState(() => {
   const savedUser = localStorage.getItem('quizchain_user')

    return savedUser
      ? JSON.parse(savedUser)
      : null
  })

  const [menuOpen, setMenuOpen] = useState(false)

  const [assessments, setAssessments] = useState([])

  const [loadingAssessments, setLoadingAssessments] = useState(true)

  useEffect(() => {
    const fetchAssessments = async () => {
      try {
        const response = await fetch(
          'https://quizchain-backend-y6nz.onrender.com/api/assessments'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch assessments')
        }

        const data = await response.json()

        setAssessments(data)
      } catch (error) {
        console.error('Error fetching assessments:', error)
      } finally {
        setLoadingAssessments(false)
      }
    }

    fetchAssessments()
  }, [])

  return (
    <div className="app">
      {/* Navigation */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <div className="brand-logo">Q</div>
            <span>QuizChain</span>
          </div>

          <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
            <a href="#home" onClick={() => setMenuOpen(false)}>
              Home
            </a>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>
              How It Works
            </a>
            <a href="#about" onClick={() => setMenuOpen(false)}>
              About
            </a>
          </nav>

          <div className="nav-actions">
            {currentUser ? (
  <div className="user-menu">
    <span className="user-name">
      {currentUser.name}
    </span>

    <button
      type="button"
      className="login-btn"
      onClick={() => {
        localStorage.removeItem('quizchain_user')
        setCurrentUser(null)
      }}
    >
      Logout
    </button>
  </div>
) : (
  <button
    type="button"
    className="login-btn"
    onClick={() => {
      window.location.href = '/login'
    }}
  >
    Login
  </button>
)}
          </div>

          <button
            className="menu-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section id="home" className="hero-section">
          <div className="hero-content">
            <div className="eyebrow">
              <span className="status-dot"></span>
              Smart Assessment Platform
            </div>

            <h1>
              Assess knowledge.
              <br />
              <span>Build confidence.</span>
            </h1>

            <p className="hero-description">
              QuizChain is a modern assessment platform designed to make
              creating, conducting and analyzing quizzes simple, secure and
              intelligent.
            </p>

            <div className="hero-buttons">
  {currentUser?.role?.toUpperCase() === 'ADMIN' ? (
    <>
      <button
        className="primary-btn"
        onClick={() => navigate('/create')}
      >
        Create Assessment
        <span>→</span>
      </button>

      <button
        className="secondary-btn"
        onClick={() => {
          if (assessments.length > 0) {
            navigate(
              `/assessment/${assessments[0]._id}/results`
            )
          }
        }}
      >
        View Results
        <span>→</span>
      </button>
    </>
  ) : (
    <button
      className="primary-btn"
      onClick={() => {
        document
          .getElementById('assessments')
          ?.scrollIntoView({ behavior: 'smooth' })
      }}
    >
      Take Quiz
      <span>→</span>
    </button>
  )}
</div>

            <div className="hero-stats">
              <div>
                <strong>01</strong>
                <span>Create</span>
              </div>

              <div className="stat-line"></div>

              <div>
                <strong>02</strong>
                <span>Attempt</span>
              </div>

              <div className="stat-line"></div>

              <div>
                <strong>03</strong>
                <span>Analyze</span>
              </div>
            </div>
          </div>

          {/* Assessment Preview */}
          <div className="hero-visual">
            <div className="visual-glow"></div>

            <div className="quiz-card">
              <div className="quiz-top">
                <div>
                  <span className="small-label">LIVE ASSESSMENT</span>
                  <h3>Computer Science</h3>
                </div>

                <div className="timer">
                  <span>◷</span>
                  18:42
                </div>
              </div>

              <div className="progress-info">
                <span>Question 7 of 20</span>
                <span>35%</span>
              </div>

              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>

              <div className="question">
                <span className="question-number">07</span>

                <h4>
                  Which data structure follows the
                  <br />
                  FIFO principle?
                </h4>
              </div>

              <div className="options">
                <div className="option">
                  <span>A</span>
                  Stack
                </div>

                <div className="option selected">
                  <span>B</span>
                  Queue
                  <b>✓</b>
                </div>

                <div className="option">
                  <span>C</span>
                  Tree
                </div>

                <div className="option">
                  <span>D</span>
                  Graph
                </div>
              </div>

              <div className="quiz-footer">
                <span>+1 correct &nbsp; • &nbsp; −0.25 incorrect</span>
                <button>Next →</button>
              </div>
            </div>
          </div>
        </section> 

                {/* Saved Assessments */}
        <section id="assessments" className="features-section">
          <div className="section-heading">
            <span className="section-tag">YOUR ASSESSMENTS</span>

            <h2>Saved assessments.</h2>

            <p>
              Assessments created through QuizChain are stored securely
              and available here.
            </p>
          </div>

          {loadingAssessments ? (
            <p>Loading assessments...</p>
          ) : assessments.length === 0 ? (
            <p>No assessments created yet.</p>
          ) : (
            <div className="feature-grid">
              {assessments.map((assessment) => (
                <article
                  className="feature-card"
                  key={assessment._id}
                >
                  <div className="feature-icon">✓</div>

                  <h3>{assessment.title}</h3>

                  <p>
                    <strong>Subject:</strong>{' '}
                    {assessment.subject}
                  </p>

                  <p>
                    {assessment.description ||
                      'No description provided.'}
                  </p>

                  <p>
                    <strong>
                      {assessment.questions?.length || 0}
                    </strong>{' '}
                    questions
                  </p>

                  {currentUser?.role?.toUpperCase() === 'ADMIN'? (
    <button
    className="primary-btn"
    onClick={() =>
      navigate(`/assessment/${assessment._id}/results`)
     }
     >
    View Results
    <span>→</span>
    </button>
     ) : (
    <button
      className="primary-btn"
      onClick={() =>
      navigate(`/assessment/${assessment._id}`)
    }
     >
    Take Quiz
    <span>→</span>
    </button>
    )}
        </article>
              ))}
            </div>
          )}
        </section>

        {/* Features */}
        <section id="features" className="features-section"></section>

        {/* Features */}
        <section id="features" className="features-section">
          <div className="section-heading">
            <span className="section-tag">WHY QUIZCHAIN</span>
            <h2>Everything you need for better assessments.</h2>
            <p>
              From quiz creation to final performance analysis, QuizChain
              brings the complete assessment workflow into one platform.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon">✦</div>
              <h3>Smart Assessments</h3>
              <p>
                Create structured assessments with configurable questions,
                marks, time limits and difficulty.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">✓</div>
              <h3>Flexible Scoring</h3>
              <p>
                Support positive marks, negative marking and configurable
                scoring rules for accurate evaluation.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">◫</div>
              <h3>Performance Analytics</h3>
              <p>
                Analyze scores, attempts and performance to understand how
                candidates are progressing.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Fast & Reliable</h3>
              <p>
                A responsive assessment experience designed for classrooms,
                practice tests and competitive examinations.
              </p>
            </article>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="workflow-section">
          <div className="section-heading">
            <span className="section-tag">HOW IT WORKS</span>
            <h2>One simple assessment workflow.</h2>
          </div>

          <div className="workflow">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <h3>Create</h3>
              <p>
                Build an assessment and configure questions, marks,
                duration and scoring rules.
              </p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">02</div>
              <h3>Attempt</h3>
              <p>
                Candidates take the assessment through a focused and
                distraction-free interface.
              </p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <div className="step-number">03</div>
              <h3>Analyze</h3>
              <p>
                Review results and performance insights after the
                assessment is completed.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="about" className="cta-section">
          <div className="cta-content">
            <span className="section-tag">READY TO BEGIN?</span>
            <h2>Build your next assessment with QuizChain.</h2>
            <p>
              A clean, powerful and scalable platform for modern
              assessments.
            </p>

            <button className="primary-btn">
              Get Started
              <span>→</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-brand">
          <div className="brand-logo">Q</div>
          <span>QuizChain</span>
        </div>

        <p>© 2026 QuizChain. Smart assessments, simplified.</p>
      </footer>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create" element={<ProtectedRoute><CreateAssessment /></ProtectedRoute>} />
        <Route path="/questions" element={<ProtectedRoute><QuestionBuilder /></ProtectedRoute>} />
        <Route path="/assessment/:id" element={<AssessmentDetails />} />
        <Route path="/assessment/:id/candidate" element={<CandidateDetails />} />
        <Route path="/assessment/:id/start" element={<TakeAssessment />} />
        <Route path="/assessment/:id/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
        <Route path="/assessment/:id/attempt/:attemptId" element={<ProtectedRoute><AttemptDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App