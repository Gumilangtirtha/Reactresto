import { useState } from 'react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Nasi Goreng Spesial',
      price: 25000,
      quantity: 2,
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Mie Goreng',
      price: 20000,
      quantity: 1,
      image: 'https://via.placeholder.com/150'
    }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Keranjang Belanja</h2>
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">Keranjang belanja Anda kosong</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Keranjang Belanja</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 py-4 border-b last:border-0">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR'
                  }).format(item.price)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => removeItem(item.id)}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-xl font-bold">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR'
              }).format(total)}
            </span>
          </div>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            onClick={() => console.log('Proses pembayaran')}
          >
            Lanjutkan ke Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}