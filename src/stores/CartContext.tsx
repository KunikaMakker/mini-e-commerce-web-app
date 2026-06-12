import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, CartContextType } from "../types";

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "mini_eshop_cart_items";

const readStoredCart = (): CartItem[] => {
  try {
    const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch (error) {
    console.error("Failed to parse cart items from localStorage:", error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => readStoredCart());
  const [isCartOpen, setCartOpen] = useState(false);

  // update localStorage when state changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart items to localStorage:", error);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (newItem: Omit<CartItem, "id">) => {
    const id = `${newItem.productId}-${newItem.color}-${newItem.size}`;
    
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === id);

      if (existingIdx > -1) {
        // verify stock limits, if the item still exist
        const existingItem = prevCart[existingIdx];
        const updatedQty = existingItem.quantity + newItem.quantity;
        const finalQty = Math.min(updatedQty, newItem.stockLimit);

        const updatedCart = [...prevCart];
        updatedCart[existingIdx] = {
          ...existingItem,
          quantity: finalQty,
        };
        return updatedCart;
      } else {
        const finalQty = Math.min(newItem.quantity, newItem.stockLimit);
        if (finalQty <= 0) return prevCart; // Can't add sold out!
        
        return [...prevCart, { ...newItem, id, quantity: finalQty }];
      }
    });

    // Auto-open the cart drawer when item is added so the customer sees the reaction
    setCartOpen(true);
  };

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  // Update item quantity in the cart drawer
  const updateQuantity = (itemId: string, newQty: number) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === itemId) {
            const finalQty = Math.min(Math.max(1, newQty), item.stockLimit);
            return { ...item, quantity: finalQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartTotal = cartSubtotal; // we can also add tax and shipping charges later on

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        isCartOpen,
        setCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
