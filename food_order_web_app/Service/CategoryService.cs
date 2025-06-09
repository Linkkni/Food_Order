namespace food_order_web_app.Service;

using food_order_web_app.Data; // Thay 'Data' và 'NorthwindDbContext' nếu cần
using food_order_web_app.DTOs;
using food_order_web_app.Models;
using food_order_web_app.Service;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;

using SQLitePCL;

public class CategoryService: ICategoryService
    {

    private readonly ApiDbContext _context;

    public CategoryService(ApiDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
    {
        return await _context.Categories.AsNoTracking().ToListAsync();
    }

    public async Task<Category?> GetCategoriesByIdAsync(int categoryId)
    {
        return await _context.Categories
                              .AsNoTracking()
                              .FirstOrDefaultAsync(o => o.CategoryId == categoryId);

    }
    

    public async Task<Category?> UpdateCategoryAsync(int categoryId, CategoryCreateUpdateDto categoryDto)
    {
        var existingCategory = await _context.Categories.FindAsync(categoryId);
        if (existingCategory == null)
        {
            return null;
        }

        existingCategory.CategoryName = categoryDto.CategoryName;
        existingCategory.Description = categoryDto.Description;

        await _context.SaveChangesAsync();
        return existingCategory;
    }

    


}

