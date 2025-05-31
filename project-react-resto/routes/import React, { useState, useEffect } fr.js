import React, { useState, useEffect } from 'react';
import useSkit from '../Hook/useSkit';
import { formatCurrency } from '../utils/formatters';

const OrderDetail = () => {
  const [tanggalAwal, setTanggalAwal] = useState('');
  const [tanggalAkhir, setTanggalAkhir] = useState('');
  const [url, setUrl] = useState('/api/order-details');
  
  const { data: details, loading, error, refreshData } = useSkit(url);

  // Set initial dates
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    
    setTanggalAwal(formatDate(thirtyDaysAgo));
    setTanggalAkhir(formatDate(today));
  }, []);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tanggalAwal && tanggalAkhir) {
      setUrl(`/api/order-details?start_date=${tanggalAwal}&end_date=${tanggalAkhir}`);
      refreshData();
    }
  };

  return (
    <div className="container mt-4">
      <h2>Detail Penjualan</h2>
      
      {/* Date filter form */}
      <div className="card mb-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Tanggal Awal</label>
                <input
                  type="date"
                  className="form-control"
                  value={tanggalAwal}
                  onChange={(e) => setTanggalAwal(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label">Tanggal Akhir</label>
                <input
                  type="date"
                  className="form-control"
                  value={tanggalAkhir}
                  onChange={(e) => setTanggalAkhir(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button type="submit" className="btn btn-primary">
                  Cari
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Details table */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Menu</th>
              <th>Jumlah</th>
              <th>Harga</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {details && details.map((item, index) => (
              <tr key={item.id_detail}>
                <td>{index + 1}</td>
                <td>{item.tanggal_order}</td>
                <td>{item.menu}</td>
                <td>{item.jumlah}</td>
                <td>{formatCurrency(item.harga_jual)}</td>
                <td>{formatCurrency(item.jumlah * item.harga_jual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
    </div>
  );
};

export default OrderDetail;
