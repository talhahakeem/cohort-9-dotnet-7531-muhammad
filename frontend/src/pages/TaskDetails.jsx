import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './TaskDetails.css'
import { taskApi } from '../api/api'

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function TaskDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const taskId = location.state?.taskId

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task selected.')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        const data = await taskApi.getById(taskId)
        setTask(data)
      } catch (err) {
        setError(err.message || 'Unable to load task details.')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  if (loading) {
    return <div className="task-details-page"><div className="task-details-card"><h2>Loading task...</h2></div></div>
  }

  if (error || !task) {
    return (
      <div className="task-details-page">
        <div className="task-details-card">
          <h2>Task not found</h2>
          <p>{error || 'The selected task could not be loaded.'}</p>
          <button type="button" className="primary-button" onClick={() => navigate('/tasks')}>Back to My Tasks</button>
        </div>
      </div>
    )
  }

  const statusLabel = normalizeStatus(task.status)
  const priorityLabel = task.priority || 'Medium'

  return (
    <div className="task-details-page">
      <div className="task-details-header">
        <div>
          <p className="page-label">Task Details</p>
          <h1>{task.title}</h1>
          <p className="task-subtitle">
            View complete information about this task.
          </p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/tasks')}
        >
          Back to My Tasks
        </button>
      </div>

      <div className="task-details-card">
        <div className="task-details-top">
          <div>
            <span className={`status-badge ${statusLabel.toLowerCase().replace(' ', '-')}`}>
              {statusLabel}
            </span>
            <span className={`priority-badge ${priorityLabel.toLowerCase()}`}>
              {priorityLabel} Priority
            </span>
          </div>
        </div>

        <div className="task-section">
          <h2>Description</h2>
          <p>{task.description || 'No description provided.'}</p>
        </div>

        <div className="task-info-grid">
          <div className="info-item">
            <span>Category</span>
            <strong>{task.category}</strong>
          </div>

          <div className="info-item">
            <span>Priority</span>
            <strong>{priorityLabel}</strong>
          </div>

          <div className="info-item">
            <span>Status</span>
            <strong>{statusLabel}</strong>
          </div>

          <div className="info-item">
            <span>Due Date</span>
            <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
          </div>

          <div className="info-item">
            <span>Task ID</span>
            <strong>{task.id}</strong>
          </div>
        </div>

        <div className="task-details-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate('/tasks')}
          >
            Back
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={() => navigate('/tasks/edit', { state: { taskId: task.id } })}
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails