import React, { useState } from 'react';

export default function CreateOrder({ onCreate }) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [items, setItems] = useState([{ productId: '', name: '', quantity: 1, price: 0 }]);

  const addItem = () => setItems([...items, { productId: '', name: '', quantity: 1, price: 0 }]);
  const updateItem = (idx, key, value) => {
    const arr = [...items]; arr[idx][key] = value; setItems(arr);
  };

  const submit = () => {
    onCreate({ customerName, customerPhone, items });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Tạo đơn hàng thủ công</h1>

      <div className="space-y-2">
        <input type="text" placeholder="Tên khách" value={customerName}
          onChange={e => setCustomerName(e.target.value)}
          className="w-full p-2 border rounded" />
        <input type="text" placeholder="Số điện thoại" value={customerPhone}
          onChange={e => setCustomerPhone(e.target.value)}
          className="w-full p-2 border rounded" />
      </div>

      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Sản phẩm</th>
            <th className="p-2">Tên</th>
            <th className="p-2">Số lượng</th>
            <th className="p-2">Giá</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">
                <input type="text" value={it.productId}
                  onChange={e => updateItem(i, 'productId', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="p-2">
                <input type="text" value={it.name}
                  onChange={e => updateItem(i, 'name', e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="p-2">
                <input type="number" min="1" value={it.quantity}
                  onChange={e => updateItem(i, 'quantity', +e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
              <td className="p-2">
                <input type="number" min="0" value={it.price}
                  onChange={e => updateItem(i, 'price', +e.target.value)}
                  className="w-full p-1 border rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addItem} className="px-4 py-2 bg-gray-500 text-white rounded">
        Thêm dòng
      </button>
      <button onClick={submit} className="px-4 py-2 bg-blue-600 text-white rounded">
        Tạo đơn
      </button>
    </div>
  );
}
