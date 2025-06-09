import { useState, useEffect } from "react";

export const useCart = () => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem("food_order_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Không thể đọc giỏ hàng từ sessionStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem("food_order_cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Không thể lưu giỏ hàng vào sessionStorage", error);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.productId === product.productId
      );
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === product.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
    alert(`${product.productName} đã được thêm vào giỏ hàng!`);
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartItemCount,
  };
};
