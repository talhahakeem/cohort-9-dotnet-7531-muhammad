import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import DeleteTaskModal from '../components/dashboard/DeleteTaskModal'
import './AdminAllTasks.css'
import { taskApi } from '../api/api'

const normalizeStatus = (value) => {
  if (!value) return 'Pending'
  return value.replace(/([a-z])([A-Z])/g, '$1 $2')
}

function AdminAllTasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [taskToDelete, setTaskToDelete] = useState(null)
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

  const handleCreateTask = () => navigate('/admin/tasks/create')

  const handleViewTask = (task) => {
    navigate('/admin/tasks/details', { state: { taskId: task.id } })
  }

  const handleEditTask = (task) => {
    navigate('/admin/tasks/edit', { state: { taskId: task.id } })
  }

  const handleDeleteTask = (task) => setTaskToDelete(task)

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return

    try {
      await taskApi.delete(taskToDelete.id)
      await fetchTasks()
      setTaskToDelete(null)
    } catch (err) {
      setError(err.message || 'Unable to delete task.')
      setTaskToDelete(null)
    }
  }

  const cancelDeleteTask = () => setTaskToDelete(null)

  return (
    <div className="admin-all-tasks-page">
      <div className="admin-all-tasks-header">
        <div>
          <h1>All Tasks</h1>
          <p>Manage and monitor all tasks across the system.</p>
        </div>

        <button
          type="button"
          className="admin-create-task-button"
          onClick={handleCreateTask}
        >
          + Create Task
        </button>
      </div>

      <div className="admin-task-filters">
        <input
          type="text"
          placeholder="Search tasks or keywords..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

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

      <div className="admin-task-summary">
        Showing <strong>{tasks.length}</strong> tasks
      </div>

      {error ? (
        <div className="admin-no-tasks">
          <h3>Unable to load tasks</h3>
          <p>{error}</p>
        </div>
      ) : loading ? (
        <div className="admin-no-tasks">
          <h3>Loading tasks...</h3>
        </div>
      ) : tasks.length === 0 ? (
        <div className="admin-no-tasks">
          <h3>No tasks found</h3>
          <p>Try changing your search or filter criteria.</p>
        </div>
      ) : (
        <div className="admin-task-table-card">
          <div className="admin-task-table">
            <div className="admin-task-row admin-task-header">
              <span>Task</span>
              <span>Category</span>
              <span>Status</span>
              <span>Priority</span>
              <span>Due Date</span>
              <span>Actions</span>
            </div>

            {tasks.map((task) => (
              <div className="admin-task-row" key={task.id}>
                <div className="admin-task-info">
                  <strong>{task.title}</strong>
                  <small>{task.description || 'No description'}</small>
                </div>

                <span>{task.category}</span>

                <span className={`admin-status-badge status-${normalizeStatus(task.status).toLowerCase().replace(' ', '-')}`}>
                  {normalizeStatus(task.status)}
                </span>

                <span className={`admin-priority-badge priority-${task.priority?.toLowerCase()}`}>
                  {task.priority}
                </span>

                <span>{new Date(task.dueDate).toLocaleDateString()}</span>

                <div className="admin-task-actions">
                  <button type="button" onClick={() => handleViewTask(task)}>View</button>
                  <button type="button" onClick={() => handleEditTask(task)}>Edit</button>
                  <button type="button" className="admin-delete-button" onClick={() => handleDeleteTask(task)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <DeleteTaskModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        onCancel={cancelDeleteTask}
        onConfirm={confirmDeleteTask}
      />
    </div>
  )
}

export default AdminAllTasks
