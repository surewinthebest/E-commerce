import React, { createContext, useContext } from "react";
import { useCart } from "../hooks/useCart";
import { Cart } from "../types";

interface CartContextType {
  cart: Cart | undefined;
  isLoading: boolean;
  isRefetching: boolean;
  refetch: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { cart, isLoading, isRefetching, refetch } = useCart();

  return (
    <CartContext.Provider value={{ cart, isLoading, isRefetching, refetch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};