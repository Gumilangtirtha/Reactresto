import React, { useState, useEffect } from 'react';
import { Container, Table, Alert, Spinner } from 'react-bootstrap';
import { kategoriService } from '../services/api';

const KategoriPage = () => {
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKategori();
  }, []);

  const fetchKategori = async () => {
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout: Server tidak merespon')), 10000)
      );

      const dataPromise = kategoriService.getAllKategori();
      const data = await Promise.race([dataPromise, timeoutPromise]);

      if (!data) {
        throw new Error('Data kategori kosong');
      }

      setKategori(data);
      setError(null);
    } catch (err) {
      let errorMessage = 'Gagal mengambil data kategori. ';
      if (err.message.includes('Timeout')) {
        errorMessage += 'Server tidak merespon, silakan coba lagi nanti.';
      } else if (err.response?.status === 404) {
        errorMessage += 'Data tidak ditemukan.';
      } else if (!navigator.onLine) {
        errorMessage += 'Periksa koneksi internet Anda.';
      } else {
        errorMessage += 'Terjadi kesalahan, silakan coba lagi.';
      }
      setError(errorMessage);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>⚔️ Hero Categories ⚔️</h2>
        <button className="btn-custom btn-primary-custom">🎮 Add New Hero Category</button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="bg-light">
          <tr>
            <th width="10%">No</th>
            <th width="40%">Hero Role</th>
            <th width="50%">Description</th>
          </tr>
        </thead>
        <tbody>
          {kategori.length > 0 ? (
            kategori.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.nama_kategori}</td>
                <td>{item.keterangan}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No hero categories available
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default KategoriPage;
