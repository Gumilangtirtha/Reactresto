import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

const CustomerManagement = () => {
  // State for customers data
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // list, add, edit, view
  
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: ''
  });
  
  // State for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Fetch all customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);
  
  // Function to fetch all customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllCustomers();
      if (response.success) {
        setCustomers(response.data);
      } else {
        setError(response.message || 'Failed to fetch customers');
      }
    } catch (error) {
      setError('Error fetching customers: ' + (error.message || 'Unknown error'));
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to fetch a single customer
  const fetchCustomer = async (id) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCustomerById(id);
      if (response.success) {
        setSelectedCustomer(response.data);
        setViewMode('view');
      } else {
        setError(response.message || 'Failed to fetch customer');
      }
    } catch (error) {
      setError('Error fetching customer: ' + (error.message || 'Unknown error'));
      console.error('Error fetching customer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to add a new customer
  const addCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.address || !formData.phone) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      const response = await apiService.addCustomer(formData);
      if (response.success) {
        showNotification('Customer added successfully!', 'success');
        fetchCustomers(); // Refresh the list
        resetForm();
        setViewMode('list');
      } else {
        setError(response.message || 'Failed to add customer');
      }
    } catch (error) {
      setError('Error adding customer: ' + (error.message || 'Unknown error'));
      console.error('Error adding customer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to update a customer
  const updateCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Validate form data
      if (!formData.name || !formData.address || !formData.phone) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }
      
      const customerData = {
        id: selectedCustomer.id,
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      };
      
      const response = await apiService.updateCustomer(customerData);
      if (response.success) {
        showNotification('Customer updated successfully!', 'success');
        fetchCustomers(); // Refresh the list
        resetForm();
        setViewMode('list');
      } else {
        setError(response.message || 'Failed to update customer');
      }
    } catch (error) {
      setError('Error updating customer: ' + (error.message || 'Unknown error'));
      console.error('Error updating customer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to delete a customer
  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.deleteCustomer(id);
      if (response.success) {
        showNotification('Customer deleted successfully!', 'success');
        fetchCustomers(); // Refresh the list
      } else {
        setError(response.message || 'Failed to delete customer');
      }
    } catch (error) {
      setError('Error deleting customer: ' + (error.message || 'Unknown error'));
      console.error('Error deleting customer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewMode === 'edit') {
      updateCustomer();
    } else {
      addCustomer();
    }
  };
  
  // Reset form and state
  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      phone: ''
    });
    setSelectedCustomer(null);
  };
  
  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };
  
  // Set up edit mode
  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setFormData({
      name: customer.nama,
      address: customer.alamat,
      phone: customer.telp
    });
    setViewMode('edit');
  };
  
  // Render customer form
  const renderForm = () => {
    return (
      <div className="card mb-4">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0">{viewMode === 'edit' ? 'Edit Customer' : 'Add New Customer'}</h2>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Customer Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>
            
            <div className="d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => {
                  resetForm();
                  setViewMode('list');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {viewMode === 'edit' ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  viewMode === 'edit' ? 'Update Customer' : 'Add Customer'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  // Render customer details view
  const renderCustomerDetails = () => {
    if (!selectedCustomer) return null;
    
    return (
      <div className="card mb-4">
        <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Customer Details</h2>
          <button
            className="btn btn-light btn-sm"
            onClick={() => setViewMode('list')}
          >
            Back to List
          </button>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">ID:</div>
            <div className="col-md-9">{selectedCustomer.id}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Name:</div>
            <div className="col-md-9">{selectedCustomer.nama}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Address:</div>
            <div className="col-md-9">{selectedCustomer.alamat}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Phone:</div>
            <div className="col-md-9">{selectedCustomer.telp}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Created At:</div>
            <div className="col-md-9">{selectedCustomer.created_at}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Updated At:</div>
            <div className="col-md-9">{selectedCustomer.updated_at}</div>
          </div>
          
          <div className="d-flex justify-content-end">
            <button
              className="btn btn-primary me-2"
              onClick={() => handleEdit(selectedCustomer)}
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => deleteCustomer(selectedCustomer.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4 text-center">Customer Management</h1>
      
      {/* Notification */}
      {notification.show && (
        <div className={`alert alert-${notification.type}`} role="alert">
          {notification.message}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Action buttons */}
      {viewMode === 'list' && (
        <div className="mb-4">
          <div className="d-flex justify-content-center gap-2">
            <button
              className="btn btn-primary"
              style={{ backgroundColor: '#1E88E5' }}
              onClick={() => fetchCustomers()}
            >
              GET
            </button>
            <button
              className="btn btn-secondary"
              style={{ backgroundColor: '#757575' }}
              onClick={() => {
                if (selectedCustomer) {
                  fetchCustomer(selectedCustomer.id);
                } else {
                  showNotification('Please select a customer first', 'warning');
                }
              }}
            >
              SHOW
            </button>
            <button
              className="btn btn-success"
              style={{ backgroundColor: '#43A047' }}
              onClick={() => {
                resetForm();
                setViewMode('add');
              }}
            >
              POST
            </button>
            <button
              className="btn btn-danger"
              style={{ backgroundColor: '#E53935' }}
              onClick={() => {
                if (selectedCustomer) {
                  deleteCustomer(selectedCustomer.id);
                } else {
                  showNotification('Please select a customer first', 'warning');
                }
              }}
            >
              DELETE
            </button>
            <button
              className="btn btn-warning"
              style={{ backgroundColor: '#FFC107', color: '#212121' }}
              onClick={() => {
                if (selectedCustomer) {
                  handleEdit(selectedCustomer);
                } else {
                  showNotification('Please select a customer first', 'warning');
                }
              }}
            >
              UPDATE
            </button>
          </div>
        </div>
      )}
      
      {/* Main content based on view mode */}
      {viewMode === 'list' && (
        <div className="card">
          <div className="card-header bg-dark text-white">
            <h2 className="mb-0">Customer List</h2>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="d-flex justify-content-center my-3">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : customers.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map(customer => (
                      <tr 
                        key={customer.id}
                        className={selectedCustomer && selectedCustomer.id === customer.id ? 'table-primary' : ''}
                        onClick={() => setSelectedCustomer(customer)}
                      >
                        <td>{customer.id}</td>
                        <td>{customer.nama}</td>
                        <td>{customer.alamat.substring(0, 30)}...</td>
                        <td>{customer.telp}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button
                              type="button"
                              className="btn btn-info btn-sm me-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                fetchCustomer(customer.id);
                              }}
                            >
                              View
                            </button>
                            <button
                              type="button"
                              className="btn btn-primary btn-sm me-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(customer);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteCustomer(customer.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info">
                No customers found. Add some customers to see them here.
              </div>
            )}
          </div>
        </div>
      )}
      
      {(viewMode === 'add' || viewMode === 'edit') && renderForm()}
      {viewMode === 'view' && renderCustomerDetails()}
    </div>
  );
};

export default CustomerManagement;
