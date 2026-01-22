import React, { useState, useMemo } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockOrders, mockCategories } from '../../data/mockData';
import { Search, Filter, ArrowUpDown, Plus, Edit, Trash2, Eye } from 'lucide-react';
import OrderModal from '../modals/OrderModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const OrderManagement = () => {
  // Sử dụng hook useApiData với logic API/Mock Data
  const { data: orders, setData: setOrders, loading, isUsingMockData } = useApiData({
    endpoint: '/orders',
    mockData: mockOrders,
  });

  const { data: categories } = useApiData({
    endpoint: '/categories',
    mockData: mockCategories,
  });

  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalMode, setModalMode] = useState('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);

  // Lấy tên category từ ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Lọc và sắp xếp orders
  const filteredAndSortedOrders = useMemo(() => {
    let result = [...orders];

    // Lọc theo search
    if (searchTerm) {
      result = result.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sắp xếp
    result.sort((a, b) => {
      let aValue;
      let bValue;

      if (sortField === 'createdAt') {
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
      } else if (sortField === 'totalAmount') {
        aValue = a.totalAmount;
        bValue = b.totalAmount;
      } else {
        aValue = a.orderId;
        bValue = b.orderId;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [orders, searchTerm, statusFilter, sortField, sortDirection]);

  // Handlers
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const handleAddOrder = () => {
    setSelectedOrder(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteOrder = (orderId) => {
    setDeleteOrderId(orderId);
  };

  const confirmDelete = () => {
    if (deleteOrderId) {
      setOrders(prevOrders => prevOrders.filter(order => order.id !== deleteOrderId));
      setDeleteOrderId(null);
    }
  };

  const handleSaveOrder = (order) => {
    if (modalMode === 'add') {
      setOrders(prevOrders => [...prevOrders, order]);
    } else if (modalMode === 'edit') {
      setOrders(prevOrders =>
        prevOrders.map(o => (o.id === order.id ? order : o))
      );
    }
    setIsModalOpen(false);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-700' },
      processing: { label: 'Đang giao', color: 'bg-blue-100 text-blue-700' },
      delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
      completed: { label: 'Hoàn thành', color: 'bg-purple-100 text-purple-700' },
    };

    const config = statusConfig[status];
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">
                đang dùng mockdata
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddOrder}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm đơn hàng
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên khách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="processing">Đang giao</option>
              <option value="delivered">Đã giao</option>
              <option value="cancelled">Đã hủy</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          {/* Sort Field */}
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="createdAt">Sắp xếp: Thời gian</option>
            <option value="totalAmount">Sắp xếp: Tổng tiền</option>
            <option value="id">Sắp xếp: Mã đơn</option>
          </select>

          {/* Sort Direction */}
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowUpDown size={18} />
            {sortDirection === 'asc' ? 'Tăng dần' : 'Giảm dần'}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã đơn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại đồ ăn (ID)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tổng tiền</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAndSortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                filteredAndSortedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.orderId}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{order.customerName}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-orange-600">{order.categoryId}</span>
                        <span className="text-xs text-gray-500">{getCategoryName(order.categoryId)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs rounded px-2 py-1 border-0 focus:ring-2 focus:ring-orange-500"
                        style={{
                          backgroundColor:
                            order.status === 'pending' ? '#fef3c7' :
                              order.status === 'processing' ? '#dbeafe' :
                                order.status === 'delivered' ? '#dcfce7' :
                                  order.status === 'cancelled' ? '#fee2e2' : '#f3e8ff',
                          color:
                            order.status === 'pending' ? '#a16207' :
                              order.status === 'processing' ? '#1e40af' :
                                order.status === 'delivered' ? '#15803d' :
                                  order.status === 'cancelled' ? '#b91c1c' : '#6b21a8'
                        }}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="processing">Đang giao</option>
                        <option value="delivered">Đã giao</option>
                        <option value="cancelled">Đã hủy</option>
                        <option value="completed">Hoàn thành</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
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

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Hiển thị <strong>{filteredAndSortedOrders.length}</strong> / <strong>{orders.length}</strong> đơn hàng
          </span>
          <span className="text-gray-600">
            Tổng giá trị: <strong className="text-orange-600">{formatCurrency(
              filteredAndSortedOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            )}</strong>
          </span>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && (
        <OrderModal
          order={selectedOrder}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveOrder}
          categories={categories}
        />
      )}

      {deleteOrderId && (
        <DeleteConfirmModal
          title="Xóa đơn hàng"
          message="Bạn có chắc chắn muốn xóa đơn hàng này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteOrderId(null)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
