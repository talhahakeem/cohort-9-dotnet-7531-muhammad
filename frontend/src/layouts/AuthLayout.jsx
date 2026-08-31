import { Outlet } from 'react-router-dom'
import './AuthLayout.css'

function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <div className="brand-mark">✓</div>
        <h1>TaskFlow</h1>
        <p>Manage your work. Stay organized. Get things done.</p>
      </div>

      <div className="auth-content">
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
