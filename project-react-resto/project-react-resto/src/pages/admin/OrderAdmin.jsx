import React from 'react';

const OrderAdmin = () => {
  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Manajemen Order</h2>
        <p className="mb-4">
          Kelola pesanan dari pelanggan di sini.
        </p>
        <button className="btn-custom btn-primary-custom">
          Tambah Order Baru
        </button>
        
        <div className="mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Pelanggan</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Budi Santoso</td>
                <td>2023-06-15 14:30</td>
                <td>Rp 150.000</td>
                <td><span className="badge bg-success">Selesai</span></td>
                <td>
                  <button className="btn btn-sm btn-info me-2">Detail</button>
                  <button className="btn btn-sm btn-danger">Hapus</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>Siti Rahayu</td>
                <td>2023-06-15 15:45</td>
                <td>Rp 85.000</td>
                <td><span className="badge bg-warning text-dark">Diproses</span></td>
                <td>
                  <button className="btn btn-sm btn-info me-2">Detail</button>
                  <button className="btn btn-sm btn-danger">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderAdmin;
