import React, { useState } from 'react';

export default function OrderSearchSort({ onSearchSort }) {
  const [search, setSearch] = useState('');
  const [sortDesc, setSortDesc] = useState(true);

  const apply = () => {
    onSearchSort({ search, sortDesc });
  };

  return (
    <div className="flex space-x-4 items-end mb-4">
      <div className="flex-1">
        <label className="block text-sm">Tìm kiếm (sđt/tên)</label>
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Nhập số điện thoại hoặc tên"
          className="mt-1 p-2 border rounded w-full" />
      </div>
      <div>
        <label className="block text-sm">Mới nhất trước</label>
        <select value={sortDesc ? 'DESC' : 'ASC'}
          onChange={e => setSortDesc(e.target.value === 'DESC')}
          className="mt-1 p-2 border rounded">
          <option value="DESC">Giảm dần</option>
          <option value="ASC">Tăng dần</option>
        </select>
      </div>
      <button onClick={apply}
        className="px-4 py-2 bg-green-600 text-white rounded">Áp dụng</button>
    </div>
  );
}
