import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const PelangganAdmin = () => {
  // State for customers data
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    nama: '',
    telepon: '',
    alamat: ''
  });
  
  // State for loading and error handling
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/project-react-resto/api/get_customers.php');
      console.log('API Response:', response.data); // Debug log
      if (response.data.success) {
        setCustomers(response.data.data || []);
        setError('');
      } else {
        showNotification(response.data.message || 'Gagal mengambil data pelanggan', true);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      showNotification(error.response?.data?.message || 'Gagal mengambil data pelanggan', true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCustomer(null);
    setFormData({
      nama: '',
      telepon: '',
      alamat: ''
    });
  };

  const handleShowModal = (customer = null) => {
    if (customer) {
      setCurrentCustomer(customer);
      setFormData({
        nama: customer.nama,
        telepon: customer.telp || customer.telepon,
        alamat: customer.alamat
      });
    } else {
      setCurrentCustomer(null);
      setFormData({
        nama: '',
        telepon: '',
        alamat: ''
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
    if (!formData.nama.trim()) errors.push('Nama harus diisi');
    if (!formData.telepon.trim()) errors.push('Nomor telepon harus diisi');
    if (!formData.alamat.trim()) errors.push('Alamat harus diisi');
    
    if (errors.length > 0) {
      setError(errors.join(', '));
      return;
    }

    setSaving(true);
    try {
      let response;
      if (currentCustomer) {
        // Update existing customer
        response = await axios.put('http://localhost/project-react-resto/api/update_customer.php', {
          ...formData,
          id: currentCustomer.id,
          telp: formData.telepon // Send as telp for database compatibility
        });
      } else {
        // Add new customer
        response = await axios.post('http://localhost/project-react-resto/api/add_customer.php', {
          nama: formData.nama,
          telp: formData.telepon, // Send as telp for database compatibility
          alamat: formData.alamat
        });
      }

      console.log('Save Response:', response.data); // Debug log

      if (response.data.success) {
        showNotification(`Pelanggan berhasil ${currentCustomer ? 'diperbarui' : 'ditambahkan'}`);
        handleCloseModal();
        fetchCustomers(); // Refresh customer list
      } else {
        throw new Error(response.data.message || `Gagal ${currentCustomer ? 'memperbarui' : 'menambahkan'} pelanggan`);
      }
    } catch (error) {
      console.error('Save customer failed:', error);
      showNotification(error.message || `Gagal ${currentCustomer ? 'memperbarui' : 'menambahkan'} pelanggan`, true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (customer) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus pelanggan "${customer.nama}"?`)) {
      try {
        setLoading(true); // Show loading state
        const response = await axios.delete('http://localhost/project-react-resto/api/delete_customer.php', {
          data: { id: customer.id },
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success) {
          showNotification('Pelanggan berhasil dihapus');
          await fetchCustomers(); // Refresh customer list and wait for it to complete
        } else {
          throw new Error(response.data.message || 'Gagal menghapus pelanggan');
        }
      } catch (error) {
        console.error('Delete customer failed:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Gagal menghapus pelanggan';
        showNotification(errorMessage, true);
      } finally {
        setLoading(false); // Hide loading state
      }
    }
  };

  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Manajemen Pelanggan</h2>
        <p className="mb-4">
          Kelola data pelanggan restoran Anda di sini.
        </p>
        
        {/* Notifications */}
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        {/* Action Buttons */}
        <div className="mb-4">
          <button 
            className="btn btn-primary"
            onClick={() => handleShowModal()}
          >
            Tambah Pelanggan Baru
          </button>
        </div>

        {/* Customers Table */}
        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Telepon</th>
                    <th>Alamat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">Tidak ada data pelanggan</td>
                    </tr>
                  ) : (
                    customers.map(customer => (
                      <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.nama}</td>
                        <td>{customer.telp || customer.telepon}</td>
                        <td>{customer.alamat}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary me-2"
                            onClick={() => handleShowModal(customer)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(customer)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{currentCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                type="text"
                placeholder="Masukkan nama pelanggan"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Telepon</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Masukkan nomor telepon"
                name="telepon"
                value={formData.telepon}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Masukkan alamat"
                name="alamat"
                value={formData.alamat}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseModal}>
                Batal
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
                    Menyimpan...
                  </>
                ) : (
                  currentCustomer ? 'Update' : 'Simpan'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PelangganAdmin;
