function Topbar() {
  return (
    <header className="topbar">
      <div>
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your tasks.</p>
      </div>

      <div className="topbar-actions">
        <button className="notification-btn" type="button">
          🔔
        </button>

        <div className="profile">
          <div className="avatar">T</div>
          <div>
            <strong>Talha</strong>
            <span>Regular User</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar