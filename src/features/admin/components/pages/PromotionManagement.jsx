import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockPromotions } from '../../data/mockData';
import { Search, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import PromotionModal from '../modals/PromotionModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const PromotionManagement = () => {
  const { data: promotions, setData: setPromotions, loading, isUsingMockData } = useApiData({
    endpoint: '/promotions',
    mockData: mockPromotions,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletePromotionId, setDeletePromotionId] = useState(null);

  const filteredPromotions = promotions.filter(promo =>
    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promo.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPromotion = () => {
    setSelectedPromotion(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditPromotion = (promotion) => {
    setSelectedPromotion(promotion);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeletePromotion = (promotionId) => {
    setDeletePromotionId(promotionId);
  };

  const confirmDelete = () => {
    if (deletePromotionId) {
      setPromotions(prevPromotions => prevPromotions.filter(p => p.id !== deletePromotionId));
      setDeletePromotionId(null);
    }
  };

  const handleSavePromotion = (promotion) => {
    if (modalMode === 'add') {
      setPromotions(prevPromotions => [...prevPromotions, promotion]);
    } else {
      setPromotions(prevPromotions =>
        prevPromotions.map(p => (p.id === promotion.id ? promotion : p))
      );
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (promotionId) => {
    setPromotions(prevPromotions =>
      prevPromotions.map(p =>
        p.id === promotionId ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Khuyến mãi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">Đang dùng mock data</span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddPromotion}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm khuyến mãi
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã hoặc mô tả..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã voucher</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">% Giảm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày hết hạn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPromotions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy khuyến mãi nào
                  </td>
                </tr>
              ) : (
                filteredPromotions.map((promo) => {
                  const expired = isExpired(promo.expiryDate);
                  return (
                    <tr key={promo.id} className={`hover:bg-gray-50 transition-colors ${expired ? 'opacity-50' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-orange-600">{promo.code}</span>
                          <span className="text-xs text-gray-500">{promo.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{promo.description}</td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold text-green-600">{promo.discount}%</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          <span className={`text-sm ${expired ? 'text-red-600 font-medium' : 'text-gray-700'}`}>
                            {new Date(promo.expiryDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                        {expired && (
                          <span className="text-xs text-red-600">Đã hết hạn</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleActive(promo.id)}
                          disabled={expired}
                          className={`text-xs px-3 py-1 rounded ${promo.isActive && !expired
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                            } disabled:cursor-not-allowed`}
                        >
                          {promo.isActive && !expired ? 'Đang hoạt động' : 'Ngưng'}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditPromotion(promo)}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeletePromotion(promo.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          Hiển thị <strong>{filteredPromotions.length}</strong> / <strong>{promotions.length}</strong> khuyến mãi
        </div>
      </div>

      {isModalOpen && (
        <PromotionModal
          promotion={selectedPromotion}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSavePromotion}
        />
      )}

      {deletePromotionId && (
        <DeleteConfirmModal
          title="Xóa khuyến mãi"
          message="Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeletePromotionId(null)}
        />
      )}
    </div>
  );
};

export default PromotionManagement;
