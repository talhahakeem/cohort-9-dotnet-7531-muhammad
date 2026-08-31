import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuthSession } from '../../utils/auth'
import './AdminSidebar.css'

function AdminSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <h2>Task Management</h2>
        <span>Admin Panel</span>
      </div>

      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>▣</span>
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>♙</span>
          Users
        </NavLink>

        <NavLink
          to="/admin/tasks"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>☷</span>
          All Tasks
        </NavLink>

        <NavLink
          to="/admin/tasks/create"
          className={({ isActive }) =>
            `admin-nav-item ${isActive ? 'active' : ''}`
          }
        >
          <span>＋</span>
          Create Task
        </NavLink>
      </nav>

      <div className="admin-sidebar-bottom">
        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate('/dashboard')}
        >
          ← User Dashboard
        </button>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default AdminSidebar
