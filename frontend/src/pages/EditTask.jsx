import { useNavigate } from 'react-router-dom'
import './EditTask.css'

function EditTask() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()

    // Backend integration baad mein add karenge.
    navigate('/tasks/details')
  }

  return (
    <div className="edit-task-page">
      <div className="edit-task-header">
        <div>
          <p className="page-label">Task Management</p>
          <h1>Edit Task</h1>
          <p>Update the details of your task.</p>
        </div>

        <button
          type="button"
          className="back-button"
          onClick={() => navigate('/tasks/details')}
        >
          Back to Task
        </button>
      </div>

      <form className="edit-task-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            defaultValue="Implement authentication"
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            rows="5"
            defaultValue="Implement user authentication and authorization for the Task Management System."
            placeholder="Enter task description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" defaultValue="Development">
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" defaultValue="High">
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" defaultValue="In Progress">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              type="date"
              defaultValue="2026-08-15"
              required
            />
          </div>
        </div>

        <div className="edit-task-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/tasks/details')}
          >
            Cancel
          </button>

          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditTask