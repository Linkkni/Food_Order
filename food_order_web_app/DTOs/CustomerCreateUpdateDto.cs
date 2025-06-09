using System.ComponentModel.DataAnnotations;

namespace food_order_web_app.DTOs
{
    public class CustomerCreateUpdateDto
    {
        [Required]
        [StringLength(5, MinimumLength = 5, ErrorMessage = "Customer ID phải có đúng 5 ký tự.")]
        public string CustomerId { get; set; } = null!;

        [Required]
        [MaxLength(40)]
        public string CompanyName { get; set; } = null!;

        [MaxLength(30)]
        public string? ContactName { get; set; }

        [MaxLength(30)]
        public string? ContactTitle { get; set; }

        [MaxLength(60)]
        public string? Address { get; set; }

        [MaxLength(15)]
        public string? City { get; set; }

        [MaxLength(15)]
        public string? Region { get; set; }

        [MaxLength(10)]
        public string? PostalCode { get; set; }

        [MaxLength(15)]
        public string? Country { get; set; }

        [Phone]
        [MaxLength(24)]
        public string? Phone { get; set; }

        [MaxLength(24)]
        public string? Fax { get; set; }
    }
}
