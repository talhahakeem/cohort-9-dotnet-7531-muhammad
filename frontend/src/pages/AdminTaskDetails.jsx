import { useNavigate } from 'react-router-dom'
import './AdminTaskDetails.css'

function AdminTaskDetails() {
  const navigate = useNavigate()

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
          onClick={() => navigate('/admin/tasks')}
        >
          Back to All Tasks
        </button>
      </div>

      <div className="admin-task-details-card">
        <div className="admin-task-details-title-row">
          <div>
            <h2>Complete project documentation</h2>
            <span className="admin-task-details-category">
              Documentation
            </span>
          </div>

          <span className="admin-details-status status-in-progress">
            In Progress
          </span>
        </div>

        <div className="admin-task-details-description">
          <h3>Description</h3>
          <p>
            Prepare the technical documentation for the system.
          </p>
        </div>

        <div className="admin-task-details-grid">
          <div className="admin-detail-item">
            <span>Assigned To</span>
            <strong>Talha</strong>
          </div>

          <div className="admin-detail-item">
            <span>Priority</span>
            <strong className="admin-details-priority priority-high">
              High
            </strong>
          </div>

          <div className="admin-detail-item">
            <span>Category</span>
            <strong>Documentation</strong>
          </div>

          <div className="admin-detail-item">
            <span>Status</span>
            <strong>In Progress</strong>
          </div>

          <div className="admin-detail-item">
            <span>Due Date</span>
            <strong>Aug 12, 2026</strong>
          </div>

          <div className="admin-detail-item">
            <span>Task ID</span>
            <strong>#1</strong>
          </div>
        </div>

        <div className="admin-task-details-actions">
          <button
            type="button"
            className="admin-details-edit-button"
            onClick={() => alert('Edit task')}
          >
            Edit Task
          </button>

          <button
            type="button"
            className="admin-details-delete-button"
            onClick={() => alert('Delete task')}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminTaskDetails
