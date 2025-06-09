import React, { useState } from "react";
import { Trash2, Plus, Minus } from "lucide-react";
import { API } from "../services/api";
import Message from "../components/common/Message";

const CartPage = ({ cart, updateQuantity, removeFromCart, clearCart }) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState({
    text: "",
    type: "info",
  });

  const total = cart.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const handleCheckout = async (event) => {
    event.preventDefault();

    if (cart.length === 0) {
      setCheckoutMessage({
        text: "Giỏ hàng trống, không thể đặt hàng.",
        type: "error",
      });
      return;
    }

    setIsCheckingOut(true);
    setCheckoutMessage({ text: "Đang xử lý đơn hàng...", type: "info" });

    const formData = new FormData(event.target);
    const orderData = {
      customerId: formData.get("customerId"),
      employeeId: 1, // Giả định EmployeeId là 1
      shipName: formData.get("shipName"),
      shipAddress: formData.get("shipAddress"),
      shipCity: formData.get("shipCity"),
      shipCountry: formData.get("shipCountry"),
      shipPostalCode: formData.get("shipPostalCode"),
      items: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(API.createOrder(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi từ phía máy chủ.");
      }

      const createdOrder = await response.json();
      setCheckoutMessage({
        text: `Đặt hàng thành công! Mã đơn hàng của bạn là #${createdOrder.orderId}.`,
        type: "success",
      });
      clearCart();
      event.target.reset();
    } catch (error) {
      setCheckoutMessage({ text: `Lỗi: ${error.message}`, type: "error" });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Giỏ Hàng Của Bạn</h1>
      {cart.length === 0 ? (
        <Message text="Giỏ hàng của bạn đang trống." type="info" />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li key={item.productId} className="flex items-center py-4">
                  <div className="flex-grow">
                    <p className="font-bold text-lg">{item.productName}</p>
                    <p className="text-gray-600">
                      {item.unitPrice.toLocaleString("vi-VN")} VNĐ
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="w-32 text-right font-semibold text-lg">
                    {(item.quantity * item.unitPrice).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </p>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="ml-4 text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-4 border-t flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-red-500 hover:underline"
              >
                Xóa tất cả
              </button>
              <p className="text-2xl font-bold">
                Tổng cộng: {total.toLocaleString("vi-VN")} VNĐ
              </p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Thông tin giao hàng</h2>
            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label
                  htmlFor="customerId"
                  className="block font-semibold mb-1"
                >
                  Mã khách hàng*
                </label>
                <input
                  type="text"
                  id="customerId"
                  name="customerId"
                  required
                  className="w-full p-2 border rounded"
                  placeholder="Vd: ALFKI"
                />
              </div>
              <div>
                <label htmlFor="shipName" className="block font-semibold mb-1">
                  Tên người nhận*
                </label>
                <input
                  type="text"
                  id="shipName"
                  name="shipName"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="shipAddress"
                  className="block font-semibold mb-1"
                >
                  Địa chỉ giao hàng*
                </label>
                <input
                  type="text"
                  id="shipAddress"
                  name="shipAddress"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label htmlFor="shipCity" className="block font-semibold mb-1">
                  Thành phố*
                </label>
                <input
                  type="text"
                  id="shipCity"
                  name="shipCity"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="shipPostalCode"
                  className="block font-semibold mb-1"
                >
                  Mã bưu điện
                </label>
                <input
                  type="text"
                  id="shipPostalCode"
                  name="shipPostalCode"
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="shipCountry"
                  className="block font-semibold mb-1"
                >
                  Quốc gia*
                </label>
                <input
                  type="text"
                  id="shipCountry"
                  name="shipCountry"
                  required
                  className="w-full p-2 border rounded"
                />
              </div>
              <button
                type="submit"
                disabled={isCheckingOut}
                className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded hover:bg-green-600 transition-colors disabled:bg-gray-400"
              >
                {isCheckingOut ? "Đang xử lý..." : "Xác nhận & Đặt Hàng"}
              </button>
            </form>
            {checkoutMessage.text && (
              <Message
                text={checkoutMessage.text}
                type={checkoutMessage.type}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
