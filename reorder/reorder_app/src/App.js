import React, { useState } from "react";
import { ShoppingCart, UtensilsCrossed } from "lucide-react";

// Custom Hook
import { useCart } from "./hooks/useCart";

// Pages
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import OrderHistoryPage from "./pages/OrderHistoryPage";

// Main App Component
const App = () => {
  const [page, setPage] = useState("home"); // 'home', 'cart', 'orders'
  const {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
  } = useCart();

  const renderPage = () => {
    switch (page) {
      case "cart":
        return (
          <CartPage
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
          />
        );
      case "orders":
        return <OrderHistoryPage />;
      case "home":
      default:
        return <HomePage onAddToCart={addToCart} />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setPage("home")}
          >
            <UtensilsCrossed size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold ml-2 text-gray-800">
              Món Ngon Tại Nhà
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPage("home")}
              className={`font-semibold hover:text-blue-600 transition-colors ${
                page === "home" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Thực Đơn
            </button>
            <button
              onClick={() => setPage("orders")}
              className={`font-semibold hover:text-blue-600 transition-colors ${
                page === "orders" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              Lịch sử đơn hàng
            </button>
            <button
              onClick={() => setPage("cart")}
              className="relative flex items-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-full hover:bg-blue-600 transition-colors"
            >
              <ShoppingCart size={20} />
              <span className="ml-2">Giỏ hàng</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </header>

      <main>{renderPage()}</main>

      <footer className="bg-gray-800 text-white mt-8 py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 Món Ngon Tại Nhà. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
