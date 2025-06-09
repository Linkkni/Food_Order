using food_order_web_app.DTOs;
using food_order_web_app.Models;

namespace food_order_web_app.Service
{
    public interface IProductService
    {
        /// <summary>
        /// Lấy danh sách tất cả sản phẩm, chỉ những sản phẩm chưa bị ngừng bán.
        /// </summary>
        Task<IEnumerable<Product>> GetAvailableProductsAsync();

        /// <summary>
        /// Lấy chi tiết một sản phẩm dựa trên ID.
        /// </summary>
        Task<Product?> GetProductByIdAsync(int productId);

        /// <summary>
        /// Lấy danh sách sản phẩm theo một danh mục cụ thể.
        /// </summary>
        Task<IEnumerable<Product>> GetProductsByCategoryIdAsync(int categoryId);

        Task<Product> CreateProductAsync(ProductCreateUpdateDto productDto);
        Task<Product?> UpdateProductAsync(int productId, ProductCreateUpdateDto productDto);
        Task<bool> DeleteProductAsync(int productId);

    }
}
