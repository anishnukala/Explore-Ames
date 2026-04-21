// frontend/Context/CartContext.jsx
import React, { createContext, useContext, useState } from "react";

// internal context object
const CartContext = createContext(null);

// PROVIDER
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // add to cart (or bump quantity)
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) =>
          p.id === item.id
            ? { ...p, quantity: (p.quantity || 1) + (item.quantity || 1) }
            : p
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const increaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((p) =>
          p.id === id ? { ...p, quantity: (p.quantity || 1) - 1 } : p
        )
        .filter((p) => p.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((p) => p.id !== id));
  };

  const value = {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ✅ THIS is the hook Navbar / Shop / Cart should import
export function useCart() {
  return useContext(CartContext);
}