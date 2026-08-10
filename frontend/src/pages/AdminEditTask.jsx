import { useNavigate } from 'react-router-dom'
import './AdminEditTask.css'

function AdminEditTask() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/admin/tasks')
  }

  return (
    <div className="admin-edit-task-page">
      <div className="admin-edit-task-header">
        <div>
          <h1>Edit Task</h1>
          <p>Update task details and assignment.</p>
        </div>

        <button
          type="button"
          className="admin-edit-back-button"
          onClick={() => navigate('/admin/tasks')}
        >
          Back to All Tasks
        </button>
      </div>

      <form className="admin-edit-task-card" onSubmit={handleSubmit}>
        <div className="admin-edit-form-group">
          <label htmlFor="admin-task-title">Task Title</label>
          <input
            id="admin-task-title"
            type="text"
            defaultValue="Complete project documentation"
            required
          />
        </div>

        <div className="admin-edit-form-group">
          <label htmlFor="admin-task-description">Description</label>
          <textarea
            id="admin-task-description"
            rows="5"
            defaultValue="Prepare the technical documentation for the system."
            required
          />
        </div>

        <div className="admin-edit-form-row">
          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-assignee">Assigned To</label>
            <select id="admin-task-assignee" defaultValue="Talha">
              <option value="Talha">Talha</option>
              <option value="Ali Khan">Ali Khan</option>
              <option value="Ahmed">Ahmed</option>
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-category">Category</label>
            <select id="admin-task-category" defaultValue="Documentation">
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>
        </div>

        <div className="admin-edit-form-row">
          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-priority">Priority</label>
            <select id="admin-task-priority" defaultValue="High">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-status">Status</label>
            <select id="admin-task-status" defaultValue="In Progress">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="admin-edit-form-group">
          <label htmlFor="admin-task-due-date">Due Date</label>
          <input
            id="admin-task-due-date"
            type="date"
            defaultValue="2026-08-12"
            required
          />
        </div>

        <div className="admin-edit-task-actions">
          <button
            type="button"
            className="admin-edit-cancel-button"
            onClick={() => navigate('/admin/tasks')}
          >
            Cancel
          </button>

          <button type="submit" className="admin-edit-save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditTask
