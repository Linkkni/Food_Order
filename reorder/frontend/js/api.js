// js/api.js

// !!! QUAN TRỌNG: Thay đổi URL này thành URL của API backend của bạn khi chạy.
// Thường là https://localhost:<port>
const API_BASE_URL = "https://localhost:7135";

const API_ENDPOINTS = {
  categories: `${API_BASE_URL}/api/categories`,
  products: `${API_BASE_URL}/api/products`,
  productsByCategory: (categoryId) =>
    `${API_BASE_URL}/api/products/category/${categoryId}`,
  orders: `${API_BASE_URL}/api/orders`,
  // Sửa lại để trỏ đến OrdersController
  customerOrders: (customerId) =>
    `${API_BASE_URL}/api/orders/customer/${customerId}`,
};
