import { NavLink, useNavigate } from 'react-router-dom'
import { clearAuthSession, getCurrentUser } from '../../utils/auth'

function Sidebar() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()
  const displayName =
    currentUser?.name ||
    currentUser?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
    'User'
  const role =
    currentUser?.role ||
    currentUser?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    'User'

  const logout = () => {
    clearAuthSession()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">✓</div>
        <span>TaskFlow</span>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className="sidebar-link">
          <span>▦</span>
          Dashboard
        </NavLink>

        <NavLink to="/tasks" className="sidebar-link">
          <span>✓</span>
          My Tasks
        </NavLink>

        <NavLink to="/tasks/create" className="sidebar-link">
          <span>＋</span>
          Create Task
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="user-mini">
          <div className="avatar">{displayName.charAt(0).toUpperCase()}</div>
          <div>
            <strong>{displayName}</strong>
            <small>{role}</small>
          </div>
        </div>

        <button type="button" className="logout-button" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar