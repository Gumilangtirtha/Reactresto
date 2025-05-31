import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3">
          <span className="text-danger">Oops!</span> Halaman tidak ditemukan.
        </p>
        <p className="lead">
          Halaman yang Anda cari tidak ada atau telah dipindahkan.
        </p>
        <Link to="/" className="btn-custom btn-primary-custom">
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
