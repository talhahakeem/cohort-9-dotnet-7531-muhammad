import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/api'
import { getCurrentUserRole, setAuthSession } from '../utils/auth'
import './AuthPages.css'

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')
    setLoading(true)

    try {
      const response = await authApi.login(formData)

      if (!response?.token) {
        throw new Error('Login succeeded but no authentication token was returned.')
      }

      setAuthSession({
        token: response.token,
        expiration: response.expiration,
      })

      const userRole = getCurrentUserRole()
      navigate(userRole === 'Admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Welcome back</h2>
        <p>Sign in to continue to your workspace.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            value={formData.email}
            onChange={handleChange}
            required
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
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              required
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

        {error && (
          <p
            role="alert"
            style={{
              color: '#dc2626',
              margin: '0 0 12px',
              fontSize: '14px',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Create an account</Link>
      </p>
    </div>
  )
}

export default Login
