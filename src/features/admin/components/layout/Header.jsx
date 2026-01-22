import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Header = ({ toggleSidebar, sidebarOpen }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={20} className="text-gray-700" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800">
          Quản lý Cửa hàng Đồ ăn
        </h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
          <Bell size={20} className="text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <User size={20} className="text-gray-700" />
          <span className="text-sm text-gray-700">Admin</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
