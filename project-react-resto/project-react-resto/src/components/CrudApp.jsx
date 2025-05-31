import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import DataTable from './DataTable';
import DataForm from './DataForm';
import DeleteConfirmation from './DeleteConfirmation';

const CrudApp = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await apiService.getAllItems();
      setData(items);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (formData) => {
    try {
      setLoading(true);
      if (currentItem) {
        // Update existing item
        await apiService.updateItem(currentItem.id, {
          ...formData,
          userId: currentItem.userId || 1,
        });
        showNotification('Item updated successfully!');
      } else {
        // Create new item
        await apiService.createItem({
          ...formData,
          userId: 1, // Default user ID for new items
        });
        showNotification('Item created successfully!');
      }
      // Refresh data and reset form
      await fetchData();
      handleCancelForm();
    } catch (err) {
      setError('Failed to save data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (item) => {
    setCurrentItem(item);
    setShowForm(true);
  };

  // Handle delete button click
  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  // Confirm deletion
  const confirmDelete = async (id) => {
    try {
      setLoading(true);
      await apiService.deleteItem(id);
      showNotification('Item deleted successfully!');
      // Refresh data and close modal
      await fetchData();
      setShowDeleteModal(false);
    } catch (err) {
      setError('Failed to delete item. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Cancel form
  const handleCancelForm = () => {
    setShowForm(false);
    setCurrentItem(null);
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">CRUD Application</h1>

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

      {/* Add button */}
      {!showForm && (
        <div className="mb-3">
          <button
            className="btn btn-success"
            onClick={() => setShowForm(true)}
          >
            Add New Item
          </button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <DataForm
          item={currentItem}
          onSubmit={handleSubmit}
          onCancel={handleCancelForm}
        />
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Data table */}
      {!loading && <DataTable data={data} onEdit={handleEdit} onDelete={handleDelete} />}

      {/* Delete confirmation modal */}
      <DeleteConfirmation
        show={showDeleteModal}
        itemId={itemToDelete}
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default CrudApp;
