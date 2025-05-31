import React, { useState } from 'react';
import { apiService } from '../services/api';

const CustomerForm = () => {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });

  // State for form submission status
  const [status, setStatus] = useState({
    submitting: false,
    error: null,
    success: null
  });

  // State for displaying the added customer
  const [addedCustomer, setAddedCustomer] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (!formData.name || !formData.address || !formData.phone) {
      setStatus({
        submitting: false,
        error: 'Please fill in all fields',
        success: null
      });
      return;
    }

    // Set submitting state
    setStatus({
      submitting: true,
      error: null,
      success: null
    });

    try {
      // Map form data to match database field names
      const customerData = {
        name: formData.name,     // Will be mapped to 'nama' in the PHP API
        address: formData.address, // Will be mapped to 'alamat' in the PHP API
        phone: formData.phone    // Will be mapped to 'telp' in the PHP API
      };

      // Call the addCustomer function from our API service
      const response = await apiService.addCustomer(customerData);

      // Log the response for debugging
      console.log('Response from server:', response);

      // Update state with success message and added customer
      setStatus({
        submitting: false,
        error: null,
        success: response.message || 'Customer added successfully!'
      });

      setAddedCustomer(response.data);

      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: ''
      });
    } catch (error) {
      // Handle errors
      console.error('Error adding customer:', error);

      setStatus({
        submitting: false,
        error: error.response?.data?.message || 'Failed to add customer. Please try again.',
        success: null
      });
    }
  };

  // Reset the form and status
  const handleReset = () => {
    setFormData({
      name: '',
      address: '',
      phone: ''
    });

    setStatus({
      submitting: false,
      error: null,
      success: null
    });

    setAddedCustomer(null);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="mb-0">Add New Customer</h2>
            </div>
            <div className="card-body">
              {/* Success message */}
              {status.success && (
                <div className="alert alert-success" role="alert">
                  {status.success}
                </div>
              )}

              {/* Error message */}
              {status.error && (
                <div className="alert alert-danger" role="alert">
                  {status.error}
                </div>
              )}

              {/* Customer form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Customer Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter customer address"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={status.submitting}
                  >
                    {status.submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Add Customer'
                    )}
                  </button>
                </div>
              </form>

              {/* Display added customer details */}
              {addedCustomer && (
                <div className="mt-4">
                  <h4>Added Customer Details:</h4>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p><strong>ID:</strong> {addedCustomer.id}</p>
                      <p><strong>Name:</strong> {addedCustomer.nama || addedCustomer.name}</p>
                      <p><strong>Address:</strong> {addedCustomer.alamat || addedCustomer.address}</p>
                      <p><strong>Phone:</strong> {addedCustomer.telp || addedCustomer.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
