import { useState } from 'react';
import { X } from 'lucide-react';

const InventoryModal = ({ item, mode, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    id: item?.id || `INV_${String(Date.now()).slice(-3).padStart(3, '0')}`,
    name: item?.name || '',
    category: item?.category || '',
    quantity: item?.quantity || 0,
    unit: item?.unit || '',
    minThreshold: item?.minThreshold || 0,
    usagePerDish: item?.usagePerDish || 0,
    lastUpdated: new Date().toISOString(),
    isLowStock: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = {
      ...formData,
      isLowStock: formData.quantity < formData.minThreshold,
    };
    onSave(updatedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {mode === 'add' ? 'Thêm Nguyên liệu mới' : 'Chỉnh sửa Nguyên liệu'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên nguyên liệu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="VD: Thịt bò, Rau sống..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Danh mục <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                placeholder="VD: Thịt, Rau củ..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đơn vị <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                required
                placeholder="VD: kg, lít, gói..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số lượng tồn kho <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngưỡng tối thiểu <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.minThreshold}
                onChange={(e) => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                required
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Cảnh báo khi tồn kho dưới mức này
              </p>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sử dụng cho mỗi món ăn
              </label>
              <input
                type="number"
                value={formData.usagePerDish}
                onChange={(e) => setFormData({ ...formData, usagePerDish: Number(e.target.value) })}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lượng nguyên liệu cần cho 1 món (tính theo {formData.unit || 'đơn vị'})
              </p>
            </div>
          </div>

          {/* Warning preview */}
          {formData.quantity > 0 && formData.minThreshold > 0 && formData.quantity < formData.minThreshold && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-700">
                ⚠️ Cảnh báo: Số lượng tồn kho hiện tại ({formData.quantity} {formData.unit}) 
                thấp hơn ngưỡng tối thiểu ({formData.minThreshold} {formData.unit})
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              {mode === 'add' ? 'Thêm' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryModal;
