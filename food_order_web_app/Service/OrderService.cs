using food_order_web_app.DTOs;
using food_order_web_app.Data;
using food_order_web_app.Models;
using Microsoft.EntityFrameworkCore;


namespace food_order_web_app.Service
{
    public class OrderService : IOrderService
    {

        private readonly ApiDbContext _context;

        public OrderService(ApiDbContext context)
        {
            _context = context;
        }

        public async Task<Order> CreateNewOrderAsync(CreateOrderRequestDto request)
        {
            var productIDs = request.Items.Select(i => i.ProductId).ToList();
            var products = await _context.Products
                                         .Where(p => productIDs.Contains(p.ProductId))
                                         .ToDictionaryAsync(p => p.ProductId);

            if (productIDs.Count != products.Count)
            {
                throw new Exception("Một hoặc nhiều sản phẩm không tồn tại.");
            }

            var newOrder = new Order
            {
                CustomerId = request.CustomerId,
                EmployeeId = request.EmployeeId,
                OrderDate = DateTime.UtcNow,
                RequiredDate = DateTime.UtcNow.AddDays(7), // Giả định
                ShipName = request.ShipName,
                ShipAddress = request.ShipAddress,
                ShipCity = request.ShipCity,
                ShipRegion = request.ShipRegion,
                ShipPostalCode = request.ShipPostalCode,
                ShipCountry = request.ShipCountry,
            };

            foreach (var item in request.Items)
            {
                var product = products[item.ProductId];
                var unitPrice = product.UnitPrice ?? 0;
                var orderDetail = new OrderDetail
                {
                    Order = newOrder,
                    ProductId = item.ProductId,
                    UnitPrice = unitPrice,
                    Quantity = (short)item.Quantity,
                    Discount = 0
                };
                newOrder.OrderDetails.Add(orderDetail);
            }
            await _context.Orders.AddAsync(newOrder);
            await _context.SaveChangesAsync();

            return newOrder;

        }

        public async Task<IEnumerable<Order>> GetOrderHistoryForCustomerAsync(string customerId)
        {
            return await _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .AsNoTracking()
                .ToListAsync();
        }

        public async Task<Order?> GetOrderDetailsAsync(int orderId)
        {
            return await _context.Orders
                 .Include(o => o.OrderDetails)
                 .ThenInclude(od => od.Product)
                 .AsNoTracking()
                 .FirstOrDefaultAsync(o => o.OrderId == orderId);
        }

        // --- TRIỂN KHAI CHỨC NĂNG MỚI ---

        public async Task<Order?> UpdateOrderShippingInfoAsync(int orderId, OrderUpdateDto orderDto)
        {
            var existingOrder = await _context.Orders.FindAsync(orderId);
            if (existingOrder == null)
            {
                return null;
            }

            // Chỉ cập nhật các thông tin liên quan đến vận chuyển
            existingOrder.RequiredDate = orderDto.RequiredDate ?? existingOrder.RequiredDate;
            existingOrder.ShippedDate = orderDto.ShippedDate ?? existingOrder.ShippedDate;
            existingOrder.ShipVia = orderDto.ShipVia ?? existingOrder.ShipVia;
            existingOrder.Freight = orderDto.Freight ?? existingOrder.Freight;
            existingOrder.ShipName = orderDto.ShipName ?? existingOrder.ShipName;
            existingOrder.ShipAddress = orderDto.ShipAddress ?? existingOrder.ShipAddress;
            existingOrder.ShipCity = orderDto.ShipCity ?? existingOrder.ShipCity;
            existingOrder.ShipRegion = orderDto.ShipRegion ?? existingOrder.ShipRegion;
            existingOrder.ShipPostalCode = orderDto.ShipPostalCode ?? existingOrder.ShipPostalCode;
            existingOrder.ShipCountry = orderDto.ShipCountry ?? existingOrder.ShipCountry;

            await _context.SaveChangesAsync();
            return existingOrder;
        }

        public async Task<bool> CancelOrderAsync(int orderId)
        {
            var orderToDelete = await _context.Orders
                .Include(o => o.OrderDetails) // Phải lấy cả chi tiết đơn hàng để xoá
                .FirstOrDefaultAsync(o => o.OrderId == orderId);

            if (orderToDelete == null)
            {
                return false;
            }

            // CẢNH BÁO: Xoá cứng một đơn hàng là một hành động nguy hiểm và thường không được khuyến khích
            // trong các hệ thống thực tế vì làm mất dữ liệu lịch sử.
            // Một cách tiếp cận tốt hơn là thêm một trường 'Status' vào bảng Order và cập nhật nó
            // thành 'Cancelled'.

            // Xoá các bản ghi OrderDetail liên quan trước
            _context.OrderDetails.RemoveRange(orderToDelete.OrderDetails);
            // Sau đó xoá bản ghi Order chính
            _context.Orders.Remove(orderToDelete);

            await _context.SaveChangesAsync();
            return true;
        }

    }
}
