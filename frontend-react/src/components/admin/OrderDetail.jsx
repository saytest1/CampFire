import React, { useEffect, useState } from 'react';

export default function OrderDetail({ orderId, onUpdate, onDeleteItem, onAddItem }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // TODO: fetch detail by orderId
  }, [orderId]);

  if (!order) return <p>Đang tải...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Chi tiết đơn hàng #{order.id}</h1>
      <div className="space-y-2">
        <p><strong>Khách:</strong> {order.customerName} – {order.customerPhone}</p>
        <p><strong>Trạng thái:</strong> {order.status}</p>
        <p><strong>Tổng:</strong> {order.total}</p>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Tên</th>
            <th className="p-2">Số lượng</th>
            <th className="p-2">Giá</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map(it => (
            <tr key={it.id} className="border-t">
              <td className="p-2">{it.name}</td>
              <td className="p-2">
                <input type="number" value={it.quantity}
                  onChange={e => onUpdate(order.id, it.id, { quantity: +e.target.value })}
                  className="w-20 p-1 border rounded" />
              </td>
              <td className="p-2">
                <input type="number" value={it.price}
                  onChange={e => onUpdate(order.id, it.id, { price: +e.target.value })}
                  className="w-24 p-1 border rounded" />
              </td>
              <td className="p-2">
                <button onClick={() => onDeleteItem(order.id, it.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded">
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => onAddItem(order.id)} className="px-4 py-2 bg-gray-500 text-white rounded">
        Thêm dòng
      </button>
    </div>
  );
}
