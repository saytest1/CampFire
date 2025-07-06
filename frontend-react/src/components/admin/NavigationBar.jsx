import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';

export default function NavigationBar({ children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex h-screen">
      <aside className={`bg-gray-800 text-white transition-all duration-300 ${open ? 'w-64' : 'w-16'}`}>
        <div className="flex items-center justify-between p-4">
          {open && <span className="text-xl font-bold">Admin</span>}
          <button onClick={() => setOpen(!open)}>
            <FaBars />
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">Dashboard</li>
            <li className="p-2 hover:bg-gray-700 cursor-pointer">Đơn hàng</li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
