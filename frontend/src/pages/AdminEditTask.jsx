import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './AdminEditTask.css'
import { taskApi } from '../api/api'

function AdminEditTask() {
  const navigate = useNavigate()
  const location = useLocation()
  const taskId = location.state?.taskId

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    status: 'InProgress',
    dueDate: '',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) {
        setError('No task selected.')
        setLoading(false)
        return
      }

      try {
        const task = await taskApi.getById(taskId)
        setFormData({
          title: task.title || '',
          description: task.description || '',
          category: task.category || '',
          priority: task.priority || 'Medium',
          status: task.status || 'InProgress',
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        })
      } catch (err) {
        setError(err.message || 'Unable to load task.')
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    try {
      setSubmitting(true)
      await taskApi.update(taskId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
      })
      navigate('/admin/tasks', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to update task.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="admin-edit-task-page">
        <div className="admin-edit-task-header">
          <h1>Loading task...</h1>
        </div>
      </div>
    )
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

      {error && <div className="error-banner">{error}</div>}

      <form className="admin-edit-task-card" onSubmit={handleSubmit}>
        <div className="admin-edit-form-group">
          <label htmlFor="admin-task-title">Task Title</label>
          <input
            id="admin-task-title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-edit-form-group">
          <label htmlFor="admin-task-description">Description</label>
          <textarea
            id="admin-task-description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-edit-form-row">
          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-category">Category</label>
            <select id="admin-task-category" name="category" value={formData.category} onChange={handleChange}>
              <option value="">Select category</option>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-priority">Priority</label>
            <select id="admin-task-priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="admin-edit-form-row">
          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-status">Status</label>
            <select id="admin-task-status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="admin-edit-form-group">
            <label htmlFor="admin-task-due-date">Due Date</label>
            <input
              id="admin-task-due-date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="admin-edit-task-actions">
          <button
            type="button"
            className="admin-edit-cancel-button"
            onClick={() => navigate('/admin/tasks')}
          >
            Cancel
          </button>

          <button type="submit" className="admin-edit-save-button" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminEditTask
