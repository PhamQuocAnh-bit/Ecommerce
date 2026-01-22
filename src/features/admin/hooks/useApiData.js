import { useState, useEffect } from 'react';

// Biến hằng số API_URL - Đặt null hoặc rỗng để sử dụng Mock Data
export const API_URL = null; // Thay bằng 'https://your-api.com' khi có backend thật

/**
 * Custom hook xử lý logic API với fallback sang Mock Data
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.endpoint - API endpoint (ví dụ: '/orders', '/categories')
 * @param {any} config.mockData - Dữ liệu giả lập để fallback khi API không khả dụng
 * @returns {Object} { data, setData, loading, error, isUsingMockData }
 */
export function useApiData({ endpoint, mockData }) {
  const [data, setData] = useState(mockData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Kiểm tra nếu API_URL không được định nghĩa hoặc là null/rỗng
      if (!API_URL || API_URL === '') {
        console.log(`[useApiData] API_URL chưa được thiết lập. Sử dụng Mock Data cho endpoint: ${endpoint}`);
        setData(mockData);
        setIsUsingMockData(true);
        setLoading(false);
        return;
      }

      try {
        // Gọi API thật
        const response = await fetch(`${API_URL}${endpoint}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        // Nếu API trả về dữ liệu rỗng hoặc không hợp lệ, dùng Mock Data
        if (!result || (Array.isArray(result) && result.length === 0)) {
          console.log(`[useApiData] API trả về dữ liệu rỗng. Fallback sang Mock Data cho: ${endpoint}`);
          setData(mockData);
          setIsUsingMockData(true);
        } else {
          console.log(`[useApiData] Dữ liệu từ API: ${endpoint}`, result);
          setData(result);
          setIsUsingMockData(false);
        }
      } catch (err) {
        // Khi gặp lỗi, tự động fallback sang Mock Data
        console.error(`[useApiData] Lỗi khi gọi API ${endpoint}:`, err);
        console.log(`[useApiData] Fallback sang Mock Data`);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData(mockData);
        setIsUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, mockData]);

  return { data, setData, loading, error, isUsingMockData };
}
