using food_order_web_app.DTOs;
using food_order_web_app.Models;

namespace food_order_web_app.Service
{
    public interface ICustomerService
    {
        /// <summary>
        /// Tìm một khách hàng dựa trên ID.
        /// </summary>
        Task<IEnumerable<Customer>> GetAllCustomersAsync();
        Task<Customer?> GetCustomerByIdAsync(string customerId);

        // --- CHỨC NĂNG MỚI ---
        Task<Customer> CreateCustomerAsync(CustomerCreateUpdateDto customerDto);
        Task<Customer?> UpdateCustomerAsync(string customerId, CustomerCreateUpdateDto customerDto);
        Task<bool> DeleteCustomerAsync(string customerId);
    }
}
