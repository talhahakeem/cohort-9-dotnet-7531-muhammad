import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminUserApi } from '../api/api'
import './AdminUserDetails.css'

function AdminUserDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(location.state?.user || null)
  const [loading, setLoading] = useState(!location.state?.user)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      const userId = location.state?.user?.id
      if (!userId) {
        setLoading(false)
        setError('No user selected.')
        return
      }

      try {
        setLoading(true)
        setError('')
        const response = await adminUserApi.getById(userId)
        setUser(response)
      } catch (err) {
        setError(err.message || 'Unable to load this user.')
      } finally {
        setLoading(false)
      }
    }

    if (!location.state?.user) {
      fetchUser()
    }
  }, [location.state])

  if (loading) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-card">
          <h1>Loading User...</h1>
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-card">
          <h1>User Not Found</h1>
          <p>{error || 'The selected user could not be found.'}</p>
          <button type="button" onClick={() => navigate('/admin/users')}>
            Back to Users
          </button>
        </div>
      </div>
    )
  }

  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown User'

  return (
    <div className="admin-user-details-page">
      <div className="admin-user-details-card">
        <div className="admin-user-details-header">
          <div>
            <h1>User Details</h1>
            <p>View complete information about this user.</p>
          </div>

          <button
            type="button"
            className="admin-user-details-back-button"
            onClick={() => navigate('/admin/users')}
          >
            ← Back to Users
          </button>
        </div>

        <div className="admin-user-profile">
          <div className="admin-user-details-avatar">{fullName.charAt(0).toUpperCase()}</div>

          <div>
            <h2>{fullName}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="admin-user-details-grid">
          <div className="admin-user-detail-item">
            <span>Full Name</span>
            <strong>{fullName}</strong>
          </div>

          <div className="admin-user-detail-item">
            <span>Email Address</span>
            <strong>{user.email}</strong>
          </div>

          <div className="admin-user-detail-item">
            <span>Role</span>
            <strong>{user.role}</strong>
          </div>

          <div className="admin-user-detail-item">
            <span>Status</span>
            <strong>{user.status}</strong>
          </div>

          <div className="admin-user-detail-item">
            <span>Total Tasks</span>
            <strong>{user.taskCount ?? 0}</strong>
          </div>

          <div className="admin-user-detail-item">
            <span>User ID</span>
            <strong>#{user.id}</strong>
          </div>
        </div>

        <div className="admin-user-details-actions">
          <button
            type="button"
            className="admin-user-details-edit-button"
            onClick={() => navigate('/admin/users/edit', { state: { user } })}
          >
            Edit User
          </button>

          <button
            type="button"
            className="admin-user-details-cancel-button"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminUserDetails
