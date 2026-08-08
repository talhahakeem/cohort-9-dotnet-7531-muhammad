import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPages.css'

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome back</h2>
        <p>Sign in to continue to your workspace.</p>
      </div>

      <form className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="form-group">
          <div className="password-label">
            <label htmlFor="password">Password</label>
            <a href="#forgot-password">Forgot password?</a>
          </div>

          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>

        <label className="remember-me">
          <input type="checkbox" />
          <span>Remember me</span>
        </label>

        <button type="submit" className="primary-button">
          Sign in
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}

export default Login
