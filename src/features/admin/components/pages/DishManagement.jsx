import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockDishes, mockCategories } from '../../data/mockData';
import { Search, Filter, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import DishModal from '../modals/DishModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const DishManagement = () => {
  const { data: dishes, setData: setDishes, loading, isUsingMockData } = useApiData({
    endpoint: '/dishes',
    mockData: mockDishes,
  });

  const { data: categories } = useApiData({
    endpoint: '/categories',
    mockData: mockCategories,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDishId, setDeleteDishId] = useState(null);

  const filteredDishes = dishes.filter(dish => {
    const matchSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = categoryFilter === 'all' || dish.categoryId === categoryFilter;
    const matchStatus = statusFilter === 'all' ||
      (statusFilter === 'available' && dish.status === 'available' && !dish.isHidden) ||
      (statusFilter === 'out_of_stock' && dish.status === 'out_of_stock') ||
      (statusFilter === 'hidden' && dish.isHidden);

    return matchSearch && matchCategory && matchStatus;
  });

  const handleToggleVisibility = (dishId) => {
    setDishes(prevDishes =>
      prevDishes.map(dish =>
        dish.id === dishId ? { ...dish, isHidden: !dish.isHidden } : dish
      )
    );
  };

  const handleAddDish = () => {
    setSelectedDish(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleViewDish = (dish) => {
    setSelectedDish(dish);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditDish = (dish) => {
    setSelectedDish(dish);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteDish = (dishId) => {
    setDeleteDishId(dishId);
  };

  const confirmDelete = () => {
    if (deleteDishId) {
      setDishes(prevDishes => prevDishes.filter(d => d.id !== deleteDishId));
      setDeleteDishId(null);
    }
  };

  const handleSaveDish = (dish) => {
    if (modalMode === 'add') {
      setDishes(prevDishes => [...prevDishes, dish]);
    } else if (modalMode === 'edit') {
      setDishes(prevDishes =>
        prevDishes.map(d => (d.id === dish.id ? dish : d))
      );
    }
    setIsModalOpen(false);
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Đang tải dữ liệu...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Món ăn</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">Đang dùng mock data</span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddDish}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm món ăn
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="available">Còn món</option>
            <option value="out_of_stock">Hết món</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên món</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy món ăn nào
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish.id} className={`hover:bg-gray-50 transition-colors ${dish.isHidden ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{dish.name}</span>
                        <span className="text-xs text-gray-500">{dish.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{getCategoryName(dish.categoryId)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatCurrency(dish.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{dish.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${dish.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {dish.status === 'available' ? 'Còn món' : 'Hết món'}
                        </span>
                        {dish.isHidden && (
                          <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                            Đã ẩn
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDish(dish)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditDish(dish)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleVisibility(dish.id)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded transition-colors"
                          title={dish.isHidden ? 'Hiện món' : 'Ẩn món'}
                        >
                          {dish.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                        </button>
                        <button
                          onClick={() => handleDeleteDish(dish.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          Hiển thị <strong>{filteredDishes.length}</strong> / <strong>{dishes.length}</strong> món ăn
        </div>
      </div>

      {isModalOpen && (
        <DishModal
          dish={selectedDish}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveDish}
          categories={categories}
        />
      )}

      {deleteDishId && (
        <DeleteConfirmModal
          title="Xóa món ăn"
          message="Bạn có chắc chắn muốn xóa món ăn này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDishId(null)}
        />
      )}
    </div>
  );
};

export default DishManagement;
