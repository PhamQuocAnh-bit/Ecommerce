import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockCategories } from '../../data/mockData';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import CategoryModal from '../modals/CategoryModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const CategoryManagement = () => {
  const { data: categories, setData: setCategories, loading, isUsingMockData } = useApiData({
    endpoint: '/categories',
    mockData: mockCategories,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteCategory = (categoryId) => {
    setDeleteCategoryId(categoryId);
  };

  const confirmDelete = () => {
    if (deleteCategoryId) {
      setCategories(prevCategories => prevCategories.filter(c => c.id !== deleteCategoryId));
      setDeleteCategoryId(null);
    }
  };

  const handleSaveCategory = (category) => {
    if (modalMode === 'add') {
      setCategories(prevCategories => [...prevCategories, category]);
    } else {
      setCategories(prevCategories =>
        prevCategories.map(c => (c.id === category.id ? category : c))
      );
    }
    setIsModalOpen(false);
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Danh mục Đồ ăn</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">
                Đang dùng mock data
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddCategory}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo ID hoặc tên danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên loại</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy danh mục nào
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-orange-600">{category.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{category.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{category.description}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
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
          Hiển thị <strong>{filteredCategories.length}</strong> / <strong>{categories.length}</strong> danh mục
        </div>
      </div>

      {isModalOpen && (
        <CategoryModal
          category={selectedCategory}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCategory}
        />
      )}

      {deleteCategoryId && (
        <DeleteConfirmModal
          title="Xóa danh mục"
          message="Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteCategoryId(null)}
        />
      )}
    </div>
  );
};

export default CategoryManagement;
