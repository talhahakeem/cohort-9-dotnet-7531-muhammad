import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './AdminTaskDetails.css'
import { taskApi } from '../api/api'

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function AdminTaskDetails() {
  const navigate = useNavigate()
  const location = useLocation()
  const taskId = location.state?.taskId

  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setLoading(false)
        setError('No task selected.')
        return
      }

      try {
        setLoading(true)
        setError('')
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
    return (
      <div className="admin-task-details-page">
        <div className="admin-task-details-card">
          <h2>Loading task...</h2>
        </div>
      </div>
    )
  }

  if (error || !task) {
    return (
      <div className="admin-task-details-page">
        <div className="admin-task-details-card">
          <h2>Task not found</h2>
          <p>{error || 'The selected task could not be loaded.'}</p>

          <button
            type="button"
            className="admin-details-back-button"
            onClick={() => navigate('/admin/tasks')}
          >
            Back to All Tasks
          </button>
        </div>
      </div>
    )
  }

  const statusClass = `status-${normalizeStatus(task.status).toLowerCase().replace(/\s+/g, '-')}`
  const priorityClass = `priority-${task.priority?.toLowerCase()}`

  const handleEdit = () => {
    navigate('/admin/tasks/edit', { state: { taskId: task.id } })
  }

  const handleBack = () => {
    navigate('/admin/tasks')
  }

  return (
    <div className="admin-task-details-page">
      <div className="admin-task-details-header">
        <div>
          <h1>Task Details</h1>
          <p>View complete information about this task.</p>
        </div>

        <button
          type="button"
          className="admin-details-back-button"
          onClick={handleBack}
        >
          Back to All Tasks
        </button>
      </div>

      <div className="admin-task-details-card">
        <div className="admin-task-details-title-row">
          <div>
            <h2>{task.title}</h2>

            <span className="admin-task-details-category">
              {task.category}
            </span>
          </div>

          <span className={`admin-details-status ${statusClass}`}>
            {normalizeStatus(task.status)}
          </span>
        </div>

        <div className="admin-task-details-description">
          <h3>Description</h3>
          <p>{task.description || 'No description provided.'}</p>
        </div>

        <div className="admin-task-details-grid">
          <div className="admin-detail-item">
            <span>Priority</span>
            <strong className={`admin-details-priority ${priorityClass}`}>
              {task.priority}
            </strong>
          </div>

          <div className="admin-detail-item">
            <span>Category</span>
            <strong>{task.category}</strong>
          </div>

          <div className="admin-detail-item">
            <span>Status</span>
            <strong>{normalizeStatus(task.status)}</strong>
          </div>

          <div className="admin-detail-item">
            <span>Due Date</span>
            <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
          </div>

          <div className="admin-detail-item">
            <span>Task ID</span>
            <strong>#{task.id}</strong>
          </div>
        </div>

        <div className="admin-task-details-actions">
          <button
            type="button"
            className="admin-details-edit-button"
            onClick={handleEdit}
          >
            Edit Task
          </button>

          <button
            type="button"
            className="admin-details-delete-button"
            onClick={handleBack}
          >
            Back to Tasks
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTaskDetails
