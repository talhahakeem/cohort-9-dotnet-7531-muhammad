import { useNavigate } from 'react-router-dom'
import './AdminUserDetails.css'

function AdminUserDetails() {
  const navigate = useNavigate()

  const storedUser = localStorage.getItem('adminViewingUser')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (!user) {
    return (
      <div className="admin-user-details-page">
        <div className="admin-user-details-card">
          <h1>User Not Found</h1>
          <p>The selected user could not be found.</p>
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
          >
            Back to Users
          </button>
        </div>
      </div>
    )
  }

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
          <div className="admin-user-details-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>

        <div className="admin-user-details-grid">
          <div className="admin-user-detail-item">
            <span>Full Name</span>
            <strong>{user.name}</strong>
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
            <strong>{user.tasks}</strong>
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
            onClick={() => navigate('/admin/users/edit')}
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
