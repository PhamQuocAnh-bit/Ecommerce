import { useState, useMemo } from 'react';
import { useApiData } from '../../hooks/useApiData';
import { mockReviews, mockDishes } from '../../data/mockData';
import { Search, Filter, Star, Trash2 } from 'lucide-react';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';

const ReviewManagement = () => {
  const { data: reviews, setData: setReviews, loading, isUsingMockData } = useApiData({
    endpoint: '/reviews',
    mockData: mockReviews,
  });

  const { data: dishes } = useApiData({
    endpoint: '/dishes',
    mockData: mockDishes,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [dishFilter, setDishFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [deleteReviewId, setDeleteReviewId] = useState(null);

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      const matchSearch =
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.comment.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDish = dishFilter === 'all' || review.dishId === dishFilter;

      const matchRating =
        ratingFilter === 'all' ||
        (ratingFilter === '5' && review.rating === 5) ||
        (ratingFilter === '4' && review.rating === 4) ||
        (ratingFilter === '3' && review.rating === 3) ||
        (ratingFilter === '1-2' && review.rating <= 2);

      return matchSearch && matchDish && matchRating;
    });
  }, [reviews, searchTerm, dishFilter, ratingFilter]);

  const handleDeleteReview = (reviewId) => {
    setDeleteReviewId(reviewId);
  };

  const confirmDelete = () => {
    if (deleteReviewId) {
      setReviews(prevReviews => prevReviews.filter(r => r.id !== deleteReviewId));
      setDeleteReviewId(null);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
          />
        ))}
      </div>
    );
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-gray-500">Đang tải dữ liệu...</div>
    </div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Đánh giá & Phản hồi</h1>
          <p className="text-sm text-gray-500 mt-1">
            {isUsingMockData && (
              <span className="text-orange-600 font-medium">Đang dùng mock data</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <Star size={20} className="text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-medium text-gray-700">
            Đánh giá TB: <strong className="text-yellow-600">{averageRating}/5</strong>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng, món ăn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={dishFilter}
              onChange={(e) => setDishFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none"
            >
              <option value="all">Tất cả món ăn</option>
              {dishes.map(dish => (
                <option key={dish.id} value={dish.id}>{dish.name}</option>
              ))}
            </select>
          </div>

          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="1-2">1-2 sao</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khách hàng</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Món ăn</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Đánh giá</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nhận xét</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thời gian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    Không tìm thấy đánh giá nào
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{review.customerName}</span>
                        <span className="text-xs text-gray-500">{review.customerId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">{review.dishName}</span>
                        <span className="text-xs text-gray-500">{review.dishId}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {renderStars(review.rating)}
                        <span className="text-xs text-gray-600">{review.rating}/5</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-gray-700 line-clamp-2 max-w-md">
                        {review.comment}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {new Date(review.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviews.filter(r => r.rating === star).length;
          const percentage = reviews.length > 0 ? ((count / reviews.length) * 100).toFixed(0) : '0';
          return (
            <div key={star} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium text-gray-700">{star}</span>
                  <Star size={14} className="text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-xs text-gray-500">{count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">{percentage}%</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="text-sm text-gray-600">
          Hiển thị <strong>{filteredReviews.length}</strong> / <strong>{reviews.length}</strong> đánh giá
        </div>
      </div>

      {deleteReviewId && (
        <DeleteConfirmModal
          title="Xóa đánh giá"
          message="Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteReviewId(null)}
        />
      )}
    </div>
  );
};

export default ReviewManagement;
