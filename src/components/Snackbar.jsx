import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function Snackbar({ message, type = 'success', onClose }) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'danger':
        return 'bg-danger';
      default:
        return 'bg-primary';
    }
  };

  return (
    <div
      className={`position-fixed bottom-0 end-0 p-3`}
      style={{ zIndex: 1050 }}
    >
      <div 
        className={`${getBackgroundColor()} text-white px-4 py-3 rounded-3 d-flex align-items-center gap-2`}
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <i className={`bi bi-${type === 'success' ? 'check' : 'x'}-circle`}></i>
        {message}
      </div>
    </div>
  );
}

Snackbar.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(['success', 'danger']),
  onClose: PropTypes.func.isRequired
};