import { useState } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockStaff } from '../../data/mockData';
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react';
import StaffModal from '../modals/StaffModal';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const StaffManagement = () => {
  const { data: staff, setData: setStaff, loading, isUsingMockData } = useApiData({
    endpoint: '/staff',
    mockData: mockStaff,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalMode, setModalMode] = useState('add');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteStaffId, setDeleteStaffId] = useState(null);

  const filteredStaff = staff.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.phone.includes(searchTerm)
  );

  const handleAddStaff = () => {
    setSelectedStaff(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteStaff = (staffId) => {
    setDeleteStaffId(staffId);
  };

  const confirmDelete = () => {
    if (deleteStaffId) {
      setStaff(prevStaff => prevStaff.filter(s => s.id !== deleteStaffId));
      setDeleteStaffId(null);
    }
  };

  const handleSaveStaff = (staffMember) => {
    if (modalMode === 'add') {
      setStaff(prevStaff => [...prevStaff, staffMember]);
    } else {
      setStaff(prevStaff =>
        prevStaff.map(s => (s.id === staffMember.id ? staffMember : s))
      );
    }
    setIsModalOpen(false);
  };

  const handleToggleActive = (staffId) => {
    setStaff(prevStaff =>
      prevStaff.map(s =>
        s.id === staffId ? { ...s, isActive: !s.isActive } : s
      )
    );
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
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhân viên</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">Đang dùng mock data</span>
            )}
          </p>
        </div>
        <button
          onClick={handleAddStaff}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
        >
          <Plus size={20} />
          Thêm nhân viên
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số điện thoại</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy nhân viên nào
                  </td>
                </tr>
              ) : (
                filteredStaff.map((staffMember) => (
                  <tr key={staffMember.id} className={`hover:bg-gray-50 transition-colors ${!staffMember.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{staffMember.name}</span>
                        <span className="text-xs text-gray-500">{staffMember.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staffMember.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{staffMember.phone}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${staffMember.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 font-medium'
                          : 'bg-blue-100 text-blue-700'
                        }`}>
                        {staffMember.role === 'admin' ? 'Admin' : 'Nhân viên'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(staffMember.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleActive(staffMember.id)}
                        className={`flex items-center gap-1 text-xs px-2 py-1 rounded ${staffMember.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {staffMember.isActive ? (
                          <>
                            <UserCheck size={12} />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <UserX size={12} />
                            Ngưng
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditStaff(staffMember)}
                          className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStaff(staffMember.id)}
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
            Hiển thị <strong>{filteredStaff.length}</strong> / <strong>{staff.length}</strong> nhân viên
          </span>
          <div className="flex items-center gap-4">
            <span>Admin: <strong>{staff.filter(s => s.role === 'admin').length}</strong></span>
            <span>Nhân viên: <strong>{staff.filter(s => s.role === 'staff').length}</strong></span>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <StaffModal
          staff={selectedStaff}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
        />
      )}

      {deleteStaffId && (
        <DeleteConfirmModal
          title="Xóa nhân viên"
          message="Bạn có chắc chắn muốn xóa nhân viên này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteStaffId(null)}
        />
      )}
    </div>
  );
};

export default StaffManagement;
