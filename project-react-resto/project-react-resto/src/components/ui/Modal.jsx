import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Modal Component
 * 
 * A reusable modal component for displaying content in a dialog.
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnEsc = true,
  closeOnOverlayClick = true,
  showCloseButton = true,
  className = '',
  ...props
}) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && isOpen && event.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    
    // Prevent body scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose, closeOnEsc]);
  
  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      {...props}
    >
      <div 
        className={`bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          {showCloseButton && (
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Modal body */}
        <div className="px-6 py-4">
          {children}
        </div>
        
        {/* Modal footer */}
        {footer && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
  closeOnEsc: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string
};

/**
 * Confirmation Modal Component
 * 
 * A specialized modal for confirmation dialogs.
 */
export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  ...props
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            variant="light"
            onClick={onClose}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmText}
          </Button>
        </>
      }
      {...props}
    >
      <p className="text-gray-700">{message}</p>
    </Modal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.node,
  message: PropTypes.node,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.string
};

export default Modal;
