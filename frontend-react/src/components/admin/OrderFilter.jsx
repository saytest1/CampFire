import React, { useState } from 'react';

export default function OrderFilter({ onFilter }) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('ALL');

  const apply = () => {
    onFilter({ from, to, status });
  };

  return (
    <div className="flex space-x-4 items-end mb-4">
      <div>
        <label className="block text-sm">Từ ngày</label>
        <input type="date" value={from} onChange={e => setFrom(e.target.value)}
          className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm">Đến ngày</label>
        <input type="date" value={to} onChange={e => setTo(e.target.value)}
          className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm">Trạng thái</label>
        <select value={status} onChange={e => setStatus(e.target.value)}
          className="mt-1 p-2 border rounded w-full">
          <option value="ALL">Tất cả</option>
          <option value="PENDING">Chưa thanh toán</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="CANCELLED">Hủy</option>
        </select>
      </div>
      <button onClick={apply}
        className="px-4 py-2 bg-blue-600 text-white rounded">Lọc</button>
    </div>
  );
}
