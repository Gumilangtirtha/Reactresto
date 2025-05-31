import axios from 'axios';

// Base URL untuk API
const API_URL = '/api';

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handling response
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle error global di sini
    if (error.response && error.response.status === 401) {
      // Token expired atau tidak valid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service methods
export const apiService = {
  // Get all items
  getAllItems: async () => {
    try {
      const response = await api.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  // Get a single item by ID
  getItemById: async (id) => {
    try {
      const response = await api.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching item with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new item
  createItem: async (data) => {
    try {
      const response = await api.post('/posts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },

  // Update an existing item
  updateItem: async (id, data) => {
    try {
      const response = await api.put(`/posts/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error updating item with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete an item
  deleteItem: async (id) => {
    try {
      const response = await api.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting item with ID ${id}:`, error);
      throw error;
    }
  },

  // Customer-specific methods
  // Add a new customer (POST)
  addCustomer: async (customerData) => {
    try {
      // Use our local PHP API endpoint
      const response = await axios.post('http://localhost/project-react-resto/api/add_customer.php', customerData);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    }
  },

  // Get all customers (GET)
  getAllCustomers: async () => {
    try {
      const response = await axios.get('http://localhost/project-react-resto/api/get_customers.php');
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  // Get a single customer by ID (SHOW)
  getCustomerById: async (id) => {
    try {
      const response = await axios.get(`http://localhost/project-react-resto/api/show_customer.php?id=${id}`);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with ID ${id}:`, error);
      throw error;
    }
  },

  // Update a customer (UPDATE)
  updateCustomer: async (customerData) => {
    try {
      const response = await axios.put('http://localhost/project-react-resto/api/update_customer.php', customerData);
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  },

  // Delete a customer (DELETE)
  deleteCustomer: async (id) => {
    try {
      const response = await axios.delete('http://localhost/project-react-resto/api/delete_customer.php', {
        data: { id }
      });
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error deleting customer with ID ${id}:`, error);
      throw error;
    }
  }
};

// Service untuk autentikasi
export const authService = {
  login: async (credentials) => {
    try {
      console.log('Logging in with credentials:', credentials);
      console.log('API URL:', `${API_URL}/login.php`);

      // Pastikan data yang dikirim sudah benar
      const dataToSend = {
        username: credentials.username,
        password: credentials.password
      };

      console.log('Data yang akan dikirim:', dataToSend);

      // Set header Content-Type
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Panggil API login
      const response = await axios.post(`${API_URL}/login.php`, dataToSend, config);

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Simpan token dan user data ke localStorage
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));

        return {
          success: true,
          user: response.data.data.user,
          token: response.data.data.token
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Username atau password salah'
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error details:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Login gagal. Silakan coba lagi.'
      };
    }
  },

  register: async (userData) => {
    try {
      console.log('Registering user with data:', userData);
      console.log('API URL:', `${API_URL}/register.php`);

      // Pastikan data yang dikirim sudah benar
      const dataToSend = {
        name: userData.name,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: 'user' // Selalu set role ke 'user' untuk keamanan
      };

      console.log('Data yang akan dikirim:', dataToSend);

      // Set header Content-Type
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      // Panggil API register
      const response = await axios.post(`${API_URL}/register.php`, dataToSend, config);

      console.log('Registration response:', response.data);

      if (response.data.success) {
        return {
          success: true,
          user: response.data.data
        };
      } else {
        return {
          success: false,
          error: response.data.message || 'Pendaftaran gagal'
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error details:', error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || 'Pendaftaran gagal. Silakan coba lagi.'
      };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getUsers: async () => {
    try {
      // Panggil API untuk mendapatkan daftar pengguna
      const response = await axios.get(`${API_URL}/users.php`);

      if (response.data.success) {
        return response.data.data;
      } else {
        console.error('Get users failed:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Get users failed:', error);
      return [];
    }
  }
};

// Service khusus untuk kategori
export const kategoriService = {
  // Mendapatkan semua kategori
  getAllKategori: async () => {
    try {
      // Pastikan endpoint sesuai dengan backend PHP Anda
      const response = await axios.get(`${API_URL}/get_kategori.php`);
      // Jika backend Anda mengembalikan data dalam bentuk { success: true, data: [...] }
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Gagal mengambil data kategori');
      }
    } catch (error) {
      console.error('Error fetching kategori:', error);
      throw error;
    }
  },
  
  // Mendapatkan kategori berdasarkan ID
  getKategoriById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get_kategori_by_id.php?id=${id}`);
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || `Gagal mengambil kategori dengan ID ${id}`);
      }
    } catch (error) {
      console.error(`Error fetching kategori with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Menambahkan kategori baru
  addKategori: async (kategoriData) => {
    try {
      const response = await axios.post(`${API_URL}/add_kategori.php`, kategoriData);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Gagal menambahkan kategori');
      }
    } catch (error) {
      console.error('Error adding kategori:', error);
      throw error;
    }
  },
  
  // Mengupdate kategori
  updateKategori: async (kategoriData) => {
    try {
      const response = await axios.put(`${API_URL}/update_kategori.php`, kategoriData);
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Gagal mengupdate kategori');
      }
    } catch (error) {
      console.error('Error updating kategori:', error);
      throw error;
    }
  },
  
  // Menghapus kategori
  deleteKategori: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete_kategori.php`, {
        data: { id }
      });
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Gagal menghapus kategori');
      }
    } catch (error) {
      console.error(`Error deleting kategori with ID ${id}:`, error);
      throw error;
    }
  }
};


export default apiService;
