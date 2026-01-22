import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  FolderTree,
  UtensilsCrossed,
  Ticket,
  Users,
  Star,
  Package
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'orders', label: 'Quản lý Đơn hàng', icon: ShoppingCart },
    { id: 'categories', label: 'Danh mục Đồ ăn', icon: FolderTree },
    { id: 'dishes', label: 'Quản lý Món ăn', icon: UtensilsCrossed },
    { id: 'promotions', label: 'Khuyến mãi', icon: Ticket },
    { id: 'staff', label: 'Nhân viên', icon: Users },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
    { id: 'inventory', label: 'Quản lý Kho', icon: Package },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <h1 className="font-bold text-xl text-orange-600">Admin Dashboard</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-left transition-colors ${activeTab === item.id
                ? 'bg-orange-50 text-orange-600 border-r-4 border-orange-600'
                : 'text-gray-700 hover:bg-gray-50'
                }`}
            >
              <Icon size={20} />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
