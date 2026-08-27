import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/api'
import './AuthPages.css'

const passwordRequirements = [
  { label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { label: 'One lowercase letter', test: (value) => /[a-z]/.test(value) },
  { label: 'One number', test: (value) => /\d/.test(value) },
  { label: 'One special character', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordValidation = passwordRequirements.map((requirement) => ({
    ...requirement,
    valid: requirement.test(formData.password),
  }))

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
    setSuccess('')

    const invalidPasswordRequirements = passwordRequirements
      .filter(({ test }) => !test(formData.password))
      .map(({ label }) => label)

    if (invalidPasswordRequirements.length > 0) {
      setError(`Password requirements not met: ${invalidPasswordRequirements.join(', ')}.`)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const nameParts = formData.name.trim().split(/\s+/)

    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || firstName

    setLoading(true)

    try {
      await authApi.register({
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      setSuccess('Account created successfully. Redirecting to login...')

      setTimeout(() => {
        navigate('/login')
      }, 1000)
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>Create your account</h2>
        <p>Get started with TaskFlow today.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email address</label>
          <input
            id="register-email"
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
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
            minLength={8}
            required
          />
          <ul style={{ margin: '8px 0 0', paddingLeft: '18px', color: '#374151', fontSize: '12px' }}>
            {passwordValidation.map(({ label, valid }) => (
              <li key={label} style={{ color: valid ? '#15803d' : '#4b5563' }}>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">
            Confirm password
          </label>
          <input
            id="register-confirm-password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength={8}
            required
          />
        </div>

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

        {success && (
          <p
            role="status"
            style={{
              color: '#16a34a',
              margin: '0 0 12px',
              fontSize: '14px',
            }}
          >
            {success}
          </p>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  )
}

export default Register
