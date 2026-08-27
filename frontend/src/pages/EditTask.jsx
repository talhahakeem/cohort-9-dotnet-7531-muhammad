import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './EditTask.css'
import { taskApi } from '../api/api'

function EditTask() {
  const navigate = useNavigate()
  const location = useLocation()
  const taskId = location.state?.taskId

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
  })
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
        const task = await taskApi.getById(taskId)
        setFormData({
          title: task.title || '',
          description: task.description || '',
          category: task.category || '',
          priority: task.priority || 'Medium',
          status: task.status || 'Pending',
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
      await taskApi.update(taskId, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: formData.status,
        dueDate: new Date(formData.dueDate).toISOString(),
      })

      navigate('/tasks', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to update task.')
    }
  }

  if (loading) {
    return <div className="edit-task-page"><div className="edit-task-card"><h2>Loading task...</h2></div></div>
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
          onClick={() => navigate('/tasks')}
        >
          Back to Tasks
        </button>
      </div>

      <form className="edit-task-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter task description"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={formData.category} onChange={handleChange}>
              <option value="Development">Development</option>
              <option value="Design">Design</option>
              <option value="Testing">Testing</option>
              <option value="Documentation">Documentation</option>
              <option value="Meeting">Meeting</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" name="priority" value={formData.priority} onChange={handleChange}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="InProgress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
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
        </div>

        {error && <p role="alert" style={{ color: '#dc2626' }}>{error}</p>}

        <div className="edit-task-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate('/tasks')}
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