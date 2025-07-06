import React, { useEffect, useState } from 'react';
import OrderFilter from './OrderFilter';
import OrderSearchSort from './OrderSearchSort';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filterParams, setFilterParams] = useState({});
  const [searchSortParams, setSearchSortParams] = useState({});

  useEffect(() => {
    // TODO: call API với filterParams & searchSortParams
    // fetchOrders(filterParams, searchSortParams).then(setOrders)
  }, [filterParams, searchSortParams]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Danh sách đơn hàng</h1>
      <OrderFilter onFilter={setFilterParams} />
      <OrderSearchSort onSearchSort={setSearchSortParams} />

      <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Mã đơn</th>
            <th className="p-2">Khách</th>
            <th className="p-2">Trạng thái</th>
            <th className="p-2">Ngày tạo</th>
            <th className="p-2">Tổng</th>
            <th className="p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-t">
              <td className="p-2">{o.id}</td>
              <td className="p-2">{o.customerName}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">{new Date(o.createdAt).toLocaleDateString()}</td>
              <td className="p-2">{o.total}</td>
              <td className="p-2 space-x-2">
                <button className="px-2 py-1 bg-blue-500 text-white rounded">Chi tiết</button>
                <button className="px-2 py-1 bg-green-500 text-white rounded">Sửa</button>
                <button className="px-2 py-1 bg-red-500 text-white rounded">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* TODO: Pagination component */}
    </div>
  );
}
