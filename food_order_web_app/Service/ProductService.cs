using food_order_web_app.Data;
using food_order_web_app.DTOs;
using food_order_web_app.Models;
using Microsoft.EntityFrameworkCore;

namespace food_order_web_app.Service
{

    
    public class ProductService : IProductService
    {
        private readonly ApiDbContext _context;

        // SỬA LỖI: Gán đúng chiều từ tham số 'context' vào biến '_context' của lớp
        public ProductService(ApiDbContext context)
        {
            _context = context;
        }

        // --- CÁC HÀM READ (GET) ĐÃ CÓ ---
        public async Task<IEnumerable<Product>> GetAvailableProductsAsync()
        {
            return await _context.Products
                .Where(p => p.Discontinued == "0" || p.Discontinued == "false")
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int productId)
        {
            return await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == productId);
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryIdAsync(int categoryId)
        {
            return await _context.Products
                .Where(p => p.CategoryId == categoryId && (p.Discontinued == "0" || p.Discontinued == "false"))
                .AsNoTracking()
                .ToListAsync();
        }

        // --- TRIỂN KHAI CRUD ---

        public async Task<Product> CreateProductAsync(ProductCreateUpdateDto productDto)
        {
            var newProduct = new Product
            {
                ProductName = productDto.ProductName,
                SupplierId = productDto.SupplierId,
                CategoryId = productDto.CategoryId,
                QuantityPerUnit = productDto.QuantityPerUnit,
                UnitPrice = productDto.UnitPrice,
                UnitsInStock = productDto.UnitsInStock,
                UnitsOnOrder = productDto.UnitsOnOrder,
                ReorderLevel = productDto.ReorderLevel,
                Discontinued = productDto.Discontinued
            };

            await _context.Products.AddAsync(newProduct);
            await _context.SaveChangesAsync();
            return newProduct;
        }

        public async Task<Product?> UpdateProductAsync(int productId, ProductCreateUpdateDto productDto)
        {
            var existingProduct = await _context.Products.FindAsync(productId);
            if (existingProduct == null)
            {
                return null; // Không tìm thấy sản phẩm để cập nhật
            }

            // Cập nhật các thuộc tính từ DTO
            existingProduct.ProductName = productDto.ProductName;
            existingProduct.SupplierId = productDto.SupplierId;
            existingProduct.CategoryId = productDto.CategoryId;
            existingProduct.QuantityPerUnit = productDto.QuantityPerUnit;
            existingProduct.UnitPrice = productDto.UnitPrice;
            existingProduct.UnitsInStock = productDto.UnitsInStock;
            existingProduct.UnitsOnOrder = productDto.UnitsOnOrder;
            existingProduct.ReorderLevel = productDto.ReorderLevel;
            existingProduct.Discontinued = productDto.Discontinued;

            await _context.SaveChangesAsync();
            return existingProduct;
        }

        public async Task<bool> DeleteProductAsync(int productId)
        {
            var productToDelete = await _context.Products.FindAsync(productId);
            if (productToDelete == null)
            {
                return false; // Không tìm thấy sản phẩm để xoá
            }

            _context.Products.Remove(productToDelete);
            await _context.SaveChangesAsync();
            return true;
        }
        /**/
    }
}
