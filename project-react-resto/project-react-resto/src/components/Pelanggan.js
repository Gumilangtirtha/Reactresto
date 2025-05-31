import React, { useEffect } from 'react';
import useSkit from '../Hook/useSkit';
import useDelete from '../Hook/useDelete';

const Pelanggan = () => {
  const { data, loading, error, refreshData } = useSkit('/api/get_customers.php');
  const { 
    deleteItem, 
    loading: deleteLoading, 
    error: deleteError, 
    message: deleteMessage,
    resetState: resetDeleteState 
  } = useDelete('/api/delete_customer.php', refreshData);

  const customers = data.data || [];

  // Reset delete messages when component unmounts
  useEffect(() => {
    return () => resetDeleteState();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Daftar Pelanggan</h2>
      
      {/* Success/Error Messages */}
      {deleteMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {deleteMessage}
          <button 
            type="button" 
            className="btn-close" 
            onClick={resetDeleteState}
            aria-label="Close"
          ></button>
        </div>
      )}
      
      {deleteError && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {deleteError}
          <button 
            type="button" 
            className="btn-close" 
            onClick={resetDeleteState}
            aria-label="Close"
          ></button>
        </div>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-light">
                <tr>
                  <th>No</th>
                  <th>Nama Pelanggan</th>
                  <th>Alamat</th>
                  <th>Telepon</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>{index + 1}</td>
                    <td>{customer.nama}</td>
                    <td>
                      <div
                        style={{
                          maxWidth: '200px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={customer.alamat}
                      >
                        {customer.alamat}
                      </div>
                    </td>
                    <td>{customer.telepon}</td>
                    <td>{customer.email}</td>
                    <td>
                      <span 
                        className={`badge ${
                          customer.status === 'active' 
                            ? 'bg-success' 
                            : 'bg-secondary'
                        }`}
                      >
                        {customer.status === 'active' ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteItem(customer.id)}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? (
                          <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        ) : (
                          'Hapus'
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {customers.length === 0 && !error && (
            <div className="text-center p-4">
              <p className="text-muted mb-0">Tidak ada data pelanggan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pelanggan;
