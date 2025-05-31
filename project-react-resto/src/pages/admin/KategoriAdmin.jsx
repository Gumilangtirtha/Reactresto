import React, { useState, useEffect } from 'react';
import { kategoriService } from '../../services/api';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';

const KategoriAdmin = () => {
  // State untuk menyimpan data kategori
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk modal tambah/edit
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('Tambah Kategori Baru');
  const [formData, setFormData] = useState({
    id: '',
    nama_kategori: '',
    keterangan: ''
  });
  const [isEdit, setIsEdit] = useState(false);

  // State untuk alert
  const [alert, setAlert] = useState({
    show: false,
    variant: 'success',
    message: ''
  });

  // Mengambil data kategori saat komponen dimount
  useEffect(() => {
    fetchKategori();
  }, []);

  // Fungsi untuk mengambil data kategori dari API
  const fetchKategori = async () => {
    setLoading(true);
    try {
      const data = await kategoriService.getAllKategori();
      setKategori(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching kategori:', err);
      setError('Gagal mengambil data kategori. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menampilkan modal tambah kategori
  const handleShowAddModal = () => {
    setFormData({
      id: '',
      nama_kategori: '',
      keterangan: ''
    });
    setModalTitle('Tambah Kategori Baru');
    setIsEdit(false);
    setShowModal(true);
  };

  // Fungsi untuk menampilkan modal edit kategori
  const handleShowEditModal = (kategori) => {
    setFormData({
      id: kategori.id,
      nama_kategori: kategori.nama_kategori,
      keterangan: kategori.keterangan
    });
    setModalTitle('Edit Kategori');
    setIsEdit(true);
    setShowModal(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Fungsi untuk menghandle perubahan pada form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Fungsi untuk menyimpan data kategori (tambah/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        // Update kategori
        await kategoriService.updateKategori(formData);
        setAlert({
          show: true,
          variant: 'success',
          message: 'Kategori berhasil diperbarui!'
        });
      } else {
        // Tambah kategori baru
        await kategoriService.addKategori(formData);
        setAlert({
          show: true,
          variant: 'success',
          message: 'Kategori baru berhasil ditambahkan!'
        });
      }

      // Tutup modal dan refresh data
      handleCloseModal();
      fetchKategori();

      // Sembunyikan alert setelah 3 detik
      setTimeout(() => {
        setAlert({ ...alert, show: false });
      }, 3000);
    } catch (err) {
      console.error('Error saving kategori:', err);
      setAlert({
        show: true,
        variant: 'danger',
        message: `Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} kategori. ${err.message}`
      });
    }
  };

  // Fungsi untuk menghapus kategori
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
      try {
        await kategoriService.deleteKategori(id);
        setAlert({
          show: true,
          variant: 'success',
          message: 'Kategori berhasil dihapus!'
        });

        // Refresh data
        fetchKategori();

        // Sembunyikan alert setelah 3 detik
        setTimeout(() => {
          setAlert({ ...alert, show: false });
        }, 3000);
      } catch (err) {
        console.error('Error deleting kategori:', err);
        setAlert({
          show: true,
          variant: 'danger',
          message: `Gagal menghapus kategori. ${err.message}`
        });
      }
    }
  };

  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">⚔️ Hero Role Management ⚔️</h2>

        {/* Alert untuk notifikasi */}
        {alert.show && (
          <Alert variant={alert.variant} onClose={() => setAlert({...alert, show: false})} dismissible>
            {alert.message}
          </Alert>
        )}

        <p className="mb-4">
          Manage hero roles and categories in the Mobile Legends arena.
        </p>

        <button
          className="btn-custom btn-primary-custom"
          onClick={handleShowAddModal}
        >
          🎮 Add New Hero Role
        </button>

        <div className="mt-4">
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hero Role</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {kategori.length > 0 ? (
                  kategori.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.nama_kategori}</td>
                      <td>{item.keterangan}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info me-2"
                          onClick={() => handleShowEditModal(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      Tidak ada data kategori. Silakan tambahkan kategori baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal untuk tambah/edit kategori */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kategori</Form.Label>
              <Form.Control
                type="text"
                name="nama_kategori"
                value={formData.nama_kategori}
                onChange={handleChange}
                required
                placeholder="Masukkan nama kategori"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keterangan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="keterangan"
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Masukkan keterangan kategori"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default KategoriAdmin;
