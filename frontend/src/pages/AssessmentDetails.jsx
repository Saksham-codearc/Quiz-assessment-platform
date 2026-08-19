import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function AssessmentDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(
          `http://https://quizchain-backend-y6nz.onrender.com/api/assessments/${id}`
        )

        if (!response.ok) {
          throw new Error('Assessment not found')
        }

        const data = await response.json()
        setAssessment(data)
      } catch (error) {
        console.error(error)
        setError('Could not load assessment.')
      } finally {
        setLoading(false)
      }
    }

    fetchAssessment()
  }, [id])

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

  if (error) {
    return (
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">ERROR</span>
          <h1>{error}</h1>

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
            ASSESSMENT DETAILS
          </span>

          <h1>{assessment.title}</h1>

          <p>
            {assessment.description ||
              'Test your knowledge with this assessment.'}
          </p>
        </div>

        <section className="form-card">
          <div className="form-card-heading">
            <div className="form-number">01</div>

            <div>
              <h2>Assessment Information</h2>
              <p>Review the assessment before starting.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Subject</label>
              <input
                value={assessment.subject}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                value={`${assessment.duration} minutes`}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Marks per Question</label>
              <input
                value={assessment.marksPerQuestion}
                readOnly
              />
            </div>

            <div className="form-group">
              <label>Negative Marking</label>
              <input
                value={assessment.negativeMarking}
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

            <div className="form-group">
              <label>Total Questions</label>
              <input
                value={assessment.questions?.length || 0}
                readOnly
              />
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/')}
          >
            Cancel
          </button>

          <button
            type="button"
            className="primary-btn"
            onClick={() =>
             navigate(`/assessment/${assessment._id}/candidate`)
             }
          >
            Start Assessment
            <span>→</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default AssessmentDetails