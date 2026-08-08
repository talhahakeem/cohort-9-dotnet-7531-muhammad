import { NavLink } from 'react-router-dom'

function Sidebar() {
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
          <div className="avatar">T</div>
          <div>
            <strong>Talha</strong>
            <small>Regular User</small>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar