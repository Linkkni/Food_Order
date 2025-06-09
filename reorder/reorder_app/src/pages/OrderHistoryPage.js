import React, { useState } from "react";
import { API } from "../services/api";
import Spinner from "../components/common/Spinner";
import Message from "../components/common/Message";

const OrderHistoryPage = () => {
  const [customerId, setCustomerId] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setSearched(true);
    if (!customerId) {
      setError("Vui lòng nhập mã khách hàng.");
      return;
    }
    setLoading(true);
    setError(null);
    setOrders([]);

    try {
      const response = await fetch(API.getCustomerOrders(customerId));
      if (!response.ok) {
        throw new Error(
          "Không tìm thấy đơn hàng hoặc mã khách hàng không hợp lệ."
        );
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">Lịch Sử Đơn Hàng</h1>
        <form onSubmit={handleLookup} className="flex gap-2 mb-6">
          <input
            type="text"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value.toUpperCase())}
            placeholder="Nhập mã khách hàng (vd: ALFKI)"
            className="flex-grow p-2 border rounded-l"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Đang tìm..." : "Tìm kiếm"}
          </button>
        </form>

        {error && <Message text={error} />}
        {loading && <Spinner />}

        {!loading && !error && searched && orders.length === 0 && (
          <Message
            text="Không tìm thấy đơn hàng nào cho khách hàng này."
            type="info"
          />
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.orderId} className="border rounded-lg p-4">
                <div className="flex justify-between items-center border-b pb-2 mb-2">
                  <h3 className="font-bold text-lg">
                    Đơn hàng #{order.orderId}
                  </h3>
                  <p className="text-gray-600">
                    {new Date(order.orderDate).toLocaleDateString("vi-VN")}
                  </p>
                </div>
                <p>
                  <strong>Giao đến:</strong> {order.shipName},{" "}
                  {order.shipAddress}
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer font-semibold">
                    Xem chi tiết
                  </summary>
                  <ul className="mt-2 list-disc pl-5">
                    {order.orderDetails.map((detail) => (
                      <li key={detail.product.productId}>
                        {detail.product.productName} (x{detail.quantity}) -{" "}
                        {detail.unitPrice.toLocaleString("vi-VN")} VNĐ
                      </li>
                    ))}
                  </ul>
                </details>
                <p className="text-right font-bold text-lg mt-2">
                  Tổng cộng:{" "}
                  {order.orderDetails
                    .reduce(
                      (total, item) => total + item.quantity * item.unitPrice,
                      0
                    )
                    .toLocaleString("vi-VN")}{" "}
                  VNĐ
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
