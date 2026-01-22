import { useState } from 'react';
import { X } from 'lucide-react';

const OrderModal = ({ order, mode, onClose, onSave, categories }) => {
  const [formData, setFormData] = useState({
    id: order?.id || `ORD_${Date.now()}`,
    orderId: order?.orderId || `DH${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    customerName: order?.customerName || '',
    items: order?.items || [],
    totalAmount: order?.totalAmount || 0,
    status: order?.status || 'pending',
    categoryId: order?.categoryId || '',
    createdAt: order?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  const isAddMode = mode === 'add';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isViewMode) return;

    onSave(formData);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const statusConfig = {
    pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
    processing: { label: 'Đang giao', color: 'bg-blue-100 text-blue-700' },
    delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
    cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
    completed: { label: 'Hoàn thành', color: 'bg-purple-100 text-purple-700' },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {isViewMode && 'Chi tiết Đơn hàng'}
            {isEditMode && 'Chỉnh sửa Đơn hàng'}
            {isAddMode && 'Thêm Đơn hàng mới'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Order ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã đơn hàng
            </label>
            <input
              type="text"
              value={formData.orderId}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          </div>

          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khách hàng <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
              disabled={isViewMode}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loại đồ ăn <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              disabled={isViewMode}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
            >
              <option value="">-- Chọn loại đồ ăn --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id} - {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Total Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tổng tiền <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.totalAmount}
              onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
              disabled={isViewMode}
              required
              min="0"
              step="1000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-600"
            />
            {!isViewMode && (
              <p className="text-xs text-gray-500 mt-1">
                Hiển thị: {formatCurrency(formData.totalAmount)}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trạng thái
            </label>
            {isViewMode ? (
              <div>
                <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${statusConfig[formData.status].color}`}>
                  {statusConfig[formData.status].label}
                </span>
              </div>
            ) : (
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang giao</option>
                <option value="delivered">Đã giao</option>
                <option value="cancelled">Đã hủy</option>
                <option value="completed">Hoàn thành</option>
              </select>
            )}
          </div>

          {/* Items List */}
          {isViewMode && formData.items.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh sách món ăn
              </label>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Món ăn</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">SL</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Giá</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tổng</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {formData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.dishName}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{item.quantity}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{formatCurrency(item.price)}</td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Timestamps */}
          {isViewMode && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tạo
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(formData.createdAt).toLocaleString('vi-VN')}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cập nhật lần cuối
                </label>
                <p className="text-sm text-gray-600">
                  {new Date(formData.updatedAt).toLocaleString('vi-VN')}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
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
                {isAddMode ? 'Thêm' : 'Lưu'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
