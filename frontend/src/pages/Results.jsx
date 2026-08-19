import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function Results() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [assessment, setAssessment] = useState(null)
  const [attempts, setAttempts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const [assessmentResponse, attemptsResponse] =
          await Promise.all([
            fetch(
              `https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}`
            ),
            fetch(
              `https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}/attempts`,
             {
              headers: {
              Authorization: `Bearer ${localStorage.getItem('quizchain_token')}`,
               },
             }
             ),
          ])

        if (!assessmentResponse.ok) {
          throw new Error('Assessment not found')
        }

        if (!attemptsResponse.ok) {
          throw new Error('Could not load attempts')
        }

        const assessmentData =
          await assessmentResponse.json()

        const attemptsData =
          await attemptsResponse.json()

        setAssessment(assessmentData)
        setAttempts(attemptsData)
      } catch (error) {
        console.error(error)
        setError('Could not load results.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [id])

  if (loading) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">
            RESULTS
          </span>

          <h1>Loading results...</h1>
        </div>
      </main>
    )
  }

  if (error || !assessment) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">
            ERROR
          </span>

          <h1>
            {error || 'Assessment not found.'}
          </h1>

          <button
            className="primary-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Home
          </button>
        </div>
      </main>
    )
  }

  const totalAttempts = attempts.length

  const averagePercentage =
    totalAttempts > 0
      ? attempts.reduce(
          (sum, attempt) =>
            sum + Number(attempt.percentage || 0),
          0
        ) / totalAttempts
      : 0

  const highestPercentage =
    totalAttempts > 0
      ? Math.max(
          ...attempts.map((attempt) =>
            Number(attempt.percentage || 0)
          )
        )
      : 0

  const passedAttempts = attempts.filter(
    (attempt) => attempt.passed
  ).length

  const passRate =
    totalAttempts > 0
      ? (passedAttempts / totalAttempts) * 100
      : 0

   const totalCorrect = attempts.reduce(
  (sum, attempt) => sum + Number(attempt.correct || 0),
  0
)

const totalIncorrect = attempts.reduce(
  (sum, attempt) => sum + Number(attempt.incorrect || 0),
  0
)

const totalUnanswered = attempts.reduce(
  (sum, attempt) =>
    sum + Number(attempt.unanswered || 0),
  0
)

const totalAnswered =
  totalCorrect + totalIncorrect + totalUnanswered

const correctPercentage =
  totalAnswered > 0
    ? (totalCorrect / totalAnswered) * 100
    : 0

const incorrectPercentage =
  totalAnswered > 0
    ? (totalIncorrect / totalAnswered) * 100
    : 0

const unansweredPercentage =
  totalAnswered > 0
    ? (totalUnanswered / totalAnswered) * 100
    : 0   

  return (
  <div className="create-page">
    <header className="create-header">
      <button
        className="back-button"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>
    </header>

    <main className="create-container">

      {/* Header */}
      <div className="create-intro">
        <span className="section-tag">
          RESULTS & ANALYTICS
        </span>

        <h1>{assessment.title}</h1>

        <p>
          Assessment performance overview and attempt history.
        </p>
      </div>

      {/* Statistics */}
      <section className="results-stats">

        <div className="result-stat-card">
          <span className="result-stat-label">
            TOTAL ATTEMPTS
          </span>

          <strong>{totalAttempts}</strong>

          <span className="result-stat-description">
            Submitted attempts
          </span>
        </div>

        <div className="result-stat-card">
          <span className="result-stat-label">
            AVERAGE SCORE
          </span>

          <strong>
            {averagePercentage.toFixed(0)}%
          </strong>

          <span className="result-stat-description">
            Across all attempts
          </span>
        </div>

        <div className="result-stat-card">
          <span className="result-stat-label">
            HIGHEST SCORE
          </span>

          <strong>
            {highestPercentage.toFixed(0)}%
          </strong>

          <span className="result-stat-description">
            Best performance
          </span>
        </div>

        <div className="result-stat-card">
          <span className="result-stat-label">
            PASS RATE
          </span>

          <strong>
            {passRate.toFixed(0)}%
          </strong>

          <span className="result-stat-description">
            Candidates passed
          </span>
        </div>

      </section>

      {/* Performance overview */}
      <section className="performance-card">

        <div className="performance-header">
          <div>
            <span className="result-stat-label">
              OVERALL PERFORMANCE
            </span>

            <h2>
              {averagePercentage.toFixed(1)}%
            </h2>
          </div>

          <div className="performance-badge">
            {passRate >= 50
              ? '✓ Good Performance'
              : 'Needs Improvement'}
          </div>
        </div>

        <div className="performance-bar">
          <div
            className="performance-fill"
            style={{
              width: `${Math.min(
                averagePercentage,
                100
              )}%`,
            }}
          />
        </div>

        <div className="performance-footer">
          <span>
            Passing requirement:{' '}
            {assessment.passingPercentage}%
          </span>

          <span>
            {passedAttempts} of {totalAttempts} passed
          </span>
        </div>

      </section>

      {/* Answer Performance */}
<section className="form-card answer-performance">

  <div className="form-card-heading">
    <div className="form-number">02</div>

    <div>
      <h2>Answer Performance</h2>
      <p>
        Overall answer distribution across all attempts.
      </p>
    </div>
  </div>

  <div className="answer-chart">

    <div className="answer-row">
      <div className="answer-info">
        <span>Correct</span>
        <strong>
          {totalCorrect}
        </strong>
      </div>

      <div className="answer-bar">
        <div
          className="answer-fill correct"
          style={{
            width: `${correctPercentage}%`,
          }}
        />
      </div>

      <span className="answer-percent">
        {correctPercentage.toFixed(1)}%
      </span>
    </div>

    <div className="answer-row">
      <div className="answer-info">
        <span>Incorrect</span>
        <strong>
          {totalIncorrect}
        </strong>
      </div>

      <div className="answer-bar">
        <div
          className="answer-fill incorrect"
          style={{
            width: `${incorrectPercentage}%`,
          }}
        />
      </div>

      <span className="answer-percent">
        {incorrectPercentage.toFixed(1)}%
      </span>
    </div>

    <div className="answer-row">
      <div className="answer-info">
        <span>Unanswered</span>
        <strong>
          {totalUnanswered}
        </strong>
      </div>

      <div className="answer-bar">
        <div
          className="answer-fill unanswered"
          style={{
            width: `${unansweredPercentage}%`,
          }}
        />
      </div>

      <span className="answer-percent">
        {unansweredPercentage.toFixed(1)}%
      </span>
    </div>

    </div>

   </section>

      {/* Attempts */}
      <section className="form-card">

        <div className="form-card-heading">
          <div className="form-number">03</div>

          <div>
            <h2>Attempt History</h2>

            <p>
              Individual assessment submissions.
            </p>
          </div>
        </div>

        {attempts.length === 0 ? (
          <div className="empty-results">
            <h3>No attempts yet</h3>

            <p>
              Candidates haven't submitted this
              assessment yet.
            </p>
          </div>
        ) : (
          <div className="attempt-list">

            {attempts.map((attempt, index) => (

              <div
                className="attempt-card"
                key={attempt._id}
              >

                <div className="attempt-top">

                  <div>
                    <span className="attempt-number">
                      ATTEMPT #{index + 1}
                    </span>

                    <h3>
                      {Number(
                        attempt.percentage || 0
                      ).toFixed(1)}
                      %
                    </h3>

                    <p className="attempt-candidate">
                    {attempt.candidateName || 'Candidate'}
                    </p>

                    <p className="attempt-email">
                    {attempt.candidateEmail || ''}
                    </p>

                    <p className="attempt-date">
                    {attempt.submittedAt
                    ? `Submitted: ${new Date(
                    attempt.submittedAt
                     ).toLocaleString('en-IN', {
                      timeZone: 'Asia/Kolkata',
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}`
                    : 'Submission time unavailable'}
                   </p>
                  </div>

                  <span
                    className={`attempt-status ${
                      attempt.passed
                        ? 'passed'
                        : 'failed'
                    }`}
                  >
                    {attempt.passed
                      ? '✓ PASSED'
                      : '✕ FAILED'}
                  </span>

                </div>

                <div className="attempt-details">

                  <div>
                    <span>Score</span>

                    <strong>
                      {attempt.score} /{' '}
                      {attempt.totalMarks}
                    </strong>
                  </div>

                  <div>
                    <span>Correct</span>

                    <strong>
                      {attempt.correct}
                    </strong>
                  </div>

                  <div>
                    <span>Incorrect</span>

                    <strong>
                      {attempt.incorrect}
                    </strong>
                  </div>

                  <div>
                    <span>Unanswered</span>

                    <strong>
                      {attempt.unanswered}
                    </strong>
                  </div>

                </div>

                <div className="attempt-actions">
         <button
           type="button"
           className="primary-btn"
           onClick={() => {
         const url = `/assessment/${id}/attempt/${attempt._id}`
         console.log('Opening attempt:', url)
         navigate(url)
         }}
        >
         View Attempt
         <span>→</span>
         </button>
         </div>

              </div>

            ))}

          </div>
        )}

      </section>

      {/* Bottom actions */}
      <div className="form-actions">

        <button
          type="button"
          className="cancel-btn"
          onClick={() =>
            navigate(`/assessment/${id}`)
          }
        >
          ← View Assessment
        </button>

        <button
          type="button"
          className="primary-btn"
          onClick={() =>
            navigate(`/assessment/${id}/start`)
          }
        >
          Take Assessment Again
          <span>→</span>
        </button>

      </div>

    </main>
  </div>
 )
}

export default Results 
