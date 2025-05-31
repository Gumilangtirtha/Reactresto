import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Menu() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await axios.get('https://api.example.com/menus'); // Ganti dengan URL API yang sebenarnya
        setMenus(response.data);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data menu');
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Sementara menggunakan data statis untuk testing
  const dummyMenus = [
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      description: 'Nasi goreng dengan telur, ayam, dan sayuran',
      price: 25000,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Mie Goreng',
      description: 'Mie goreng dengan telur dan sayuran',
      price: 20000,
      image: 'https://via.placeholder.com/150'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Menu Kami</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyMenus.map((menu) => (
          <div key={menu.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={menu.image}
              alt={menu.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{menu.name}</h3>
              <p className="text-gray-600 mt-2">{menu.description}</p>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(menu.price)}
                </span>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  onClick={() => console.log('Tambah ke keranjang:', menu.id)}
                >
                  Tambah
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}