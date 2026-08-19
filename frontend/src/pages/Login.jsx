import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      alert('Please enter email and password.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(
        'http://https://quizchain-backend-y6nz.onrender.com/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.detail || 'Login failed'
        )
      }

      // Save logged-in user
      localStorage.setItem(
  'quizchain_user',
  JSON.stringify(data.user)
)

localStorage.setItem(
  'quizchain_token',
  data.token
)

window.location.href = '/'
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-page">

      <main className="create-container">

        <div className="create-intro">
          <span className="section-tag">
            QUIZCHAIN
          </span>

          <h1>Welcome back.</h1>

          <p>
            Sign in to continue to your account.
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="assessment-form"
        >
          <section className="form-card">

            <div className="form-card-heading">
              <div className="form-number">
                01
              </div>

              <div>
                <h2>Login</h2>

                <p>
                  Enter your account credentials.
                </p>
              </div>
            </div>

            <div className="form-grid">

              <div className="form-group full">
                <label>Email Address</label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group full">
                <label>Password</label>

                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

            </div>

            <div className="form-actions">

              <button
               type="submit"
               className="primary-btn"
              >
               Sign In
               <span>→</span>
              </button>

            </div>

          </section>
        </form>

      </main>
    </div>
  )
}

export default Login