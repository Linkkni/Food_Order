using food_order_web_app.DTOs;
using food_order_web_app.Service;
using Microsoft.AspNetCore.Mvc;

namespace food_order_web_app.Controllers
{
    [Route("api/[controller]")] // URL: /api/products
    [ApiController]
    public class ProductsController : ControllerBase
    {
        
        
            private readonly IProductService _productService;

            public ProductsController(IProductService productService)
            {
                _productService = productService;
            }

            /// <summary>
            /// Lấy danh sách tất cả sản phẩm còn bán.
            /// </summary>
            [HttpGet]
            public async Task<IActionResult> GetAvailableProductAsync()
            {
                var products = await _productService.GetAvailableProductsAsync();
                return Ok(products);
            }

            /// <summary>
            /// Lấy chi tiết một sản phẩm theo ID.
            /// </summary>
            [HttpGet("{id}")]
            public async Task<IActionResult> GetProductById(int id)
            {
                var product = await _productService.GetProductByIdAsync(id);
                if (product == null)
                {
                    return NotFound($"Không tìm thấy sản phẩm với ID = {id}");
                }
                return Ok(product);
            }

            /// <summary>
            /// Lấy danh sách sản phẩm theo Category ID.
            /// </summary>
            [HttpGet("category/{categoryId}")]
            public async Task<IActionResult> GetProductsByCategory(int categoryId)
            {
                var products = await _productService.GetProductsByCategoryIdAsync(categoryId);
                return Ok(products);
            }

            /// <summary>
            /// Tạo một sản phẩm mới.
            /// </summary>
            [HttpPost]
            public async Task<IActionResult> CreateProduct([FromBody] ProductCreateUpdateDto productDto)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var newProduct = await _productService.CreateProductAsync(productDto);
                return CreatedAtAction(nameof(GetProductById), new { id = newProduct.ProductId }, newProduct);
            }

            /// <summary>
            /// Cập nhật một sản phẩm đã có.
            /// </summary>
            [HttpPut("{id}")]
            public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductCreateUpdateDto productDto)
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                var updatedProduct = await _productService.UpdateProductAsync(id, productDto);
                if (updatedProduct == null)
                {
                    return NotFound($"Không tìm thấy sản phẩm với ID = {id}");
                }
                return NoContent();
            }

            /// <summary>
            /// Xoá một sản phẩm.
            /// </summary>
            [HttpDelete("{id}")]
            public async Task<IActionResult> DeleteProduct(int id)
            {
                var success = await _productService.DeleteProductAsync(id);
                if (!success)
                {
                    return NotFound($"Không tìm thấy sản phẩm với ID = {id}");
                }
                return NoContent();
            }
        }
    }

