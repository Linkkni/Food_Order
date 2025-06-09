namespace food_order_web_app.DTOs
{
    public class CreateOrderRequestDto
    {
        public string CustomerId { get; set; }
        public int? EmployeeId { get; set; }
        public required string ShipName { get; set; }
        public required string ShipAddress { get; set; }
        public required string ShipCity { get; set; }
        public string? ShipRegion { get; set; }
        public required string ShipPostalCode { get; set; }
        public required string ShipCountry { get; set; }
        public List<CartItemDto> Items { get; set; } = new List<CartItemDto>();

    }
}
