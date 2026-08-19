import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const savedUser = localStorage.getItem(
    'quizchain_user'
  )

  if (!savedUser) {
    return <Navigate to="/login" replace />
  }

  const user = JSON.parse(savedUser)

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute