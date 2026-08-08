import { Link } from 'react-router-dom'
import './AuthPages.css'

function Register() {
  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Create your account</h2>
        <p>Get started with TaskFlow today.</p>
      </div>

      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="primary-button">
          Create account
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}

export default Register
