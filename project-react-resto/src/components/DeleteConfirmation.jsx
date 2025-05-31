import React from 'react';

const DeleteConfirmation = ({ show, itemId, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onCancel}
            ></button>
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete this item? This action cannot be undone.</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => onConfirm(itemId)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop show"></div>
    </div>
  );
};

export default DeleteConfirmation;
