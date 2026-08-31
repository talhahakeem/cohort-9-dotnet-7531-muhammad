import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminUserApi } from '../api/api'
import DeleteUserModal from '../components/dashboard/DeleteUserModal'
import './AdminUsers.css'

function AdminUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [userToDelete, setUserToDelete] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await adminUserApi.getAll()
        setUsers(Array.isArray(response) ? response : [])
      } catch (err) {
        setError(err.message || 'Unable to load users.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()
    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim().toLowerCase()
    const matchesSearch =
      fullName.includes(search) || (user.email || '').toLowerCase().includes(search)

    const matchesRole = roleFilter === 'All' || user.role === roleFilter
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleEditUser = (user) => {
    navigate('/admin/users/edit', { state: { user } })
  }

  const handleDeleteUser = (user) => {
    setUserToDelete(user)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await adminUserApi.delete(userToDelete.id)
      setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userToDelete.id))
      setUserToDelete(null)
    } catch (err) {
      setError(err.message || 'Unable to delete user.')
      setUserToDelete(null)
    }
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
          <option value="Admin">Admin</option>
          <option value="User">User</option>
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

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-users-summary">
        Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
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

          {loading ? (
            <div className="no-users">
              <h3>Loading users...</h3>
            </div>
          ) : filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'Unknown User'

              return (
                <div className="admin-users-row" key={user.id}>
                  <div className="user-name">
                    <div className="user-avatar">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                    <strong>{fullName}</strong>
                  </div>

                  <span>{user.email}</span>

                  <span
                    className={`role-badge ${user.role === 'Admin' ? 'role-admin' : 'role-user'}`}
                  >
                    {user.role}
                  </span>

                  <span
                    className={`status-badge ${user.status === 'Active' ? 'user-active' : 'user-inactive'}`}
                  >
                    {user.status}
                  </span>

                  <span>{user.taskCount ?? 0}</span>

                  <div className="user-actions">
                    <button
                      type="button"
                      onClick={() => navigate('/admin/users/details', { state: { user } })}
                    >
                      View
                    </button>

                    <button type="button" onClick={() => handleEditUser(user)}>
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
              )
            })
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
        userName={userToDelete ? `${userToDelete.firstName ?? ''} ${userToDelete.lastName ?? ''}`.trim() : ''}
        onCancel={cancelDeleteUser}
        onConfirm={confirmDeleteUser}
      />
    </div>
  )
}

export default AdminUsers
