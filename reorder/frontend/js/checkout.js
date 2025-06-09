// js/checkout.js

document.addEventListener("DOMContentLoaded", () => {
  const cartItemsTbody = document.getElementById("cart-items-tbody");
  const cartTotalSpan = document.getElementById("cart-total");
  const checkoutForm = document.getElementById("checkout-form");
  const formMessageDiv = document.getElementById("form-message");

  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const displayCart = async () => {
    cartItemsTbody.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
      cartItemsTbody.innerHTML =
        '<tr><td colspan="5">Giỏ hàng của bạn đang trống.</td></tr>';
      cartTotalSpan.textContent = "0";
      return;
    }

    for (const item of cart) {
      // Lấy thông tin chi tiết của từng sản phẩm
      const product = await getProductDetails(item.productId);
      if (product) {
        const itemTotal = item.quantity * product.unitPrice;
        total += itemTotal;

        const tr = document.createElement("tr");
        tr.innerHTML = `
                    <td>${product.productName}</td>
                    <td>
                        <input type="number" value="${
                          item.quantity
                        }" min="1" class="quantity-input" data-product-id="${
          item.productId
        }">
                    </td>
                    <td>${product.unitPrice.toLocaleString("vi-VN")} VNĐ</td>
                    <td>${itemTotal.toLocaleString("vi-VN")} VNĐ</td>
                    <td><button class="remove-btn" data-product-id="${
                      item.productId
                    }">Xóa</button></td>
                `;
        cartItemsTbody.appendChild(tr);
      }
    }
    cartTotalSpan.textContent = total.toLocaleString("vi-VN");
  };

  const getProductDetails = async (productId) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.products}/${productId}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      return null;
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const item = cart.find((item) => item.productId === productId);
    if (item) {
      item.quantity = newQuantity;
      if (item.quantity <= 0) {
        // Nếu số lượng <= 0 thì xóa
        removeItem(productId);
      } else {
        saveCartAndRedraw();
      }
    }
  };

  const removeItem = (productId) => {
    cart = cart.filter((item) => item.productId !== productId);
    saveCartAndRedraw();
  };

  const saveCartAndRedraw = () => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
  };

  cartItemsTbody.addEventListener("change", (e) => {
    if (e.target.classList.contains("quantity-input")) {
      const productId = parseInt(e.target.dataset.productId);
      const newQuantity = parseInt(e.target.value);
      updateQuantity(productId, newQuantity);
    }
  });

  cartItemsTbody.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const productId = parseInt(e.target.dataset.productId);
      removeItem(productId);
    }
  });

  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    formMessageDiv.textContent = "";

    if (cart.length === 0) {
      formMessageDiv.textContent = "Giỏ hàng trống, không thể đặt hàng.";
      formMessageDiv.className = "error";
      return;
    }

    const formData = new FormData(checkoutForm);
    const orderRequest = {
      customerId: formData.get("customerId"),
      // Trong thực tế, EmployeeId sẽ được xác định ở backend hoặc từ session của nhân viên
      employeeId: 1,
      shipName: formData.get("shipName"),
      shipAddress: formData.get("shipAddress"),
      shipCity: formData.get("shipCity"),
      shipCountry: formData.get("shipCountry"),
      // Các trường khác như ShipRegion, ShipPostalCode có thể thêm vào nếu cần
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(API_ENDPOINTS.orders, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderRequest),
      });

      if (response.ok) {
        const createdOrder = await response.json();
        formMessageDiv.textContent = `Đặt hàng thành công! Mã đơn hàng của bạn là: ${createdOrder.orderId}`;
        formMessageDiv.className = "success";

        // Xóa giỏ hàng sau khi đặt hàng thành công
        cart = [];
        sessionStorage.removeItem("cart");
        saveCartAndRedraw();
        checkoutForm.reset();

        // Chuyển hướng đến trang lịch sử đơn hàng sau vài giây
        setTimeout(() => {
          window.location.href = `orders.html?customerId=${orderRequest.customerId}`;
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Đã xảy ra lỗi khi đặt hàng.");
      }
    } catch (error) {
      formMessageDiv.textContent = `Lỗi: ${error.message}`;
      formMessageDiv.className = "error";
    }
  });

  // Hiển thị giỏ hàng khi tải trang
  displayCart();
});
