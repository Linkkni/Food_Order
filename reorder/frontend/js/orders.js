// js/orders.js

document.addEventListener("DOMContentLoaded", () => {
  const lookupForm = document.getElementById("lookup-form");
  const customerIdInput = document.getElementById("lookup-customerId");
  const orderHistorySection = document.getElementById("order-history");

  const displayOrders = (orders) => {
    orderHistorySection.innerHTML = "<h2>Kết quả</h2>"; // Reset

    if (!orders || orders.length === 0) {
      orderHistorySection.innerHTML +=
        "<p>Không tìm thấy đơn hàng nào cho khách hàng này.</p>";
      return;
    }

    orders.forEach((order) => {
      const orderDiv = document.createElement("div");
      orderDiv.className = "order-summary";

      const orderDate = new Date(order.orderDate).toLocaleDateString("vi-VN");
      let total = 0;

      let itemsHtml = "<ul>";
      order.orderDetails.forEach((detail) => {
        total += detail.quantity * detail.unitPrice;
        itemsHtml += `<li>${detail.product.productName} - Số lượng: ${detail.quantity}</li>`;
      });
      itemsHtml += "</ul>";

      orderDiv.innerHTML = `
                <h3>Đơn hàng #${order.orderId} - Ngày đặt: ${orderDate}</h3>
                <p><strong>Giao đến:</strong> ${order.shipName}, ${
        order.shipAddress
      }</p>
                <p><strong>Tổng tiền:</strong> ${total.toLocaleString(
                  "vi-VN"
                )} VNĐ</p>
                <h4>Chi tiết:</h4>
                ${itemsHtml}
            `;
      orderHistorySection.appendChild(orderDiv);
    });
  };

  const fetchOrders = async (customerId) => {
    orderHistorySection.innerHTML =
      "<h2>Kết quả</h2><p>Đang tải đơn hàng...</p>";
    try {
      const response = await fetch(API_ENDPOINTS.customerOrders(customerId));
      if (!response.ok) {
        throw new Error(
          "Không thể tải lịch sử đơn hàng. Mã khách hàng có thể không đúng."
        );
      }
      const orders = await response.json();
      displayOrders(orders);
    } catch (error) {
      orderHistorySection.innerHTML = `<h2>Kết quả</h2><p class="error">${error.message}</p>`;
    }
  };

  lookupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const customerId = customerIdInput.value.trim();
    if (customerId) {
      // Cập nhật URL để người dùng có thể bookmark
      const url = new URL(window.location);
      url.searchParams.set("customerId", customerId);
      window.history.pushState({}, "", url);

      fetchOrders(customerId);
    }
  });

  // Tự động tải nếu có customerId trong URL
  const params = new URLSearchParams(window.location.search);
  const customerIdFromUrl = params.get("customerId");
  if (customerIdFromUrl) {
    customerIdInput.value = customerIdFromUrl;
    fetchOrders(customerIdFromUrl);
  }
});
