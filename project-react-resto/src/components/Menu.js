import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import useSkit from '../Hook/useSkit';
import useDelete from '../Hook/useDelete';
import { formatCurrency } from '../utils/formatters';

const Menu = () => {
  // Form management with react-hook-form
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  // States for form and data management
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch menu data and categories using useSkit
  const { 
    data, 
    loading, 
    error, 
    refreshData 
  } = useSkit('/api/get_menu.php');
  const { 
    data: categoriesData, 
    loading: categoriesLoading 
  } = useSkit('/api/get_kategori.php');

  // Delete functionality
  const { 
    deleteItem, 
    loading: deleteLoading, 
    error: deleteError, 
    message: deleteMessage,
    resetState: resetDeleteState 
  } = useDelete('/api/delete_menu.php', refreshData);

  const menus = data.data || [];
  const categories = categoriesData.data || [];

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
      const submitData = new FormData();
      submitData.append('menu', formData.menu);
      submitData.append('harga', formData.harga);
      submitData.append('id_kategori', formData.id_kategori);
      submitData.append('deskripsi', formData.deskripsi);
      
      if (selectedImage) {
        submitData.append('gambar', selectedImage);
      }

      const response = await axios.post('/api/add_menu.php', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormMessage({
          type: 'success',
          content: 'Menu berhasil ditambahkan!'
        });
        reset(); // Reset form
        setSelectedImage(null);
        setImagePreview(null);
        setRefreshTrigger(prev => prev + 1);
        refreshData(); // Refresh menu list
      } else {
        throw new Error(response.data.message || 'Gagal menambahkan menu');
      }
    } catch (err) {
      setFormMessage({
        type: 'error',
        content: err.message || 'Terjadi kesalahan saat menambahkan menu'
      });
    }
  };

  // Reset form message after 5 seconds
  useEffect(() => {
    if (formMessage.content) {
      const timer = setTimeout(() => {
        setFormMessage({ type: '', content: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  // Reset delete messages when component unmounts
  useEffect(() => {
    return () => resetDeleteState();
  }, []);

  // Loading state
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Daftar Menu</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Tutup Form' : 'Tambah Menu'}
        </button>
      </div>

      {/* Form Messages */}
      {formMessage.content && (
        <div className={`alert alert-${formMessage.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`} role="alert">
          {formMessage.content}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setFormMessage({ type: '', content: '' })}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Delete Messages */}
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

      {/* Add Menu Form */}
      {showForm && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title mb-4">Tambah Menu Baru</h5>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="menu" className="form-label">Nama Menu</label>
                  <input
                    type="text"
                    className={`form-control ${errors.menu ? 'is-invalid' : ''}`}
                    id="menu"
                    {...register('menu', { required: 'Nama menu harus diisi' })}
                  />
                  {errors.menu && <div className="invalid-feedback">{errors.menu.message}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="harga" className="form-label">Harga</label>
                  <input
                    type="number"
                    className={`form-control ${errors.harga ? 'is-invalid' : ''}`}
                    id="harga"
                    {...register('harga', { required: 'Harga harus diisi' })}
                  />
                  {errors.harga && <div className="invalid-feedback">{errors.harga.message}</div>}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="id_kategori" className="form-label">Kategori</label>
                  <select
                    className={`form-select ${errors.id_kategori ? 'is-invalid' : ''}`}
                    id="id_kategori"
                    {...register('id_kategori', { required: 'Kategori harus dipilih' })}
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.nama}
                      </option>
                    ))}
                  </select>
                  {errors.id_kategori && <div className="invalid-feedback">{errors.id_kategori.message}</div>}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="gambar" className="form-label">Gambar Menu</label>
                  <input
                    type="file"
                    className="form-control"
                    id="gambar"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          maxWidth: '100px',
                          height: 'auto'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="deskripsi" className="form-label">Deskripsi</label>
                <textarea
                  className={`form-control ${errors.deskripsi ? 'is-invalid' : ''}`}
                  id="deskripsi"
                  rows="3"
                  {...register('deskripsi', { required: 'Deskripsi harus diisi' })}
                ></textarea>
                {errors.deskripsi && <div className="invalid-feedback">{errors.deskripsi.message}</div>}
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || categoriesLoading}
              >
                {loading || categoriesLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Menyimpan...
                  </>
                ) : (
                  'Simpan Menu'
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Menu List Table */}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>No</th>
              <th>Gambar</th>
              <th>Menu</th>
              <th>Kategori</th>
              <th>Deskripsi</th>
              <th>Harga</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {menus.map((item, index) => (
              <tr key={item.id_menu}>
                <td>{index + 1}</td>
                <td>
                  {item.gambar ? (
                    <img
                      src={item.gambar}
                      alt={item.menu}
                      className="menu-thumbnail"
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                  ) : (
                    <div
                      className="menu-thumbnail-placeholder"
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span className="text-muted small">No image</span>
                    </div>
                  )}
                </td>
                <td>{item.menu}</td>
                <td>{item.kategori}</td>
                <td>
                  <div
                    style={{
                      maxWidth: '300px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={item.deskripsi}
                  >
                    {item.deskripsi}
                  </div>
                </td>
                <td>{formatCurrency(item.harga)}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteItem(item.id_menu)}
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

      {menus.length === 0 && !error && (
        <div className="text-center mt-4 p-4 bg-light rounded">
          <p className="mb-0">Tidak ada menu yang tersedia.</p>
        </div>
      )}
    </div>
  );
};

export default Menu;
