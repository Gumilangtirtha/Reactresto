import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

const Home = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Selamat Datang di Aplikasi Manajemen Restoran</h2>

        {/* Authentication Status */}
        {isAuthenticated ? (
          <Alert variant="success" className="mb-4">
            <strong>Selamat datang, {user?.name}!</strong>
            <br />
            Anda login sebagai: <span className="badge bg-primary ms-1">{user?.role}</span>
            {isAdmin() && (
              <div className="mt-2">
                <Link to="/admin" className="btn btn-sm btn-outline-primary">
                  Akses Panel Admin
                </Link>
              </div>
            )}
          </Alert>
        ) : (
          <Alert variant="info" className="mb-4">
            <strong>Selamat datang!</strong>
            <br />
            Silakan <Link to="/login">login</Link> untuk mengakses fitur lengkap atau <Link to="/register">daftar</Link> jika belum memiliki akun.
          </Alert>
        )}

        <p className="mb-4">
          Silahkan pilih menu di sidebar untuk mengakses fitur aplikasi.
        </p>

        <div className="row mt-5">
          <div className="col-md-4 mb-4">
            <div className="content-card h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="feature-icon">📊</div>
                <h4 className="mb-0 ms-3">Statistik Hari Ini</h4>
              </div>
              <p>Lihat statistik penjualan dan kunjungan hari ini.</p>
              <button className="btn-custom btn-primary-custom mt-3">Lihat Detail</button>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="content-card h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="feature-icon">🍽️</div>
                <h4 className="mb-0 ms-3">Menu Populer</h4>
              </div>
              <p>Lihat menu yang paling banyak dipesan minggu ini.</p>
              <button className="btn-custom btn-primary-custom mt-3">Lihat Menu</button>
            </div>
          </div>

          <div className="col-md-4 mb-4">
            <div className="content-card h-100">
              <div className="d-flex align-items-center mb-3">
                <div className="feature-icon">📝</div>
                <h4 className="mb-0 ms-3">Order Terbaru</h4>
              </div>
              <p>Lihat dan kelola pesanan terbaru dari pelanggan.</p>
              <button className="btn-custom btn-primary-custom mt-3">Lihat Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
