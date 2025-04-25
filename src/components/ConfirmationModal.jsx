import React from 'react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header border-0 bg-danger text-white">
              <h5 className="modal-title d-flex align-items-center gap-2">
                <i className="bi bi-exclamation-triangle-fill"></i>
                {title}
              </h5>
              <button 
                type="button" 
                className="btn-close btn-close-white" 
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body py-4">
              <p className="mb-0">{message}</p>
            </div>
            <div className="modal-footer border-0">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-danger d-flex align-items-center gap-2"
                onClick={onConfirm}
              >
                <i className="bi bi-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
}