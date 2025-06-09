using System.ComponentModel.DataAnnotations;

namespace food_order_web_app.DTOs
{
    public class CategoryCreateUpdateDto
    {
        [Required]
        [MaxLength(15)]
        public string CategoryName { get; set; } = null!;
        public string? Description { get; set; }
    }
}
