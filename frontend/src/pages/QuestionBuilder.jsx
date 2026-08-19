import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import '../App.css'

function QuestionBuilder() {
  const navigate = useNavigate()
  const location = useLocation()

  const assessment = location.state?.assessment || {}

  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
  })
  const [correctAnswer, setCorrectAnswer] = useState('A')
  const [questions, setQuestions] = useState([])

  useEffect(() => {
  const savedAssessment = JSON.parse(
    localStorage.getItem('quizchain_assessment')
  )

  if (savedAssessment?.questions) {
    setQuestions(savedAssessment.questions)
  }
}, [])

  const handleOptionChange = (option, value) => {
    setOptions((previous) => ({
      ...previous,
      [option]: value,
    }))
  }

  const addQuestion = (e) => {
  e.preventDefault()

  if (!question.trim()) {
    alert('Please enter a question.')
    return
  }

  if (
    !options.A.trim() ||
    !options.B.trim() ||
    !options.C.trim() ||
    !options.D.trim()
  ) {
    alert('Please fill all four options.')
    return
  }

  const newQuestion = {
    id: Date.now(),
    question: question.trim(),
    options: { ...options },
    correctAnswer,
  }

  // Add question to the current page
  setQuestions((previous) => [...previous, newQuestion])

  // Add question to the saved assessment
  const savedAssessment = JSON.parse(
    localStorage.getItem('quizchain_assessment')
  )

  if (savedAssessment) {
    const updatedAssessment = {
      ...savedAssessment,
      questions: [
        ...(savedAssessment.questions || []),
        newQuestion,
      ],
    }

    localStorage.setItem(
      'quizchain_assessment',
      JSON.stringify(updatedAssessment)
    )
  }

  // Clear the question form
  setQuestion('')

  setOptions({
    A: '',
    B: '',
    C: '',
    D: '',
  })

  setCorrectAnswer('A')
}

  const deleteQuestion = (id) => {
    setQuestions((previous) =>
      previous.filter((item) => item.id !== id)
    )
  }

  const finishAssessment = async () => {
  const savedAssessment = JSON.parse(
    localStorage.getItem('quizchain_assessment')
  )

  if (!savedAssessment) {
    alert('Assessment data not found.')
    return
  }

  if (!savedAssessment.questions?.length) {
    alert('Please add at least one question.')
    return
  }

  const finalAssessment = {
    title: savedAssessment.title,
    subject: savedAssessment.subject,
    description: savedAssessment.description || '',
    marksPerQuestion: Number(savedAssessment.marksPerQuestion) || 1,
    negativeMarking: Number(savedAssessment.negativeMarking) || 0,
    passingPercentage:
      Number(savedAssessment.passingPercentage) || 40,
    duration: Number(savedAssessment.duration) || 30,
    questions: savedAssessment.questions,
  }

  try {
    console.log('Saved assessment:', savedAssessment)
    console.log('Backend ID:', savedAssessment.backendId)
    const response = await fetch(
   `http://https://quizchain-backend-y6nz.onrender.com/api/assessments/${savedAssessment.backendId}`,
  {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('quizchain_token')}`,
    },
    body: JSON.stringify(finalAssessment),
  }
)

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.detail || 'Failed to save assessment'
      )
    }

    console.log('Assessment saved:', data)

    alert('Assessment saved successfully!')

    localStorage.removeItem('quizchain_assessment')

    navigate('/')
  } catch (error) {
    console.error('Error saving assessment:', error)

    alert(
      'Could not save assessment. Make sure the backend is running.'
    )
  }
}

  return (
    <div className="create-page">
      <header className="create-header">
        <button
          className="back-button"
          onClick={() => navigate('/create')}
        >
          ← Back to Assessment
        </button>

        <div className="create-brand">
          <div className="brand-logo">Q</div>
          <span>QuizChain</span>
        </div>

        <div className="draft-status">
          <span></span>
          Building Questions
        </div>
      </header>

      <main className="create-container">
        <div className="create-intro">
          <span className="section-tag">QUESTION BUILDER</span>

          <h1>Add your questions.</h1>

          <p>
            Build the questions candidates will answer in your assessment.
          </p>

          {assessment.title && (
            <p>
              <strong>Assessment:</strong> {assessment.title}
            </p>
          )}
        </div>

        <form onSubmit={addQuestion} className="assessment-form">
          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">01</div>

              <div>
                <h2>Question</h2>
                <p>Enter the question and its answer options.</p>
              </div>
            </div>

            <div className="form-grid">
              <div className="form-group full">
                <label>Question</label>

                <textarea
                  rows="4"
                  placeholder="e.g. Which data structure follows FIFO?"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  required
                />
              </div>

              {['A', 'B', 'C', 'D'].map((option) => (
                <div className="form-group" key={option}>
                  <label>Option {option}</label>

                  <input
                    type="text"
                    placeholder={`Enter option ${option}`}
                    value={options[option]}
                    onChange={(e) =>
                      handleOptionChange(option, e.target.value)
                    }
                    required
                  />
                </div>
              ))}
            </div>
          </section>

          <section className="form-card">
            <div className="form-card-heading">
              <div className="form-number">02</div>

              <div>
                <h2>Answer</h2>
                <p>Select the correct answer.</p>
              </div>
            </div>

            <div className="form-group">
              <label>Correct Answer</label>

              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
              >
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                Add Question
                <span>+</span>
              </button>
            </div>
          </section>
        </form>

        <section className="form-card">
          <div className="form-card-heading">
            <div className="form-number">03</div>

            <div>
              <h2>Questions</h2>
              <p>
                {questions.length} question
                {questions.length !== 1 ? 's' : ''} added
              </p>
            </div>
          </div>

          {questions.length === 0 ? (
            <p>No questions added yet.</p>
          ) : (
            <div>
              {questions.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    padding: '20px',
                    marginBottom: '15px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                  }}
                >
                  <h3>
                    {index + 1}. {item.question}
                  </h3>

                  <p>A. {item.options.A}</p>
                  <p>B. {item.options.B}</p>
                  <p>C. {item.options.C}</p>
                  <p>D. {item.options.D}</p>

                  <p>
                    <strong>Correct Answer: {item.correctAnswer}</strong>
                  </p>

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => deleteQuestion(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="form-actions">
        <button
         type="button"
         className="cancel-btn"
         onClick={() => navigate('/create')}
        >
        ← Back to Settings
       </button>

       <button
       type="button"
       className="primary-btn"
       onClick={finishAssessment}
       >
       Finish & Save Assessment
      <span>✓</span>
      </button>
      </div>

      </main>
    </div>
  )
}

export default QuestionBuilder