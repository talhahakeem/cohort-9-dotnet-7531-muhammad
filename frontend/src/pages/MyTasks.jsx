import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './MyTasks.css'

const initialTasks = [
  {
    id: 1,
    title: 'Complete project documentation',
    description: 'Prepare the technical documentation for the task management system.',
    status: 'In Progress',
    priority: 'High',
    category: 'Documentation',
    dueDate: 'Aug 12, 2026',
  },
  {
    id: 2,
    title: 'Review authentication module',
    description: 'Review login, registration and JWT authentication implementation.',
    status: 'Pending',
    priority: 'Medium',
    category: 'Development',
    dueDate: 'Aug 14, 2026',
  },
  {
    id: 3,
    title: 'Write unit tests',
    description: 'Add unit tests for task controller and task service.',
    status: 'Completed',
    priority: 'High',
    category: 'Testing',
    dueDate: 'Aug 08, 2026',
  },
  {
    id: 4,
    title: 'Update dashboard UI',
    description: 'Improve dashboard layout and make the interface responsive.',
    status: 'Pending',
    priority: 'Low',
    category: 'Frontend',
    dueDate: 'Aug 18, 2026',
  },
]

function MyTasks() {
const navigate = useNavigate()
  const [tasks] = useState(initialTasks)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === 'All' || task.status === statusFilter

    const matchesPriority =
      priorityFilter === 'All' || task.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>My Tasks</h1>
          <p>Manage and track your assigned tasks.</p>
        </div>

        <button className="create-task-button">
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

      <div className="tasks-summary">
        <span>
          Showing <strong>{filteredTasks.length}</strong> of{' '}
          <strong>{tasks.length}</strong> tasks
        </span>
      </div>

      <div className="tasks-list">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div className="task-card" key={task.id}>
              <div className="task-card-main">
                <div className="task-title-row">
                  <h3>{task.title}</h3>

                  <span
                    className={`priority-badge priority-${task.priority
                      .toLowerCase()}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <p>{task.description}</p>

                <div className="task-meta">
                  <span>{task.category}</span>
                  <span>Due: {task.dueDate}</span>
                </div>
              </div>

              <div className="task-card-side">
                <span
                  className={`status-badge status-${task.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {task.status}
                </span>

                <button
  type="button"
  className="view-button"
  onClick={() => navigate('/tasks/details')}
>
  View
</button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No tasks found</h3>
            <p>Try changing your search or filter criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyTasks