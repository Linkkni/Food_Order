using food_order_web_app.DTOs;
using food_order_web_app.Service;
using Microsoft.AspNetCore.Mvc;

namespace food_order_web_app.Controllers
{
    [Route("api/[controller]")] // URL: /api/orders
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Tạo một đơn hàng mới.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequestDto request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var createdOrder = await _orderService.CreateNewOrderAsync(request);
                return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.OrderId }, createdOrder);
            }
            catch (Exception ex)
            {
                // Bắt các lỗi nghiệp vụ từ service (ví dụ: sản phẩm không tồn tại)
                return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        /// Lấy lịch sử đặt hàng của một khách hàng.
        /// </summary>
        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetOrdersByCustomer(string customerId)
        {
            var orders = await _orderService.GetOrderHistoryForCustomerAsync(customerId);
            return Ok(orders);
        }

        /// <summary>
        /// Lấy thông tin chi tiết của một đơn hàng theo ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrderById(int id)
        {
            var order = await _orderService.GetOrderDetailsAsync(id);
            if (order == null)
            {
                return NotFound($"Không tìm thấy đơn hàng với ID = {id}");
            }
            return Ok(order);
        }

        /// <summary>
        /// Cập nhật thông tin vận chuyển của một đơn hàng.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateOrder(int id, [FromBody] OrderUpdateDto orderDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var updatedOrder = await _orderService.UpdateOrderShippingInfoAsync(id, orderDto);
            if (updatedOrder == null)
            {
                return NotFound($"Không tìm thấy đơn hàng với ID = {id}");
            }
            return NoContent();
        }

        /// <summary>
        /// Huỷ một đơn hàng.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelOrder(int id)
        {
            var success = await _orderService.CancelOrderAsync(id);
            if (!success)
            {
                return NotFound($"Không tìm thấy đơn hàng với ID = {id} để huỷ.");
            }
            return NoContent();
        }
    }
}
