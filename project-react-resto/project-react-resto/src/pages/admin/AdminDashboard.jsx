import React from 'react';

const AdminDashboard = () => {
  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Pengaturan Admin</h2>
        <p className="mb-4">
          Kelola pengaturan, notifikasi dan hak akses pengguna di sini.
        </p>
        <button className="btn-custom btn-primary-custom">
          Tambah Admin Baru
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
