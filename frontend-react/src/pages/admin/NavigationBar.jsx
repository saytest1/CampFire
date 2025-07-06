import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: '🏠' },
  { name: 'Products', path: '/admin/products', icon: '📦' },
  { name: 'Categories', path: '/admin/categories', icon: '🗂️' },
  { name: 'Orders', path: '/admin/orders', icon: '📝' },
];

export default function NavigationBar() {
  const location = useLocation();
  return (
    <aside className="h-screen w-64 bg-white border-r shadow-lg flex flex-col sticky top-0 z-30">
      <div className="px-6 py-8 flex items-center justify-center border-b">
        <span className="text-2xl font-bold text-blue-700 tracking-tight">CampFire Admin</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map(item => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center px-4 py-3 rounded-lg text-lg font-medium transition-colors duration-200 ${location.pathname.startsWith(item.path)
              ? 'bg-blue-100 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="mr-3 text-xl">{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="px-6 py-4 border-t flex items-center justify-between">
        <span className="text-sm text-gray-500">&copy; 2024 CampFire</span>
      </div>
    </aside>
  );
}
