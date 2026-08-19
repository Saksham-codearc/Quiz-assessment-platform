import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function CreateAssessment() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    subject: '',
    description: '',
    duration: 30,
    passingPercentage: 40,
    marksPerQuestion: 1,
    negativeMarking: 0.25,
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()

  const assessment = {
    ...form,
    id: Date.now(),
    createdAt: new Date().toISOString(),
    questions: [],
  }

  console.log('Assessment configuration:', assessment)

  try {
    const token = localStorage.getItem('quizchain_token')

    if (!token) {
      alert('Please login again.')
      navigate('/login')
      return
    }

    const response = await fetch(
      'http://https://quizchain-backend-y6nz.onrender.com/api/assessments',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: assessment.title,
          subject: assessment.subject,
          description: assessment.description,
          marksPerQuestion: Number(
            assessment.marksPerQuestion
          ),
          negativeMarking: Number(
            assessment.negativeMarking
          ),
          passingPercentage: Number(
            assessment.passingPercentage
          ),
          duration: Number(assessment.duration),
          questions: [],
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.detail || 'Failed to create assessment'
      )
    }

    console.log(
      'Assessment saved to backend:',
      data
    )

    localStorage.setItem(
      'quizchain_assessment',
      JSON.stringify({
        ...assessment,
        backendId: data.assessment_id,
      })
    )

    navigate('/questions', {
      state: {
        assessment: {
          ...assessment,
          backendId: data.assessment_id,
        },
      },
    })
  } catch (error) {
    console.error(
      'Error creating assessment:',
      error
    )

    alert(
      error.message ||
        'Failed to create assessment'
    )
  }
}

  return (
    <div className="create-page">
      {/* Header */}
      <header className="create-header">
        <button
          className="back-button"
          onClick={() => navigate('/')}
        >
          ← Back to QuizChain
        </button>

        <div className="create-brand">
          <div className="brand-logo">Q</div>
          <span>QuizChain</span>
        </div>

        <div className="draft-status">
          <span></span>
          Draft
        </div>
      </header>

      {/* Main */}
      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">CREATE ASSESSMENT</span>

          <h1>Build your assessment.</h1>

          <p>
            Configure the basic rules of your assessment before adding
            questions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="assessment-form">
          {/* Basic information */}
          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">01</div>

              <div>
                <h2>Basic Information</h2>
                <p>Tell candidates what this assessment is about.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Assessment Title</label>

                <input
                  type="text"
                  name="title"
                  placeholder="e.g. Data Structures & Algorithms"
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Subject</label>

                <input
                  type="text"
                  name="subject"
                  placeholder="e.g. Computer Science"
                  value={form.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Assessment Type</label>

                <select defaultValue="mcq">
                  <option value="mcq">Multiple Choice Questions</option>
                  <option value="mixed">Mixed Questions</option>
                  <option value="practice">Practice Test</option>
                </select>
              </div>

              <div className="form-group full">
                <label>Description</label>

                <textarea
                  name="description"
                  rows="4"
                  placeholder="Briefly describe this assessment..."
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Scoring */}
          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">02</div>

              <div>
                <h2>Scoring Rules</h2>
                <p>Configure how candidates will be evaluated.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Marks per Question</label>

                <input
                  type="number"
                  name="marksPerQuestion"
                  min="0.5"
                  step="0.5"
                  value={form.marksPerQuestion}
                  onChange={handleChange}
                />

                <small>
                  Marks awarded for a correct answer.
                </small>
              </div>

              <div className="form-group">
                <label>Negative Marking</label>

                <select
                  name="negativeMarking"
                  value={form.negativeMarking}
                  onChange={handleChange}
                >
                  <option value="0">No negative marking</option>
                  <option value="0.25">−0.25 for incorrect</option>
                  <option value="0.5">−0.50 for incorrect</option>
                  <option value="1">−1.00 for incorrect</option>
                </select>

                <small>
                  Marks deducted for an incorrect answer.
                </small>
              </div>

              <div className="form-group">
                <label>Passing Percentage</label>

                <div className="input-with-symbol">
                  <input
                    type="number"
                    name="passingPercentage"
                    min="0"
                    max="100"
                    value={form.passingPercentage}
                    onChange={handleChange}
                  />
                  <span>%</span>
                </div>

                <small>
                  Minimum percentage required to pass.
                </small>
              </div>

              <div className="form-group">
                <label>Duration</label>

                <div className="input-with-symbol">
                  <input
                    type="number"
                    name="duration"
                    min="1"
                    value={form.duration}
                    onChange={handleChange}
                  />
                  <span>min</span>
                </div>

                <small>
                  Time allowed to complete the assessment.
                </small>
              </div>
            </div>

            {/* Scoring preview */}
            <div className="scoring-preview">
              <div>
                <span className="preview-label">SCORING PREVIEW</span>

                <h3>
                  +{form.marksPerQuestion || 1} correct
                  <span> • </span>
                  −{form.negativeMarking || 0} incorrect
                </h3>
              </div>

              <div className="preview-rule">
                Pass at {form.passingPercentage || 40}%
              </div>
            </div>
          </section>

          {/* Question settings */}
          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">03</div>

              <div>
                <h2>Question Settings</h2>
                <p>These settings will control the question builder.</p>
              </div>
            </div>

            <div className="question-setting">
              <div>
                <strong>Question order</strong>
                <p>
                  Randomize the order of questions for each attempt.
                </p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="question-setting">
              <div>
                <strong>Shuffle options</strong>
                <p>
                  Randomize answer options to reduce predictable patterns.
                </p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>

            <div className="question-setting">
              <div>
                <strong>Allow unanswered questions</strong>
                <p>
                  Candidates can move forward without selecting an answer.
                </p>
              </div>

              <label className="switch">
                <input type="checkbox" defaultChecked />
                <span></span>
              </label>
            </div>
          </section>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/')}
            >
              Cancel
            </button>

            <button type="submit" className="primary-btn">
              Save & Add Questions
              <span>→</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default CreateAssessment