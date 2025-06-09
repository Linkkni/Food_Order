using food_order_web_app.DTOs;
using food_order_web_app.Models;

namespace food_order_web_app.Service
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoriesByIdAsync(int categoryId);

     
        Task<Category?> UpdateCategoryAsync(int categoryId, CategoryCreateUpdateDto categoryDto);


 
    }
}
