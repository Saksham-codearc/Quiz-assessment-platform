import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function CandidateDetails() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!name.trim()) {
      alert('Please enter your name.')
      return
    }

    if (!email.trim()) {
      alert('Please enter your email.')
      return
    }

    const candidate = {
      name: name.trim(),
      email: email.trim(),
    }

    // Keep candidate information available during the quiz
    sessionStorage.setItem(
      'quizchain_candidate',
      JSON.stringify(candidate)
    )

    navigate(`/assessment/${id}/start`)
  }

  return (
    <div className="create-page">
      <header className="create-header">
        <button
          className="back-button"
          onClick={() => navigate(`/assessment/${id}`)}
        >
          ← Back to Assessment
        </button>
      </header>

      <main className="create-container">

        <div className="create-intro">
          <span className="section-tag">
            CANDIDATE DETAILS
          </span>

          <h1>Before you begin.</h1>

          <p>
            Enter your details before starting the assessment.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="assessment-form"
        >
          <section className="form-card">

            <div className="form-card-heading">
              <div className="form-number">01</div>

              <div>
                <h2>Your Information</h2>

                <p>
                  This information will be attached to your
                  assessment attempt.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group full">
                <label>Full Name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group full">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

            </div>

          </section>

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate(`/assessment/${id}`)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Continue to Assessment
              <span>→</span>
            </button>

          </div>
        </form>

      </main>
    </div>
  )
}

export default CandidateDetails