import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'

function AdminDashboard() {
  const navigate = useNavigate()

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Manage users, tasks and system activity.</p>
        </div>

        <button
          type="button"
          className="admin-create-task-button"
          onClick={() => navigate('/admin/tasks/create')}
        >
          + Create Task
        </button>
      </div>

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Total Users</span>
          <strong>18</strong>
          <small>Registered users</small>
        </div>

        <div className="admin-stat-card">
          <span>Total Tasks</span>
          <strong>64</strong>
          <small>All assigned tasks</small>
        </div>

        <div className="admin-stat-card">
          <span>Completed</span>
          <strong>32</strong>
          <small>Completed tasks</small>
        </div>

        <div className="admin-stat-card">
          <span>Pending</span>
          <strong>14</strong>
          <small>Waiting to start</small>
        </div>
      </section>

      <section className="admin-overview-card">
        <div className="admin-section-header">
          <div>
            <h2>System Overview</h2>
            <p>Monitor tasks and users across the system.</p>
          </div>

          <button
            type="button"
            className="admin-view-button"
            onClick={() => navigate('/admin/tasks')}
          >
            View All Tasks
          </button>
        </div>

        <div className="admin-overview-grid">
          <div>
            <span>In Progress</span>
            <strong>18</strong>
          </div>

          <div>
            <span>High Priority</span>
            <strong>9</strong>
          </div>

          <div>
            <span>Active Users</span>
            <strong>15</strong>
          </div>
        </div>
      </section>

      <section className="admin-recent-card">
        <div className="admin-section-header">
          <div>
            <h2>Recent Activity</h2>
            <p>Latest activity across the system.</p>
          </div>

          <button
            type="button"
            className="admin-view-button"
            onClick={() => navigate('/admin/users')}
          >
            Manage Users
          </button>
        </div>

        <div className="admin-empty-state">
          <div className="admin-empty-icon">✓</div>
          <h3>No recent activity</h3>
          <p>Recent user and task activity will appear here.</p>
        </div>
      </section>
    </div>
  )
}

export default AdminDashboard