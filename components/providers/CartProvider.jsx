"use client";

import { createContext, useContext } from "react";

export const CartContext = createContext({});

function CartProvider() {
  return <CartContext.Provider value={{}}></CartContext.Provider>;
}

export default CartProvider;

export const useCartContext = () => useContext(CartContext);
