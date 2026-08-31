import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './MyTasks.css'
import DeleteTaskModal from '../components/dashboard/DeleteTaskModal'
import { taskApi } from '../api/api'

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function MyTasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const data = await taskApi.getAll({
        search: searchTerm,
        status: statusFilter === 'All' ? '' : statusFilter,
        priority: priorityFilter === 'All' ? '' : priorityFilter,
      })
      setTasks(data || [])
      setError('')
    } catch (err) {
      setError(err.message || 'Unable to load tasks.')
    } finally {
      setLoading(false)
    }
  }, [searchTerm, statusFilter, priorityFilter])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDeleteClick = (task) => {
    setSelectedTask(task)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedTask) {
      return
    }

    try {
      await taskApi.delete(selectedTask.id)
      await fetchTasks()
      setIsDeleteModalOpen(false)
      setSelectedTask(null)
    } catch (err) {
      setError(err.message || 'Unable to delete task.')
      setIsDeleteModalOpen(false)
      setSelectedTask(null)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSelectedTask(null)
  }

  return (
    <div className="my-tasks-page">
      <div className="page-header">
        <div>
          <p className="page-label">Task Management</p>
          <h1>My Tasks</h1>
          <p>Manage and track your assigned tasks.</p>
        </div>

        <button
          type="button"
          className="create-task-button"
          onClick={() => navigate('/tasks/create')}
        >
          + Create Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="tasks-summary">
        <span>
          Showing <strong>{tasks.length}</strong> tasks
        </span>
      </div>

      {error ? (
        <div className="empty-state">
          <h3>Unable to load tasks</h3>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="empty-state">
          <h3>Loading tasks...</h3>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Try changing your search or filter criteria.</p>
        </div>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className="task-card-main">
                <div className="task-title-row">
                  <h3>{task.title}</h3>

                  <span
                    className={`priority-badge priority-${task.priority?.toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p>{task.description || 'No description provided.'}</p>

                <div className="task-meta">
                  <span>{task.category}</span>
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="task-card-side">
                <span
                  className={`status-badge status-${normalizeStatus(task.status).toLowerCase().replace(' ', '-')}`}
                >
                  {normalizeStatus(task.status)}
                </span>

                <div className="task-actions">
                  <button
                    type="button"
                    className="view-button"
                    onClick={() => navigate('/tasks/details', { state: { taskId: task.id } })}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => navigate('/tasks/edit', { state: { taskId: task.id } })}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteClick(task)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <DeleteTaskModal
        isOpen={isDeleteModalOpen}
        taskTitle={selectedTask?.title || ''}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}

export default MyTasks