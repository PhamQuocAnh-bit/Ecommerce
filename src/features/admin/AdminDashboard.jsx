import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './components/pages/Dashboard';
import OrderManagement from './components/pages/OrderManagement';
// Import các pages khác khi đã copy xong
import CategoryManagement from './components/pages/CategoryManagement';
import DishManagement from './components/pages/DishManagement';
import PromotionManagement from './components/pages/PromotionManagement';
import StaffManagement from './components/pages/StaffManagement';
import ReviewManagement from './components/pages/ReviewManagement';
import InventoryManagement from './components/pages/InventoryManagement';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'orders':
        return <OrderManagement />;
    //   Uncomment khi đã có components
      case 'categories':
        return <CategoryManagement />;
      case 'dishes':
        return <DishManagement />;
      case 'promotions':
        return <PromotionManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'inventory':
        return <InventoryManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
