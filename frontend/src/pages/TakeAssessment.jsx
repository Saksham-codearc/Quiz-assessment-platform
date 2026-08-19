import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function TakeAssessment() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [assessment, setAssessment] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [result, setResult] = useState(null)
  const [candidate, setCandidate] = useState(null)

  // Fetch assessment
  useEffect(() => {
  const savedCandidate = sessionStorage.getItem(
    'quizchain_candidate'
  )

  if (savedCandidate) {
    setCandidate(JSON.parse(savedCandidate))
  }
  }, [])

    useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(
          `https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}`
        )

        if (!response.ok) {
          throw new Error('Assessment not found')
        }

        const data = await response.json()

        setAssessment(data)
        setTimeLeft(Number(data.duration || 30) * 60)
      } catch (error) {
        console.error(error)
        setError('Could not load assessment.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [id])

  // Countdown timer
  useEffect(() => {
    if (
      loading ||
      !assessment ||
      submitted ||
      timeLeft === null
    ) {
      return
    }

    if (timeLeft <= 0) {
      handleSubmit()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, loading, assessment, submitted])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds
    ).padStart(2, '0')}`
  }

  const selectAnswer = (option) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: option,
    }))
  }

  const handleSubmit = async () => {
    if (!assessment || submitted) {
      return
    }

    const questions = assessment.questions || []

    let correct = 0
    let incorrect = 0
    let unanswered = 0

    questions.forEach((question, index) => {
      const selectedAnswer = answers[index]

      if (!selectedAnswer) {
        unanswered++
      } else if (
        selectedAnswer === question.correctAnswer
      ) {
        correct++
      } else {
        incorrect++
      }
    })

    const marksPerQuestion =
      Number(assessment.marksPerQuestion) || 1

    const negativeMarking =
      Number(assessment.negativeMarking) || 0

    const totalQuestions = questions.length

    const totalMarks = totalQuestions * marksPerQuestion

    const score =
      correct * marksPerQuestion -
      incorrect * negativeMarking

    const percentage =
      totalMarks > 0
        ? Math.max(0, (score / totalMarks) * 100)
        : 0

    const passed =
      percentage >=
      Number(assessment.passingPercentage || 40)

    const finalScore = Math.max(0, score)

  const finalResult = {
  correct,
  incorrect,
  unanswered,
  totalQuestions,
  score: finalScore,
  totalMarks,
  percentage,
  passed,
}

try {
  const response = await fetch(
    'https://quizchain-backend-y6nz.onrender.com/api/attempts',
    {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json',
       Authorization: `Bearer ${localStorage.getItem('quizchain_token')}`,
       },
      body: JSON.stringify({
           assessmentId: id,
           candidateName: candidate?.name || 'Unknown',
           candidateEmail: candidate?.email || 'Unknown',
           answers,
           correct,
           incorrect,
           unanswered,
           score: finalScore,
           totalMarks,
           percentage,
           passed,
           }),
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.detail || 'Failed to save attempt'
    )
  }

  console.log('Attempt saved:', data)

  setResult(finalResult)
  setSubmitted(true)
} catch (error) {
  console.error('Error saving attempt:', error)

  alert(
    'Your result was calculated, but the attempt could not be saved.'
  )
}
  }

  if (loading) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">ASSESSMENT</span>
          <h1>Loading assessment...</h1>
        </div>
      </main>
    )
  }

  if (error || !assessment) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">ERROR</span>

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

  // Result screen
  if (submitted && result) {
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
          <div className="create-intro">
            <span className="section-tag">
              ASSESSMENT RESULT
            </span>

            <h1>
              {result.passed
                ? 'Assessment Passed!'
                : 'Assessment Failed'}
            </h1>

            <p>{assessment.title}</p>
          </div>

          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">01</div>

              <div>
                <h2>Your Result</h2>
                <p>Here is your assessment performance.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Score</label>
                <input
                  value={`${result.score} / ${result.totalMarks}`}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Percentage</label>
                <input
                  value={`${result.percentage.toFixed(2)}%`}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Correct Answers</label>
                <input
                  value={result.correct}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Incorrect Answers</label>
                <input
                  value={result.incorrect}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Unanswered</label>
                <input
                  value={result.unanswered}
                  readOnly
                />
              </div>

              <div className="form-group">
                <label>Passing Percentage</label>
                <input
                  value={`${assessment.passingPercentage}%`}
                  readOnly
                />
              </div>
            </div>
          </section>

          <div className="form-actions">
            <button
             type="button"
             className="primary-btn"
             onClick={() =>
             navigate(`/assessment/${id}/results`)
             }
            >
             View Results
           <span>→</span>
           </button>
          </div>
        </main>
      </div>
    )
  }

  const questions = assessment.questions || []
  const question = questions[currentQuestion]

  if (!question) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <h1>No questions available.</h1>
        </div>
      </main>
    )
  }

  return (
    <div className="create-page">
      <header className="create-header">
        <button
          className="back-button"
          onClick={() =>
            navigate(`/assessment/${id}`)
          }
        >
          ← Exit Assessment
        </button>

        <div className="assessment-timer">
          ⏱ {formatTime(timeLeft)}
        </div>
      </header>

      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">
            LIVE ASSESSMENT
          </span>

          <h1>{assessment.title}</h1>

          <p>
            Question {currentQuestion + 1} of{' '}
            {questions.length}
          </p>
        </div>

        <section className="form-card">
          <div className="form-card-heading">
            <div className="form-number">
              {String(currentQuestion + 1).padStart(2, '0')}
            </div>

            <div>
              <h2>Question</h2>

              <p>
                {answers[currentQuestion]
                  ? 'Answer selected'
                  : 'Select the correct answer.'}
              </p>
            </div>
          </div>

          <div className="quiz-question">
            <h2>{question.question}</h2>
          </div>

          <div className="quiz-options">
            {['A', 'B', 'C', 'D'].map((option) => (
              <button
                type="button"
                key={option}
                className={`quiz-option ${
                  answers[currentQuestion] === option
                    ? 'selected'
                    : ''
                }`}
                onClick={() => selectAnswer(option)}
              >
                <span className="option-letter">
                  {option}
                </span>

                <span>
                  {question.options[option]}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="form-card">
          <div className="form-card-heading">
            <div className="form-number">02</div>

            <div>
              <h2>Question Navigation</h2>

              <p>
                {Object.keys(answers).length} of{' '}
                {questions.length} answered
              </p>
            </div>
          </div>

          <div className="question-navigation">
            {questions.map((_, index) => (
              <button
                type="button"
                key={index}
                className={
                  currentQuestion === index
                    ? 'active'
                    : answers[index]
                    ? 'answered'
                    : ''
                }
                onClick={() =>
                  setCurrentQuestion(index)
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            disabled={currentQuestion === 0}
            onClick={() =>
              setCurrentQuestion(
                (previous) => previous - 1
              )
            }
          >
            ← Previous
          </button>

          {currentQuestion < questions.length - 1 ? (
            <button
              type="button"
              className="primary-btn"
              onClick={() =>
                setCurrentQuestion(
                  (previous) => previous + 1
                )
              }
            >
              Next
              <span>→</span>
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              onClick={handleSubmit}
            >
              Submit Assessment
              <span>✓</span>
            </button>
          )}
        </div>
      </main>
    </div>
  )
}

export default TakeAssessment