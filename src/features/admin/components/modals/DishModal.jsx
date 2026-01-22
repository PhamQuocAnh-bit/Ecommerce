import { useState } from 'react';
import { X } from 'lucide-react';

const DishModal = ({ dish, mode, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    id: dish?.id || `DISH_${String(Date.now()).slice(-3).padStart(3, '0')}`,
    name: dish?.name || '',
    categoryId: dish?.categoryId || '',
    price: dish?.price || 0,
    description: dish?.description || '',
    image: dish?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    status: dish?.status || 'available',
    rating: dish?.rating || 0,
    toppings: dish?.toppings || [],
    sizes: dish?.sizes || [],
    isHidden: dish?.isHidden || false,
  });

  const isViewMode = mode === 'view';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;
    onSave(formData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isViewMode && 'Chi tiết Món ăn'}
            {mode === 'edit' && 'Chỉnh sửa Món ăn'}
            {mode === 'add' && 'Thêm Món ăn mới'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID Món ăn
              </label>
              <input
                type="text"
                value={formData.id}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên món <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isViewMode}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                disabled={isViewMode}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                disabled={isViewMode}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              />
              {!isViewMode && <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.price)}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={isViewMode}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Hình ảnh
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              disabled={isViewMode}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái món
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                disabled={isViewMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="available">Còn món</option>
                <option value="out_of_stock">Hết món</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đánh giá (0-5)
              </label>
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                disabled={isViewMode}
                min="0"
                max="5"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hiển thị
              </label>
              <select
                value={formData.isHidden ? 'hidden' : 'visible'}
                onChange={(e) => setFormData({ ...formData, isHidden: e.target.value === 'hidden' })}
                disabled={isViewMode}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
              >
                <option value="visible">Hiện</option>
                <option value="hidden">Ẩn</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isViewMode ? 'Đóng' : 'Hủy'}
            </button>
            {!isViewMode && (
              <button
                type="submit"
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                {mode === 'add' ? 'Thêm' : 'Lưu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default DishModal;
