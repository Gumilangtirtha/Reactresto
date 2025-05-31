import React, { useState, useEffect } from 'react';

const MenuPage = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("/api/get_menu.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setMenus(data.data);
          // Ambil kategori unik dari data menu
          const uniqueCategories = [
            { id: 'all', name: 'Semua Menu' },
            ...Array.from(new Set(data.data.map(item => item.kategori_id))).map(id => {
              const item = data.data.find(menu => menu.kategori_id === id);
              return { id, name: item ? item.kategori_nama || `Kategori ${id}` : `Kategori ${id}` };
            })
          ];
          setCategories(uniqueCategories);
        } else {
          setError(data.message || "Gagal mengambil data menu");
        }
      })
      .catch((err) => {
        setError("Gagal mengambil data menu: " + err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredMenus = activeCategory === 'all'
    ? menus
    : menus.filter(menu => menu.kategori_id === activeCategory);

  if (loading) {
    return <div className="text-center mt-5"><span>Loading...</span></div>;
  }
  if (error) {
    return <div className="alert alert-danger mt-4">{error}</div>;
  }

  const dishes = [
    {
      id: 1,
      title: 'Nasi Goreng Spesial',
      category: 'main',
      price: 'Rp 45.000',
      image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3',
      description: 'Nasi goreng dengan telur, ayam, udang, dan sayuran segar',
      rating: 4.8,
      badge: 'Populer'
    },
    {
      id: 2,
      title: 'Sate Ayam',
      category: 'main',
      price: 'Rp 35.000',
      image: 'https://images.unsplash.com/photo-1529563021893-cc83c992d75d?ixlib=rb-4.0.3',
      description: 'Sate ayam dengan bumbu kacang khas Indonesia',
      rating: 4.7
    },
    {
      id: 3,
      title: 'Es Teh Manis',
      category: 'drinks',
      price: 'Rp 10.000',
      image: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?ixlib=rb-4.0.3',
      description: 'Teh manis segar dengan es batu',
      rating: 4.5
    }
  ];

  const filteredDishes = activeCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.category === activeCategory);

  return (
    <div className="p-4">
      <div className="menu-section">
        <div className="text-center mb-5">
          <h2 className="menu-title">Menu Restoran</h2>
        </div>

        {/* Menu Categories */}
        <div className="text-center mb-4">
          {categories.map(category => (
            <button
              key={category.id}
              className={`btn-custom mx-1 ${activeCategory === category.id ? 'btn-primary-custom' : 'btn-outline-custom'}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Dish Cards */}
        <div className="row">
          {filteredMenus.map(menu => (
            <div className="col-md-4" key={menu.id}>
              <div className="dish-card">
                <div className="dish-image-container">
                  <img src={menu.image} alt={menu.nama} className="dish-image" />
                  {menu.badge && (
                    <div className="dish-badge">{menu.badge}</div>
                  )}
                </div>
                <div className="dish-content">
                  <h3 className="dish-title">{menu.nama}</h3>
                  <p className="dish-description">{menu.deskripsi}</p>
                  <div className="dish-meta">
                    <div className="dish-price">{menu.harga}</div>
                    <div className="dish-rating">
                      <div className="dish-rating-stars">★★★★★</div>
                      <span>{menu.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
