import React, { useState, useEffect } from 'react';

const PelangganPage = () => {
  const [pelanggan, setPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/get_pelanggan.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPelanggan(data.data);
        } else {
          setError(data.message || "Gagal mengambil data pelanggan");
        }
      })
      .catch((err) => {
        setError("Gagal mengambil data pelanggan: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-5"><span>Loading...</span></div>;
  }
  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="content-card">
        <h2 className="mb-4">Data Pelanggan</h2>
        <p className="mb-4">
          Kelola data pelanggan restoran Anda di sini.
        </p>
        <button className="btn-custom btn-primary-custom">Tambah Pelanggan Baru</button>
        <div className="mt-4">
          {pelanggan.length === 0 ? (
            <div>Tidak ada data pelanggan.</div>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>Telepon</th>
                </tr>
              </thead>
              <tbody>
                {pelanggan.map((item, idx) => (
                  <tr key={item.id}>
                    <td>{idx + 1}</td>
                    <td>{item.nama}</td>
                    <td>{item.email}</td>
                    <td>{item.telepon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PelangganPage;
