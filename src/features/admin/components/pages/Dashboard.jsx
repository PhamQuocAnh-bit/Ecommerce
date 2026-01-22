import React from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockOrders, mockDishes, mockReviews, mockInventory } from '../../data/mockData';
import { TrendingUp, ShoppingCart, UtensilsCrossed, Star, AlertTriangle, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { data: orders } = useApiData({ endpoint: '/orders', mockData: mockOrders });
  const { data: dishes } = useApiData({ endpoint: '/dishes', mockData: mockDishes });
  const { data: reviews } = useApiData({ endpoint: '/reviews', mockData: mockReviews });
  const { data: inventory } = useApiData({ endpoint: '/inventory', mockData: mockInventory });

  // Tính toán thống kê
  const totalRevenue = orders.reduce((sum, order) => 
    order.status === 'completed' ? sum + order.totalAmount : sum, 0
  );
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const availableDishes = dishes.filter(d => d.status === 'available' && !d.isHidden).length;
  const lowStockItems = inventory.filter(i => i.isLowStock).length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const stats = [
    {
      label: 'Tổng doanh thu',
      value: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalRevenue),
      icon: DollarSign,
      color: 'bg-green-500',
      trend: '+12.5%',
    },
    {
      label: 'Đơn hàng mới',
      value: pendingOrders.toString(),
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: `${totalOrders} tổng`,
    },
    {
      label: 'Món ăn khả dụng',
      value: availableDishes.toString(),
      icon: UtensilsCrossed,
      color: 'bg-orange-500',
      trend: `${dishes.length} tổng`,
    },
    {
      label: 'Đánh giá TB',
      value: averageRating,
      icon: Star,
      color: 'bg-yellow-500',
      trend: `${reviews.length} đánh giá`,
    },
  ];

  const recentOrders = orders.slice(0, 5).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const lowStockAlert = inventory.filter(i => i.isLowStock).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard - Tổng quan</h1>
        <p className="text-sm text-gray-500 mt-1">Thống kê tổng quát cửa hàng đồ ăn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.trend}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Đơn hàng gần đây</h2>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{order.orderId}</p>
                  <p className="text-xs text-gray-500">{order.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.totalAmount)}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status === 'pending' ? 'Chờ' : 
                     order.status === 'processing' ? 'Đang giao' :
                     order.status === 'completed' ? 'Hoàn thành' : order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={20} className="text-red-600" />
            <h2 className="text-lg font-bold text-gray-800">Cảnh báo Tồn kho thấp</h2>
            <span className="ml-auto bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded">
              {lowStockItems} mục
            </span>
          </div>
          <div className="space-y-3">
            {lowStockAlert.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-600">
                    {item.quantity} {item.unit}
                  </p>
                  <p className="text-xs text-gray-500">Tối thiểu: {item.minThreshold} {item.unit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Dishes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Món ăn được đánh giá cao</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dishes
            .filter(d => d.rating >= 4.5)
            .slice(0, 3)
            .map((dish) => (
              <div key={dish.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{dish.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-medium text-gray-700 ml-1">{dish.rating}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dish.price)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
