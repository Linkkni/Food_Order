using food_order_web_app.Data;
using food_order_web_app.DTOs;
using food_order_web_app.Models;
using Microsoft.EntityFrameworkCore;

namespace food_order_web_app.Service
{
    public class CustomerServiec : ICustomerService
    {
        private readonly ApiDbContext _context;

        public CustomerServiec(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomersAsync()
        {
            return await _context.Customers.AsNoTracking().ToListAsync();
        }

        public async Task<Customer?> GetCustomerByIdAsync(string customerId)
        {
            return await _context.Customers
                        .AsNoTracking()
                        .FirstOrDefaultAsync(o => o.CustomerId == customerId);
        }

        public async Task<Customer> CreateCustomerAsync(CustomerCreateUpdateDto customerDto)
        {
            var existingCustomer = await _context.Customers.FindAsync(customerDto.CustomerId);
            if (existingCustomer != null)
            {
                throw new InvalidOperationException($"Khách hàng với ID '{customerDto.CustomerId}' đã tồn tại.");
            }

            var newCustomer = new Customer
            {
                CustomerId = customerDto.CustomerId,
                CompanyName = customerDto.CompanyName,
                ContactName = customerDto.ContactName,
                ContactTitle = customerDto.ContactTitle,
                Address = customerDto.Address,
                City = customerDto.City,
                Region = customerDto.Region,
                PostalCode = customerDto.PostalCode,
                Country = customerDto.Country,
                Phone = customerDto.Phone,
                Fax = customerDto.Fax
            };

            await _context.Customers.AddAsync(newCustomer);
            await _context.SaveChangesAsync();
            return newCustomer;
        }

        public async Task<Customer?> UpdateCustomerAsync(string customerId, CustomerCreateUpdateDto customerDto)
        {
            var existingCustomer = await _context.Customers.FindAsync(customerId);
            if (existingCustomer == null)
            {
                return null;
            }

            // Cập nhật thông tin
            existingCustomer.CompanyName = customerDto.CompanyName;
            existingCustomer.ContactName = customerDto.ContactName;
            existingCustomer.ContactTitle = customerDto.ContactTitle;
            existingCustomer.Address = customerDto.Address;
            existingCustomer.City = customerDto.City;
            existingCustomer.Region = customerDto.Region;
            existingCustomer.PostalCode = customerDto.PostalCode;
            existingCustomer.Country = customerDto.Country;
            existingCustomer.Phone = customerDto.Phone;
            existingCustomer.Fax = customerDto.Fax;
            // Không cho phép cập nhật CustomerId

            await _context.SaveChangesAsync();
            return existingCustomer;
        }

        public async Task<bool> DeleteCustomerAsync(string customerId)
        {
            var customerToDelete = await _context.Customers
                .Include(c => c.Orders) // Lấy cả các đơn hàng liên quan
                .FirstOrDefaultAsync(c => c.CustomerId == customerId);

            if (customerToDelete == null)
            {
                return false; // Không tìm thấy khách hàng
            }

            // QUY TẮC NGHIỆP VỤ QUAN TRỌNG: Không cho xoá khách hàng nếu họ đã có đơn hàng.
            if (customerToDelete.Orders.Any())
            {
                throw new InvalidOperationException("Không thể xoá khách hàng đã có đơn hàng. Hãy xem xét việc vô hiệu hoá tài khoản thay vì xoá.");
            }

            _context.Customers.Remove(customerToDelete);
            await _context.SaveChangesAsync();
            return true;
        }


    }
}
