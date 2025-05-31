import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { formatDate } from '../../utils/formatters';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Function to show notification and clear it after delay
  const showNotification = (message, isError = false) => {
    if (isError) {
      setError(message);
      setSuccess('');
    } else {
      setSuccess(message);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(''); // Clear any previous errors
      console.log('Fetching users from /api/users.php...');

      const response = await axios.get('/api/users.php');
      console.log('API Response:', response);

      if (response.data.success) {
        setUsers(response.data.data || []);
        console.log('Users loaded successfully:', response.data.data);
      } else {
        console.error('API returned error:', response.data.message);
        showNotification(response.data.message || 'Failed to fetch users', true);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      showNotification(error.response?.data?.message || 'Failed to fetch users', true);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = () => {
    // Fungsi ini tidak lagi digunakan karena data diambil dari API
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'user'
    });
    setError('');
  };

  const handleShowModal = (user = null) => {
    if (user) {
      setCurrentUser(user);
      setFormData({
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        password: '' // Clear password field for editing
      });
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate form
    const errors = [];
    if (!formData.name.trim()) errors.push('Name is required');
    if (!formData.username.trim()) errors.push('Username is required');
    if (!formData.email.trim()) errors.push('Email is required');
    if (!currentUser && !formData.password) errors.push('Password is required for new users');

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.push('Please enter a valid email address');
    }

    // Username validation - only allow letters, numbers, and underscores
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (formData.username && !usernameRegex.test(formData.username)) {
      errors.push('Username can only contain letters, numbers, and underscores');
    }

    if (errors.length > 0) {
      showNotification(errors.join('\n'), true);
      return;
    }

    try {
      setSaving(true);
      let response;

      if (currentUser) {
        // Update existing user
        response = await axios.put('/api/users.php', {
          id: currentUser.id,
          ...formData
        });
      } else {
        // Create new user
        response = await axios.post('/api/users.php', formData);
      }

      if (response.data.success) {
        showNotification(`User ${currentUser ? 'updated' : 'created'} successfully`);
        handleCloseModal();
        fetchUsers(); // Refresh user list
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Save user failed:', error);
      showNotification(error.response?.data?.message || `Failed to ${currentUser ? 'update' : 'create'} user`, true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await axios.delete('/api/users.php', {
        data: { id: userToDelete.id }
      });

      if (response.data.success) {
        showNotification('User deleted successfully');
        fetchUsers(); // Refresh user list
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Delete user failed:', error);
      showNotification(error.response?.data?.message || 'Failed to delete user', true);
    } finally {
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">User Management</h2>
        <p className="mb-4">
          Manage application users here.
        </p>

        {/* Notifications */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {/* Action Buttons */}
        <div className="mb-4">
          <Button
            variant="primary"
            onClick={() => handleShowModal()}
            className="me-2"
          >
            Add New User
          </Button>
          <Button
            variant="outline-secondary"
            onClick={fetchUsers}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Users Table */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center">No users found</td>
                  </tr>
                ) : (
                  users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`badge ${user.role === 'admin' ? 'bg-danger' : 'bg-primary'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(user)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(user)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </div>

      {/* User Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser ? 'Edit User' : 'Add New User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter user's full name"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Password {currentUser && <span className="text-muted">(Leave blank to keep unchanged)</span>}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required={!currentUser}
                placeholder={currentUser ? "Enter new password (optional)" : "Enter password"}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={handleCloseModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        show={showDeleteConfirm}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default UserAdmin;
