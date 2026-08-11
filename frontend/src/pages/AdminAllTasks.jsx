import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import DeleteTaskModal from '../components/dashboard/DeleteTaskModal'
import './AdminAllTasks.css'

const initialTasks = [
  {
    id: 1,
    title: 'Complete project documentation',
    description: 'Prepare the technical documentation for the system.',
    assignee: 'Talha',
    status: 'In Progress',
    priority: 'High',
    category: 'Documentation',
    dueDate: 'Aug 12, 2026',
  },
  {
    id: 2,
    title: 'Review authentication module',
    description: 'Review login, registration and JWT implementation.',
    assignee: 'Ali Khan',
    status: 'Pending',
    priority: 'Medium',
    category: 'Development',
    dueDate: 'Aug 14, 2026',
  },
  {
    id: 3,
    title: 'Write unit tests',
    description: 'Add unit tests for task controller and task service.',
    assignee: 'Ahmed',
    status: 'Completed',
    priority: 'High',
    category: 'Testing',
    dueDate: 'Aug 08, 2026',
  },
  {
    id: 4,
    title: 'Update dashboard UI',
    description: 'Improve dashboard layout and responsiveness.',
    assignee: 'Talha',
    status: 'Pending',
    priority: 'Low',
    category: 'Frontend',
    dueDate: 'Aug 18, 2026',
  },
  {
    id: 5,
    title: 'Fix API validation',
    description: 'Improve validation and error handling in APIs.',
    assignee: 'Ali Khan',
    status: 'In Progress',
    priority: 'High',
    category: 'Backend',
    dueDate: 'Aug 20, 2026',
  },
]

function AdminAllTasks() {
  const navigate = useNavigate()

  const [tasks, setTasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [taskToDelete, setTaskToDelete] = useState(null)

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()

    const matchesSearch =
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search) ||
      task.assignee.toLowerCase().includes(search)

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleCreateTask = () => {
    navigate('/admin/tasks/create')
  }

  const handleViewTask = () => {
    navigate('/admin/tasks/details')
  }

  const handleEditTask = (task) => {
    navigate('/admin/tasks/edit')
  }

  const handleDeleteTask = (task) => {
    setTaskToDelete(task)
  }

  const confirmDeleteTask = () => {
    if (!taskToDelete) return
    setTasks((currentTasks) => currentTasks.filter((item) => item.id !== taskToDelete.id))
    setTaskToDelete(null)
  }

  const cancelDeleteTask = () => {
    setTaskToDelete(null)
  }

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
          placeholder="Search tasks or users..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
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
        Showing <strong>{filteredTasks.length}</strong> of{' '}
        <strong>{tasks.length}</strong> tasks
      </div>

      <div className="admin-task-table-card">
        <div className="admin-task-table">
          <div className="admin-task-row admin-task-header">
            <span>Task</span>
            <span>Assigned To</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Due Date</span>
            <span>Actions</span>
          </div>

          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <div className="admin-task-row" key={task.id}>
                <div className="admin-task-info">
                  <strong>{task.title}</strong>
                  <small>{task.category}</small>
                </div>

                <span>{task.assignee}</span>

                <span
                  className={`admin-status-badge status-${task.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {task.status}
                </span>

                <span
                  className={`admin-priority-badge priority-${task.priority.toLowerCase()}`}
                >
                  {task.priority}
                </span>

                <span>{task.dueDate}</span>

                <div className="admin-task-actions">
                  <button
                    type="button"
                    onClick={handleViewTask}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() => handleDeleteTask(task)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="admin-no-tasks">
              <h3>No tasks found</h3>
              <p>Try changing your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
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
