import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/dashboard/StatCard'
import { dashboardApi, taskApi } from '../api/api'

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalTasks: 0,
    pendingTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        const [dashboardStats, taskList] = await Promise.all([
          dashboardApi.getStats(),
          taskApi.getAll(),
        ])

        const totalTasks =
          (dashboardStats?.pendingTasks || 0) +
          (dashboardStats?.inProgressTasks || 0) +
          (dashboardStats?.completedTasks || 0)

        setStats({
          totalTasks,
          pendingTasks: dashboardStats?.pendingTasks || 0,
          inProgressTasks: dashboardStats?.inProgressTasks || 0,
          completedTasks: dashboardStats?.completedTasks || 0,
        })

        setRecentTasks((taskList || []).slice(0, 3))
      } catch (err) {
        setError(err.message || 'Unable to load dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  return (
    <div className="dashboard-page">
      <div className="page-heading">
        <div>
          <h2>Overview</h2>
          <p>Track your tasks and stay organized.</p>
        </div>

        <button className="primary-btn" type="button" onClick={() => navigate('/tasks/create')}>
          + Create Task
        </button>
      </div>

      {error ? (
        <div className="empty-state">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <StatCard
              title="Total Tasks"
              value={loading ? '...' : stats.totalTasks}
              description="All assigned tasks"
            />

            <StatCard
              title="Completed"
              value={loading ? '...' : stats.completedTasks}
              description="Tasks completed"
            />

            <StatCard
              title="In Progress"
              value={loading ? '...' : stats.inProgressTasks}
              description="Currently working"
            />

            <StatCard
              title="Pending"
              value={loading ? '...' : stats.pendingTasks}
              description="Waiting to start"
            />
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <div>
                <h3>Recent Tasks</h3>
                <p>Your latest assigned tasks</p>
              </div>
              <button
                type="button"
                className="view-all-button"
                onClick={() => navigate('/tasks')}
              >
                View all
              </button>
            </div>

            {recentTasks.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3>No recent tasks</h3>
                <p>Your latest tasks will appear here.</p>
              </div>
            ) : (
              <div className="tasks-list">
                {recentTasks.map((task) => (
                  <div className="task-card" key={task.id}>
                    <div className="task-card-main">
                      <div className="task-title-row">
                        <h3>{task.title}</h3>
                        <span className={`priority-badge priority-${task.priority?.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p>{task.description || 'No description provided.'}</p>
                      <div className="task-meta">
                        <span>{task.category}</span>
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="task-card-side">
                      <span className={`status-badge status-${normalizeStatus(task.status).toLowerCase().replace(' ', '-')}`}>
                        {normalizeStatus(task.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard