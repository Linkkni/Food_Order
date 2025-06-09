// Các using cần thiết
using Microsoft.EntityFrameworkCore;
using food_order_web_app.Data; // Hoặc food_order_web_app.Data
using food_order_web_app.Service; // Hoặc food_order_web_app.Service
using Microsoft.EntityFrameworkCore.Sqlite;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// --- 1. Cấu hình CORS ---
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("*") // Cho phép mọi nguồn
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// --- 2. Đăng ký các dịch vụ (Dependency Injection) ---
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Đăng ký DbContext với AddScoped và cấu hình UseSqlite bên trong

// Đăng ký DbContext bằng AddDbContext. Đây là cách làm đúng và tiêu chuẩn.
builder.Services.AddDbContext<ApiDbContext>(options =>
{
    options.UseSqlite(connectionString);
});

// Đăng ký các Service
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IOrderService, OrderService>();
// LƯU Ý: Tên lớp triển khai của bạn là 'CustomerServiece' (thừa chữ 'e'), hãy đảm bảo nó nhất quán
// Từ:

// Sửa thành:
builder.Services.AddScoped<ICustomerService, CustomerServiec>();

builder.Services.AddControllers().AddJsonOptions(options =>
{
    // Cấu hình này sẽ yêu cầu trình chuyển đổi JSON bỏ qua các vòng lặp tham chiếu
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- 3. Xây dựng ứng dụng ---
var app = builder.Build();

// --- 4. Cấu hình HTTP request pipeline ---
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// THÊM DÒNG NÀY ĐỂ KÍCH HOẠT CORS
app.UseCors(MyAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();