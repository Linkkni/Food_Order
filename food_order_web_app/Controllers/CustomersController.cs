using food_order_web_app.DTOs;
using food_order_web_app.Service;
using food_order_web_app.DTOs;
using food_order_web_app.Service;
using Microsoft.AspNetCore.Mvc;

namespace food_order_web_app.Controllers
{
    [Route("api/[controller]")] // URL: /api/customers
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ICustomerService _customerService;

        public CustomersController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        /// <summary>
        /// Lấy danh sách tất cả khách hàng.
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllCustomers()
        {
            var customers = await _customerService.GetAllCustomersAsync();
            return Ok(customers);
        }

        /// <summary>
        /// Lấy thông tin chi tiết một khách hàng bằng ID.
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCustomerById(string id)
        {
            var customer = await _customerService.GetCustomerByIdAsync(id);
            if (customer == null)
            {
                return NotFound($"Không tìm thấy khách hàng với ID = {id}");
            }
            return Ok(customer);
        }

        /// <summary>
        /// Tạo một khách hàng mới.
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateCustomer([FromBody] CustomerCreateUpdateDto customerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            try
            {
                var newCustomer = await _customerService.CreateCustomerAsync(customerDto);
                return CreatedAtAction(nameof(GetCustomerById), new { id = newCustomer.CustomerId }, newCustomer);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message }); // Trả về 409 Conflict nếu ID đã tồn tại
            }
        }

        /// <summary>
        /// Cập nhật thông tin một khách hàng.
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCustomer(string id, [FromBody] CustomerCreateUpdateDto customerDto)
        {
            if (id != customerDto.CustomerId)
            {
                return BadRequest("ID trong URL và trong body không khớp.");
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedCustomer = await _customerService.UpdateCustomerAsync(id, customerDto);
            if (updatedCustomer == null)
            {
                return NotFound($"Không tìm thấy khách hàng với ID = {id}");
            }
            return NoContent();
        }

        /// <summary>
        /// Xoá một khách hàng.
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCustomer(string id)
        {
            try
            {
                var success = await _customerService.DeleteCustomerAsync(id);
                if (!success)
                {
                    return NotFound($"Không tìm thấy khách hàng với ID = {id}");
                }
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                // Trả về 400 Bad Request nếu có lỗi nghiệp vụ (ví dụ: không thể xoá KH đã có đơn hàng)
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}