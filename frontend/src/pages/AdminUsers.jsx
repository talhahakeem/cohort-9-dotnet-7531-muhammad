import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DeleteUserModal from '../components/dashboard/DeleteUserModal'
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

  const [users, setUsers] = useState(() => {
    try {
      const storedUsers = localStorage.getItem('adminUsers')

      if (!storedUsers) {
        localStorage.setItem('adminUsers', JSON.stringify(initialUsers))
        return initialUsers
      }

      const parsedUsers = JSON.parse(storedUsers)

      if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) {
        localStorage.setItem('adminUsers', JSON.stringify(initialUsers))
        return initialUsers
      }

      return parsedUsers
    } catch {
      localStorage.setItem('adminUsers', JSON.stringify(initialUsers))
      return initialUsers
    }
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [userToDelete, setUserToDelete] = useState(null)

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

  const handleEditUser = (user) => {
    localStorage.setItem('adminEditingUser', JSON.stringify(user))
    navigate('/admin/users/edit')
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
  }

  const confirmDeleteUser = () => {
    if (!userToDelete) return

    setUsers((currentUsers) => {
      const updatedUsers = currentUsers.filter(
        (user) => user.id !== userToDelete.id
      )

      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers))

      return updatedUsers
    })

    setUserToDelete(null)
  }

  const cancelDeleteUser = () => {
    setUserToDelete(null)
  }

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
                    onClick={() => { localStorage.setItem('adminViewingUser', JSON.stringify(user)); navigate('/admin/users/details') }}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-user-button"
                    onClick={() => handleDeleteUser(user)}
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

      <DeleteUserModal
        isOpen={Boolean(userToDelete)}
        userName={userToDelete?.name || ''}
        onCancel={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
      />
    </div>
  )
}

export default AdminUsers
