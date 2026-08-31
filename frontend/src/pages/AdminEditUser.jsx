import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { adminUserApi } from '../api/api'
import './AdminEditUser.css'

function AdminEditUser() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialUser = location.state?.user || null

  const [formData, setFormData] = useState({
    id: initialUser?.id || '',
    firstName: initialUser?.firstName || '',
    lastName: initialUser?.lastName || '',
    email: initialUser?.email || '',
    role: initialUser?.role || 'User',
  })
  const [loading, setLoading] = useState(!initialUser)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadUser = async () => {
      if (initialUser) {
        return
      }

      try {
        setLoading(true)
        const userId = location.state?.user?.id
        if (!userId) {
          navigate('/admin/users')
          return
        }
        const user = await adminUserApi.getById(userId)
        setFormData({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        })
      } catch (err) {
        setError(err.message || 'Unable to load user.')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [initialUser, location.state, navigate])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setSubmitting(true)
      setError('')

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
      }

      await adminUserApi.update(formData.id, payload)
      navigate('/admin/users')
    } catch (err) {
      setError(err.message || 'Unable to update user.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-edit-user-page">
        <div className="admin-edit-user-card">
          <h1>Loading User...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-edit-user-page">
      <div className="admin-edit-user-card">
        <div className="admin-edit-user-header">
          <div>
            <h1>Edit User</h1>
            <p>Update user account information and permissions.</p>
          </div>

          <button
            type="button"
            className="admin-edit-user-back-button"
            onClick={() => navigate('/admin/users')}
          >
            ← Back to Users
          </button>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit} className="admin-edit-user-form">
          <div className="admin-edit-user-field">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-edit-user-field">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-edit-user-field">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-edit-user-field">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          <div className="admin-edit-user-actions">
            <button
              type="button"
              className="admin-edit-user-cancel-button"
              onClick={() => navigate('/admin/users')}
            >
              Cancel
            </button>

            <button type="submit" className="admin-edit-user-save-button" disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEditUser
