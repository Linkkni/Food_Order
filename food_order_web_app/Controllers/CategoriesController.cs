using food_order_web_app.DTOs;
using food_order_web_app.Models;
using food_order_web_app.Service;
using Microsoft.AspNetCore.Mvc;

namespace food_order_web_app.Controllers
{
    [Route("api/[controller]")] // URL: /api/categories
    [ApiController]
    public class CategoriesController : ControllerBase
    {


        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
         
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            var categories = await _categoryService.GetAllCategoriesAsync();
            return Ok(categories);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoriesByIdAsync(int categoryId)
        {
            var category = await _categoryService.GetCategoriesByIdAsync(categoryId);
            if(category == null)
            {
                return NotFound($"Không tìm thấy danh mục với ID = {categoryId}");
            }
            return Ok(category);
        }

        

        /// <summary>
        /// Cập nhật một danh mục đã có.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] CategoryCreateUpdateDto categoryDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedCategory = await _categoryService.UpdateCategoryAsync(id, categoryDto);
            if (updatedCategory == null)
            {
                return NotFound($"Không tìm thấy danh mục với ID = {id} để cập nhật.");
            }
            return NoContent(); // Trả về 204 No Content khi cập nhật thành công
        }

        /// <summary>
        /// Xoá một danh mục.
        /// </summary>
        





    }
}
