import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [confirm, setConfirm] = useState('');

  useEffect(() => {
    // Giả sử bạn fetch từ API hoặc mock data
    // Đây là ví dụ tĩnh
    const mock = {
      id: id,
      name: 'Sample Product',
      image: 'https://via.placeholder.com/300',
      price: 29.99,
      description: 'Mô tả sản phẩm mẫu.'
    };
    setProduct(mock);
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const exists = cart.find(i => i.id === product.id);
    if (exists) {
      exists.quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setConfirm(`Đã thêm ${qty} x "${product.name}" vào giỏ hàng.`);
    setTimeout(() => setConfirm(''), 3000);
  };

  if (!product) return null;

  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]')
    .reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">
          ← Quay lại
        </button>
        <Link to="/cart" className="relative">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 3h2l.344 2M7 13h10l4-8H5.344M7 13L5.344 5M7 13l-2 9m12-9l2 9M5 22h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      <img src={product.image} alt={product.name} className="w-full h-64 object-cover rounded" />
      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>
      <p className="text-gray-700 mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-2">${product.price.toFixed(2)}</p>

      <div className="mt-4 flex items-center space-x-2">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          –
        </button>
        <input
          type="number"
          value={qty}
          onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
          className="w-16 text-center border rounded"
          min="1"
        />
        <button
          onClick={() => setQty(q => q + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={addToCart}
        className="mt-6 w-full bg-green-600 text-white font-medium rounded py-3 hover:bg-green-700 transition"
      >
        Thêm vào giỏ hàng
      </button>

      {confirm && (
        <div className="mt-4 text-center text-green-700">
          {confirm}
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
