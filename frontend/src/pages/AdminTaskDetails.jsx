import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './AdminTaskDetails.css'

function AdminTaskDetails() {
  const navigate = useNavigate()

  const [task, setTask] = useState(null)

  useEffect(() => {
    try {
      const storedTask = localStorage.getItem('adminViewingTask')

      if (storedTask) {
        setTask(JSON.parse(storedTask))
      }
    } catch {
      setTask(null)
    }
  }, [])

  if (!task) {
    return (
      <div className="admin-task-details-page">
        <div className="admin-task-details-card">
          <h2>Task not found</h2>
          <p>The selected task could not be loaded.</p>

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

  const statusClass = `status-${task.status
    .toLowerCase()
    .replace(/\s+/g, '-')}`

  const priorityClass = `priority-${task.priority.toLowerCase()}`

  const handleEdit = () => {
    localStorage.setItem('adminEditingTask', JSON.stringify(task))
    navigate('/admin/tasks/edit')
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
            {task.status}
          </span>
        </div>

        <div className="admin-task-details-description">
          <h3>Description</h3>
          <p>{task.description}</p>
        </div>

        <div className="admin-task-details-grid">
          <div className="admin-detail-item">
            <span>Assigned To</span>
            <strong>{task.assignee}</strong>
          </div>

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
            <strong>{task.status}</strong>
          </div>

          <div className="admin-detail-item">
            <span>Due Date</span>
            <strong>{task.dueDate}</strong>
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
