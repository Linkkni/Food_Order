using System.ComponentModel.DataAnnotations;

namespace food_order_web_app.DTOs
{
    public class ProductCreateUpdateDto
    {
        [Required]
        [MaxLength(40)]
        public string ProductName { get; set; } = null!;
        public int? SupplierId { get; set; }
        public int? CategoryId { get; set; }
        public string? QuantityPerUnit { get; set; }

        [Range(0, double.MaxValue)]
        public double? UnitPrice { get; set; }
        public short? UnitsInStock { get; set; }
        public short? UnitsOnOrder { get; set; }
        public short? ReorderLevel { get; set; }

        [Required]
        public string Discontinued { get; set; } = "0";
    }
}
