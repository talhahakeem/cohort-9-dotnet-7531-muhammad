import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './AdminCreateTask.css'

const users = [
  'Talha',
  'Ali Khan',
  'Ahmed',
  'Sara Ahmed',
]

function AdminCreateTask() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    category: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    alert(`Task "${formData.title}" created successfully.`)

    navigate('/admin/tasks')
  }

  return (
    <div className="admin-create-task-page">
      <div className="admin-create-task-header">
        <div>
          <h1>Create Task</h1>
          <p>Create and assign a new task to a user.</p>
        </div>

        <button
          type="button"
          className="admin-back-button"
          onClick={() => navigate('/admin/tasks')}
        >
          Back to All Tasks
        </button>
      </div>

      <form
        className="admin-create-task-card"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter task title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Describe the task..."
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="assignee">Assign To</label>
            <select
              id="assignee"
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              required
            >
              <option value="">Select user</option>

              {users.map((user) => (
                <option value={user} key={user}>
                  {user}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
            </select>
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="admin-form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-create-task-actions">
          <button
            type="button"
            className="admin-cancel-button"
            onClick={() => navigate('/admin/tasks')}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-submit-button"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminCreateTask
