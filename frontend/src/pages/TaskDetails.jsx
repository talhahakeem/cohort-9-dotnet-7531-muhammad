import { useNavigate } from 'react-router-dom'
import './TaskDetails.css'

function TaskDetails() {
  const navigate = useNavigate()

  const task = {
    title: 'Implement authentication',
    description:
      'Implement user authentication and authorization for the Task Management System using ASP.NET Core Identity and JWT authentication.',
    category: 'Development',
    priority: 'High',
    status: 'In Progress',
    dueDate: 'Aug 15, 2026',
    assignedTo: 'Talha',
    createdDate: 'Aug 08, 2026',
  }

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
            <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
              {task.status}
            </span>
            <span className={`priority-badge ${task.priority.toLowerCase()}`}>
              {task.priority} Priority
            </span>
          </div>
        </div>

        <div className="task-section">
          <h2>Description</h2>
          <p>{task.description}</p>
        </div>

        <div className="task-info-grid">
          <div className="info-item">
            <span>Category</span>
            <strong>{task.category}</strong>
          </div>

          <div className="info-item">
            <span>Priority</span>
            <strong>{task.priority}</strong>
          </div>

          <div className="info-item">
            <span>Status</span>
            <strong>{task.status}</strong>
          </div>

          <div className="info-item">
            <span>Due Date</span>
            <strong>{task.dueDate}</strong>
          </div>

          <div className="info-item">
            <span>Assigned To</span>
            <strong>{task.assignedTo}</strong>
          </div>

          <div className="info-item">
            <span>Created Date</span>
            <strong>{task.createdDate}</strong>
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
            onClick={() => navigate('/tasks/create')}
          >
            Edit Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetails