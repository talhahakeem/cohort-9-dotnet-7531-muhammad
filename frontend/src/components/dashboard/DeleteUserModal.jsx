import './DeleteUserModal.css'

function DeleteUserModal({ isOpen, userName, onCancel, onConfirm }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="delete-user-modal-overlay">
      <div className="delete-user-modal">
        <h2>Delete User?</h2>

        <p>
          Are you sure you want to delete{' '}
          <strong>{userName}</strong>?
          This action cannot be undone.
        </p>

        <div className="delete-user-modal-actions">
          <button
            type="button"
            className="cancel-delete-user-button"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete-user-button"
            onClick={onConfirm}
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteUserModal
