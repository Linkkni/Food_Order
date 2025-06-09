using food_order_web_app.DTOs;
using food_order_web_app.Models;

namespace food_order_web_app.Service
{
    public interface IOrderService
    {
        Task<Order> CreateNewOrderAsync(CreateOrderRequestDto request);
        Task<IEnumerable<Order>> GetOrderHistoryForCustomerAsync(string customerId);
        Task<Order?> GetOrderDetailsAsync(int orderId);

        // --- CHỨC NĂNG MỚI ---
        Task<Order?> UpdateOrderShippingInfoAsync(int orderId, OrderUpdateDto orderDto);
        Task<bool> CancelOrderAsync(int orderId); // Dùng để "xoá mềm" hoặc xoá hẳn đơn hàng
    }
}
