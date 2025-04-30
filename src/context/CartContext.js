// (directory path: /src/context/CartContext.js)
import React, { createContext, useState, useEffect } from "react";

// Create cart context
export const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or as an empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update localStorage whenever the cart changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add an item to the cart
  const addToCart = (movie) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.imdbID === movie.imdbID
      );

      if (existingItem) {
        // Increase quantity if already in cart
        return prevItems.map((item) =>
          item.imdbID === movie.imdbID
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Add new item with quantity 1 and generated price
        return [
          ...prevItems,
          { ...movie, quantity: 1, price: generatePrice(movie) },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (imdbID) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.imdbID !== imdbID)
    );
  };

  // Update item quantity manually
  const updateQuantity = (imdbID, quantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.imdbID === imdbID ? { ...item, quantity } : item
      )
    );
  };

  // Clear all items in cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total price of cart
  const getTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  // Get total item count
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Price generator utility
  const generatePrice = (movie) => {
    let price = 9.99;

    if (movie.Year >= 2020) {
      price = 19.99; // New releases
    } else if (movie.Year >= 2010) {
      price = 14.99; // Recent movies
    } else if (movie.Year >= 2000) {
      price = 12.99; // 2000s
    } else if (movie.Year >= 1990) {
      price = 9.99; // 90s
    } else {
      price = 7.99; // Classics
    }

    return Math.round(price * 100) / 100;
  };

  // Context value
  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
