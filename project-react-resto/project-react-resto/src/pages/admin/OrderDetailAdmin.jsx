import React from 'react';

const OrderDetailAdmin = () => {
  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Manajemen Detail Order</h2>
        <p className="mb-4">
          Kelola detail pesanan dari pelanggan di sini.
        </p>
        <button className="btn-custom btn-primary-custom">
          Tambah Detail Order Baru
        </button>
        
        <div className="mt-4">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>ID</th>
                <th>Order ID</th>
                <th>Menu</th>
                <th>Jumlah</th>
                <th>Harga</th>
                <th>Subtotal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>1</td>
                <td>Nasi Goreng Spesial</td>
                <td>2</td>
                <td>Rp 45.000</td>
                <td>Rp 90.000</td>
                <td>
                  <button className="btn btn-sm btn-info me-2">Edit</button>
                  <button className="btn btn-sm btn-danger">Hapus</button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>1</td>
                <td>Es Teh Manis</td>
                <td>2</td>
                <td>Rp 10.000</td>
                <td>Rp 20.000</td>
                <td>
                  <button className="btn btn-sm btn-info me-2">Edit</button>
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

export default OrderDetailAdmin;
