import React, { useEffect, useState } from 'react';

function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(saved);
  }, []);

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Lịch sử đơn hàng</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4 bg-white shadow">
            <h2 className="font-semibold text-lg">Đơn #{order.id}</h2>
            <p className="text-sm text-gray-600 mb-2">
              Ngày: {new Date(order.date).toLocaleDateString()}
            </p>
            <ul className="divide-y">
              {order.items.map(item => (
                <li key={item.id} className="py-2 flex justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${(item.quantity * item.price).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-4 text-right">
              <span className="text-lg font-bold">
                Tổng: ${order.items.reduce((sum, i) => sum + i.quantity * i.price, 0).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrderHistory;
