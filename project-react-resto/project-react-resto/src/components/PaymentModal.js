import React from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '500px',
    width: '90%'
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)'
  }
};

const PaymentModal = ({ isOpen, onClose, orderData }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Payment Modal"
    >
      <div className="modal-header">
        <h5 className="modal-title">Payment Details</h5>
        <button 
          type="button" 
          className="btn-close" 
          onClick={onClose}
          aria-label="Close"
        ></button>
      </div>
      
      <div className="modal-body">
        {orderData && (
          <div className="payment-details">
            <p><strong>Order ID:</strong> {orderData.id}</p>
            <p><strong>Total:</strong> {orderData.total}</p>
            {/* Add more payment form fields here */}
          </div>
        )}
      </div>
      
      <div className="modal-footer">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={onClose}
        >
          Close
        </button>
        <button 
          type="button" 
          className="btn btn-primary"
          onClick={() => {
            // Handle payment processing here
            onClose();
          }}
        >
          Process Payment
        </button>
      </div>
    </Modal>
  );
};

export default PaymentModal;
