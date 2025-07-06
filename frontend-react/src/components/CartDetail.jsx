import React, { useEffect, useState } from 'react';

function CartDetail() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cart') || '[]');
    setItems(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const updateQty = (id, qty) => {
    setItems(items.map(i => i.id === id ? { ...i, quantity: Math.max(1, qty) } : i));
  };

  const remove = id => {
    setItems(items.filter(i => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h1>
      <ul className="divide-y">
        {items.map(item => (
          <li key={item.id} className="flex items-center py-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1 ml-4">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">${item.price.toFixed(2)} mỗi chiếc</p>
              <div className="mt-2 flex items-center space-x-2">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  –
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateQty(item.id, parseInt(e.target.value) || 1)}
                  className="w-12 text-center border rounded"
                  min="1"
                />
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">
                ${(item.quantity * item.price).toFixed(2)}
              </p>
              <button
                onClick={() => remove(item.id)}
                className="mt-2 text-red-600 hover:underline"
              >
                Xóa
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 text-right">
        <span className="text-xl font-bold">Tổng đơn: ${total.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default CartDetail;