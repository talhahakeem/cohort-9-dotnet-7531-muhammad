import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import { taskApi } from '../api/api'

function AdminDashboard() {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await taskApi.getAll()
        setTasks(data || [])
      } catch (err) {
        setError(err.message || 'Unable to load admin dashboard data.')
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((task) => task.status === 'Completed').length
  const inProgressTasks = tasks.filter((task) => task.status === 'InProgress').length
  const pendingTasks = tasks.filter((task) => task.status === 'Pending').length
  const highPriorityTasks = tasks.filter((task) => task.priority === 'High').length

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Monitor system tasks and operational status.</p>
        </div>

        <button
          type="button"
          className="admin-create-task-button"
          onClick={() => navigate('/admin/tasks/create')}
        >
          + Create Task
        </button>
      </div>

      {error ? (
        <div className="admin-empty-state">
          <h3>Unable to load dashboard</h3>
          <p>{error}</p>
        </div>
      ) : (
        <>
          <section className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Total Tasks</span>
              <strong>{loading ? '...' : totalTasks}</strong>
              <small>All assigned tasks</small>
            </div>

            <div className="admin-stat-card">
              <span>Completed</span>
              <strong>{loading ? '...' : completedTasks}</strong>
              <small>Completed tasks</small>
            </div>

            <div className="admin-stat-card">
              <span>In Progress</span>
              <strong>{loading ? '...' : inProgressTasks}</strong>
              <small>Currently active</small>
            </div>

            <div className="admin-stat-card">
              <span>Pending</span>
              <strong>{loading ? '...' : pendingTasks}</strong>
              <small>Waiting to start</small>
            </div>
          </section>

          <section className="admin-overview-card">
            <div className="admin-section-header">
              <div>
                <h2>System Overview</h2>
                <p>Monitor tasks across the system.</p>
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
                <span>High Priority</span>
                <strong>{highPriorityTasks}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{pendingTasks}</strong>
              </div>

              <div>
                <span>Completed</span>
                <strong>{completedTasks}</strong>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default AdminDashboard