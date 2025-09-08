import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWishlist } from "../Service/WishlistService";
import { getCart } from "../Service/CartService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(null);
  const [wishlistCount, setWishlistCount] = useState(null);

  const updateCartAndWishlistCounts = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      const customerId = JSON.parse(userData)?.customerId;

      if (!customerId) return;

      const [wishlistResponse, cartResponse] = await Promise.all([
        getWishlist(customerId),
        getCart(customerId),
      ]);

      const wishlistItems = wishlistResponse?.variantIds || [];
      const cartItems = cartResponse?.cartItems || [];

      // Save to AsyncStorage
      await AsyncStorage.setItem(
        "wishlistItems",
        JSON.stringify(wishlistItems)
      );
      await AsyncStorage.setItem("cartItems", JSON.stringify(cartItems));

      // Update state
      setWishlistCount(wishlistItems.length);
      setCartCount(cartItems.length);
    } catch (error) {
      console.error("Failed to fetch cart or wishlist", error);
    }
  };

  useEffect(() => {
    updateCartAndWishlistCounts();
  }, []);

  return (
    <AppContext.Provider
      value={{
        cartCount,
        setCartCount,
        wishlistCount,
        setWishlistCount,
        updateCartAndWishlistCounts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
