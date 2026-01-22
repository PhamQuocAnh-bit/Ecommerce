import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockInventory } from '../../data/mockData';
import { Search, Plus, Edit, Trash2, AlertTriangle } from 'lucide-react';
import InventoryModal from '../modals/InventoryModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const InventoryManagement = () => {
  const { data: inventory, setData: setInventory, loading, isUsingMockData } = useApiData({
    endpoint: '/inventory',
    mockData: mockInventory,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);

  const filteredInventory = inventory.filter(item => {
    const matchSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchLowStock = !filterLowStock || item.isLowStock;

    return matchSearch && matchLowStock;
  });

  const lowStockCount = inventory.filter(item => item.isLowStock).length;

  const handleAddItem = () => {
    setSelectedItem(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditItem = (item) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteItem = (itemId) => {
    setDeleteItemId(itemId);
  };

  const confirmDelete = () => {
    if (deleteItemId) {
      setInventory(prevInventory => prevInventory.filter(i => i.id !== deleteItemId));
      setDeleteItemId(null);
    }
  };

  const handleSaveItem = (item) => {
    if (modalMode === 'add') {
      setInventory(prevInventory => [...prevInventory, item]);
    } else {
      setInventory(prevInventory =>
        prevInventory.map(i => (i.id === item.id ? item : i))
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Kho (Inventory)</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">Đang dùng mock data</span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm nguyên liệu
        </button>
      </div>

      {/* Alert for low stock */}
      {lowStockCount > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Cảnh báo: Có <strong>{lowStockCount}</strong> nguyên liệu sắp hết hàng!
              </p>
              <p className="text-xs text-red-600 mt-1">
                Vui lòng kiểm tra và nhập hàng kịp thời để đảm bảo hoạt động kinh doanh.
              </p>
            </div>
            <button
              onClick={() => setFilterLowStock(!filterLowStock)}
              className={`px-3 py-1 text-xs rounded ${filterLowStock
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-red-600 border border-red-600'
                }`}
            >
              {filterLowStock ? 'Hiện tất cả' : 'Xem tồn kho thấp'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm nguyên liệu..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên nguyên liệu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tồn kho</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngưỡng tối thiểu</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sử dụng/món</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cập nhật</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy nguyên liệu nào
                  </td>
                </tr>
              ) : (
                filteredInventory.map((item) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors ${item.isLowStock ? 'bg-red-50' : ''
                      }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {item.isLowStock && (
                          <AlertTriangle size={16} className="text-red-600 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{item.name}</span>
                          <span className="text-xs text-gray-500">{item.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{item.category}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-medium ${item.isLowStock ? 'text-red-600' : 'text-gray-900'
                        }`}>
                        {item.quantity} {item.unit}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.minThreshold} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {item.usagePerDish} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(item.lastUpdated).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      {item.isLowStock ? (
                        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-red-100 text-red-700 font-medium">
                          <AlertTriangle size={12} />
                          Sắp hết
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                          Đủ hàng
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
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
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Hiển thị <strong>{filteredInventory.length}</strong> / <strong>{inventory.length}</strong> nguyên liệu
          </span>
          <span className="text-red-600 font-medium">
            Tồn kho thấp: <strong>{lowStockCount}</strong>
          </span>
        </div>
      </div>

      {isModalOpen && (
        <InventoryModal
          item={selectedItem}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveItem}
        />
      )}

      {deleteItemId && (
        <DeleteConfirmModal
          title="Xóa nguyên liệu"
          message="Bạn có chắc chắn muốn xóa nguyên liệu này khỏi kho? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteItemId(null)}
        />
      )}
    </div>
  );
};

export default InventoryManagement;
