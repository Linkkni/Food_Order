const API_BASE_URL = "https://localhost:7135"; // Ví dụ: https://localhost:7135

export const API = {
  // Phân tích từ ProductsController.cs
  getProducts: () => `${API_BASE_URL}/api/products`,
  getProductsByCategory: (catId) =>
    `${API_BASE_URL}/api/products/category/${catId}`,
  getProductById: (prodId) => `${API_BASE_URL}/api/products/${prodId}`,

  // Phân tích từ CategoriesController.cs
  getCategories: () => `${API_BASE_URL}/api/categories`,

  // Phân tích từ OrdersController.cs
  createOrder: () => `${API_BASE_URL}/api/orders`,
  getCustomerOrders: (custId) =>
    `${API_BASE_URL}/api/orders/customer/${custId}`,
};
