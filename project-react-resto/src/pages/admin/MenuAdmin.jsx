import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import useSkit from '../../Hook/useSkit';
import useDelete from '../../Hook/useDelete';
import { formatCurrency } from '../../utils/formatters';
import axios from 'axios';

const MenuAdmin = () => {
  // Form management with react-hook-form
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
  
  // States for form and data management
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: '', content: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

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

  // Handle edit button click
  const handleEdit = async (id) => {
    try {
      setFormMessage({ type: '', content: '' }); // Clear any existing messages
      
      const response = await axios.get(`/api/get_menu_by_id.php?id=${id}`);
      
      if (response.data.success) {
        const menuData = response.data.data;
        
        // Set form values
        setValue('menu', menuData.menu);
        setValue('harga', menuData.harga);
        setValue('id_kategori', menuData.id_kategori);
        setValue('deskripsi', menuData.deskripsi);
        
        // Set image preview if exists, using the full URL
        if (menuData.gambar) {
          setImagePreview(menuData.gambar_url);
        } else {
          setImagePreview(null);
        }
        
        setSelectedImage(null); // Reset selected image since we're loading an existing one
        
        // Set editing state
        setEditingId(id);
        setShowForm(true);
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        throw new Error(response.data.message || 'Gagal mengambil data menu');
      }
    } catch (err) {
      setFormMessage({
        type: 'error',
        content: err.message || 'Terjadi kesalahan saat mengambil data menu'
      });
    }
  };

  // Handle form reset and cleanup
  const handleFormReset = () => {
    // Reset react-hook-form
    reset({
      menu: '',
      harga: '',
      id_kategori: '',
      deskripsi: ''
    });
    
    // Clean up image preview
    if (imagePreview && !imagePreview.includes('http')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSelectedImage(null);
    
    // Reset edit mode
    setEditingId(null);
    
    // Close form if it was open
    setShowForm(false);
    
    // Clear any messages
    setFormMessage({ type: '', content: '' });
  };

  // Cleanup on component unmount
  React.useEffect(() => {
    return () => {
      // Cleanup any object URLs to prevent memory leaks
      if (imagePreview && !imagePreview.includes('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Reset form message after 5 seconds
  React.useEffect(() => {
    if (formMessage.content) {
      const timer = setTimeout(() => {
        setFormMessage({ type: '', content: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [formMessage]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setFormMessage({
          type: 'error',
          content: 'Format file tidak didukung. Gunakan JPG, PNG, atau GIF'
        });
        e.target.value = ''; // Reset file input
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setFormMessage({
          type: 'error',
          content: 'Ukuran file terlalu besar. Maksimal 2MB'
        });
        e.target.value = ''; // Reset file input
        return;
      }
      
      setSelectedImage(file);
      
      // Revoke previous preview URL if it's not from server
      if (imagePreview && !imagePreview.includes('http')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // Clear any error messages
      setFormMessage({ type: '', content: '' });
    }
  };

  // Handle form submission (create or update)
  const onSubmit = async (formData) => {
    try {
      // Validate price is a positive number
      const harga = parseFloat(formData.harga);
      if (isNaN(harga) || harga <= 0) {
        setFormMessage({
          type: 'error',
          content: 'Harga harus berupa angka positif'
        });
        return;
      }

      const submitData = new FormData();
      submitData.append('menu', formData.menu);
      submitData.append('harga', harga);
      submitData.append('id_kategori', formData.id_kategori);
      submitData.append('deskripsi', formData.deskripsi);
      
      // Handle image upload
      if (selectedImage) {
        submitData.append('gambar', selectedImage);
      }

      // If editing, add menu ID
      const endpoint = editingId ? '/api/update_menu.php' : '/api/add_menu.php';
      if (editingId) {
        submitData.append('id', editingId);
      }

      const response = await axios.post(endpoint, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setFormMessage({
          type: 'success',
          content: `Menu berhasil ${editingId ? 'diperbarui' : 'ditambahkan'}!`
        });

        // Reset form and states
        handleFormReset();
        
        // Refresh the menu list
        refreshData();
      } else {
        throw new Error(response.data.message || `Gagal ${editingId ? 'memperbarui' : 'menambahkan'} menu`);
      }
    } catch (err) {
      setFormMessage({
        type: 'error',
        content: err.message || 'Terjadi kesalahan saat menyimpan menu'
      });
    }
  };

  if (loading || categoriesLoading) {
    return (
      <div className="p-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="content-card">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Manajemen Menu</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (showForm) {
                handleFormReset();
              } else {
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Tutup Form' : 'Tambah Menu'}
          </button>
        </div>

        {/* Messages */}
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

        {/* Form */}
        {showForm && (
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">
                {editingId ? 'Edit Menu' : 'Tambah Menu Baru'}
              </h5>
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
                      className="form-control mb-2"
                      id="gambar"
                      accept="image/jpeg,image/png,image/gif"
                      onChange={handleImageChange}
                    />
                    <small className="text-muted d-block mb-2">
                      Format yang didukung: JPG, PNG, GIF. Maksimal 2MB.
                    </small>
                    {imagePreview && (
                      <div className="mt-2 position-relative" style={{ maxWidth: '150px' }}>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-thumbnail"
                          style={{
                            width: '100%',
                            height: 'auto'
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-danger position-absolute top-0 end-0"
                          onClick={() => {
                            if (!imagePreview.includes('http')) {
                              URL.revokeObjectURL(imagePreview);
                            }
                            setImagePreview(null);
                            setSelectedImage(null);
                          }}
                          style={{ margin: '4px' }}
                        >
                          ×
                        </button>
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

                <div className="mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary me-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Menyimpan...
                      </>
                    ) : (
                      editingId ? 'Update Menu' : 'Simpan Menu'
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleFormReset}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Menu List */}
        <div className="table-responsive mt-4">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Gambar</th>
                <th>Nama Menu</th>
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
                        src={item.gambar_url || `/uploads/${item.gambar}`}
                        alt={item.menu}
                        style={{
                          width: '60px',
                          height: '60px',
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }}
                      />
                    ) : (
                      <div
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
                  <td>{item.kategori_nama}</td>
                  <td>
                    <div
                      style={{
                        maxWidth: '200px',
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
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEdit(item.id_menu)}
                    >
                      Ubah
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteItem(item.id_menu)}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        'Hapus'
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {menus.length === 0 && !error && (
            <div className="text-center p-4">
              <p className="text-muted mb-0">Tidak ada menu yang tersedia.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuAdmin;
