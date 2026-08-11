import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './AdminEditUser.css'

function AdminEditUser() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState(() => {
    try {
      const storedUser = localStorage.getItem('adminEditingUser')

      if (storedUser) {
        return JSON.parse(storedUser)
      }
    } catch {
      // Fall back to default user below.
    }

    return {
      id: 1,
      name: 'Talha',
      email: 'talha@example.com',
      role: 'Regular User',
      status: 'Active',
      tasks: 8,
    }
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const storedUsers = localStorage.getItem('adminUsers')

    let users = []

    try {
      users = storedUsers ? JSON.parse(storedUsers) : []
    } catch {
      users = []
    }

    const updatedUsers = users.map((user) =>
      user.id === formData.id
        ? {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            status: formData.status,
          }
        : user
    )

    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))
    localStorage.removeItem('adminEditingUser')

    navigate('/admin/users')
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

        <form onSubmit={handleSubmit} className="admin-edit-user-form">
          <div className="admin-edit-user-field">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
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
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Regular User">Regular User</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <div className="admin-edit-user-field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
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

            <button
              type="submit"
              className="admin-edit-user-save-button"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEditUser
