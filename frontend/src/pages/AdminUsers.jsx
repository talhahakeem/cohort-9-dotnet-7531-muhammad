import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminUsers.css'

const initialUsers = [
  {
    id: 1,
    name: 'Talha',
    email: 'talha@example.com',
    role: 'Regular User',
    status: 'Active',
    tasks: 8,
  },
  {
    id: 2,
    name: 'Ali Khan',
    email: 'ali@example.com',
    role: 'Regular User',
    status: 'Active',
    tasks: 12,
  },
  {
    id: 3,
    name: 'Ahmed',
    email: 'ahmed@example.com',
    role: 'Regular User',
    status: 'Inactive',
    tasks: 5,
  },
  {
    id: 4,
    name: 'Admin',
    email: 'admin@example.com',
    role: 'Administrator',
    status: 'Active',
    tasks: 20,
  },
]

function AdminUsers() {
  const navigate = useNavigate()
  const [users] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search)

    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter

    const matchesStatus =
      statusFilter === 'All' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  return (
    <div className="admin-users-page">
      <div className="admin-users-header">
        <div>
          <h1>Users</h1>
          <p>Manage and monitor registered users.</p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={() => navigate('/admin/dashboard')}
        >
          ← Dashboard
        </button>
      </div>

      <div className="admin-users-toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value)}
        >
          <option value="All">All Roles</option>
          <option value="Administrator">Administrator</option>
          <option value="Regular User">Regular User</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="admin-users-summary">
        Showing <strong>{filteredUsers.length}</strong> of{' '}
        <strong>{users.length}</strong> users
      </div>

      <div className="admin-users-table-card">
        <div className="admin-users-table">
          <div className="admin-users-row admin-users-table-header">
            <span>User</span>
            <span>Email</span>
            <span>Role</span>
            <span>Status</span>
            <span>Tasks</span>
            <span>Actions</span>
          </div>

          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div className="admin-users-row" key={user.id}>
                <div className="user-name">
                  <div className="user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <strong>{user.name}</strong>
                </div>

                <span>{user.email}</span>

                <span
                  className={`role-badge ${
                    user.role === 'Administrator'
                      ? 'role-admin'
                      : 'role-user'
                  }`}
                >
                  {user.role}
                </span>

                <span
                  className={`status-badge ${
                    user.status === 'Active'
                      ? 'user-active'
                      : 'user-inactive'
                  }`}
                >
                  {user.status}
                </span>

                <span>{user.tasks}</span>

                <div className="user-actions">
                  <button
                    type="button"
                    onClick={() => alert(`View ${user.name}`)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Edit ${user.name}`)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-user-button"
                    onClick={() => alert(`Delete ${user.name}`)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-users">
              <h3>No users found</h3>
              <p>Try changing your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsers
