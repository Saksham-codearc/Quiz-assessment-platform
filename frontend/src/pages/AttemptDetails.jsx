import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AttemptDetails() {
  const navigate = useNavigate()
  const { id, attemptId } = useParams()

  const [assessment, setAssessment] = useState(null)
  const [attempt, setAttempt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        const token = localStorage.getItem('quizchain_token')

        const [assessmentResponse, attemptsResponse] =
        await Promise.all([
        fetch(
        `http://https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}`
        ),
        fetch(
        `http://https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}/attempts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    ),
  ])

        if (!assessmentResponse.ok) {
          throw new Error('Assessment not found')
        }

        if (!attemptsResponse.ok) {
          throw new Error('Attempts could not be loaded')
        }

        const assessmentData =
          await assessmentResponse.json()

        const attemptsData =
          await attemptsResponse.json()

        const selectedAttempt = attemptsData.find(
          (item) => item._id === attemptId
        )

        if (!selectedAttempt) {
          throw new Error('Attempt not found')
        }

        setAssessment(assessmentData)
        setAttempt(selectedAttempt)
      } catch (error) {
        console.error(error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAttemptDetails()
  }, [id, attemptId])

  if (loading) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">
            ATTEMPT DETAILS
          </span>

          <h1>Loading attempt...</h1>
        </div>
      </main>
    )
  }

  if (error || !assessment || !attempt) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">
            ERROR
          </span>

          <h1>
            {error || 'Attempt not found.'}
          </h1>

          <button
            className="primary-btn"
            onClick={() =>
              navigate(`/assessment/${id}/results`)
            }
          >
            ← Back to Results
          </button>
        </div>
      </main>
    )
  }

  const answers = attempt.answers || {}

  return (
    <div className="create-page">
      <header className="create-header">
        <button
          className="back-button"
          onClick={() =>
            navigate(`/assessment/${id}/results`)
          }
        >
          ← Back to Results
        </button>
      </header>

      <main className="create-container">

        {/* Header */}
        <div className="create-intro">
          <span className="section-tag">
            ATTEMPT DETAILS
          </span>

          <h1>
            {attempt.candidateName || 'Candidate'}
          </h1>

          <p>
            {attempt.candidateEmail || ''}
          </p>
        </div>

        {/* Result summary */}
        <section className="results-stats">

          <div className="result-stat-card">
            <span className="result-stat-label">
              SCORE
            </span>

            <strong>
              {attempt.score} / {attempt.totalMarks}
            </strong>

            <span className="result-stat-description">
              Final score
            </span>
          </div>

          <div className="result-stat-card">
            <span className="result-stat-label">
              PERCENTAGE
            </span>

            <strong>
              {Number(
                attempt.percentage || 0
              ).toFixed(1)}
              %
            </strong>

            <span className="result-stat-description">
              Overall performance
            </span>
          </div>

          <div className="result-stat-card">
            <span className="result-stat-label">
              CORRECT
            </span>

            <strong>
              {attempt.correct}
            </strong>

            <span className="result-stat-description">
              Correct answers
            </span>
          </div>

          <div className="result-stat-card">
            <span className="result-stat-label">
              STATUS
            </span>

            <strong>
              {attempt.passed
                ? 'PASSED'
                : 'FAILED'}
            </strong>

            <span className="result-stat-description">
              Assessment result
            </span>
          </div>

        </section>

        {/* Question review */}
        <section className="form-card">

          <div className="form-card-heading">
            <div className="form-number">01</div>

            <div>
              <h2>Question Review</h2>

              <p>
                Review the candidate's answers.
              </p>
            </div>
          </div>

          <div className="attempt-review-list">

            {assessment.questions.map(
              (question, index) => {
                const selectedAnswer =
                  answers[index]

                const isCorrect =
                  selectedAnswer ===
                  question.correctAnswer

                const isUnanswered =
                  !selectedAnswer

                return (
                  <div
                    className={`review-question ${
                      isCorrect
                        ? 'review-correct'
                        : isUnanswered
                        ? 'review-unanswered'
                        : 'review-incorrect'
                    }`}
                    key={question.id || index}
                  >

                    <div className="review-question-header">

                      <span className="review-question-number">
                        QUESTION {index + 1}
                      </span>

                      <span
                        className={`review-status ${
                          isCorrect
                            ? 'correct'
                            : isUnanswered
                            ? 'unanswered'
                            : 'incorrect'
                        }`}
                      >
                        {isCorrect
                          ? '✓ CORRECT'
                          : isUnanswered
                          ? '— UNANSWERED'
                          : '✕ INCORRECT'}
                      </span>

                    </div>

                    <h3>
                      {question.question}
                    </h3>

                    <div className="review-answers">

                      <div>
                        <span>
                          Candidate answer
                        </span>

                        <strong>
                          {selectedAnswer
                            ? `${selectedAnswer}. ${
                                question.options[
                                  selectedAnswer
                                ]
                              }`
                            : 'Not answered'}
                        </strong>
                      </div>

                      <div>
                        <span>
                          Correct answer
                        </span>

                        <strong>
                          {
                            question.correctAnswer
                          }.{' '}
                          {
                            question.options[
                              question.correctAnswer
                            ]
                          }
                        </strong>
                      </div>

                    </div>

                  </div>
                )
              }
            )}

          </div>

        </section>

        <div className="form-actions">

          <button
            type="button"
            className="cancel-btn"
            onClick={() =>
              navigate(`/assessment/${id}/results`)
            }
          >
            ← Back to Results
          </button>

        </div>

      </main>
    </div>
  )
}

export default AttemptDetails