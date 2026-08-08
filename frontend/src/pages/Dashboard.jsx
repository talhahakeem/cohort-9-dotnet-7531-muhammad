import StatCard from '../components/dashboard/StatCard'

function Dashboard() {
  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h2>Overview</h2>
          <p>Track your tasks and stay organized.</p>
        </div>

        <button className="primary-btn" type="button">
          + Create Task
        </button>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tasks"
          value="24"
          description="All assigned tasks"
        />

        <StatCard
          title="Completed"
          value="12"
          description="Tasks completed"
        />

        <StatCard
          title="In Progress"
          value="8"
          description="Currently working"
        />

        <StatCard
          title="Pending"
          value="4"
          description="Waiting to start"
        />
      </div>

      <div className="dashboard-section">
        <div className="section-header">
          <div>
            <h3>Recent Tasks</h3>
            <p>Your latest assigned tasks</p>
          </div>

          <button type="button" className="text-btn">
            View all
          </button>
        </div>

        <div className="empty-state">
          <div className="empty-icon">✓</div>
          <h3>No recent tasks</h3>
          <p>Your latest tasks will appear here.</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard