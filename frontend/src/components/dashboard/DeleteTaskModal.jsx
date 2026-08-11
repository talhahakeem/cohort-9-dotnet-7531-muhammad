import './DeleteTaskModal.css'

function DeleteTaskModal({ isOpen, taskTitle, onCancel, onConfirm }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h2>Delete Task?</h2>

        <p>
          Are you sure you want to delete{' '}
          <strong>{taskTitle}</strong>?
          This action cannot be undone.
        </p>

        <div className="delete-modal-actions">
          <button
            type="button"
            className="cancel-delete-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete-button"
            onClick={onConfirm}
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteTaskModal
