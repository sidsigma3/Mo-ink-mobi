import axios from 'axios';
import { APP_BASE_URL } from '@env';

const URL =  APP_BASE_URL

const API_BASE_URL = URL + "/cart"


// Fetch Cart Items
export const getCart = async (customerId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${customerId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    throw error;
  }
};

// Add to Cart
export const addToCart = async (customerId, variantId, quantity) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/${customerId}/add/${variantId}/${quantity}`
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};


// Remove from Cart
export const removeFromCart = async (customerId, variantId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${customerId}/delete/${variantId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing from cart:", error);
    throw error;
  }
};
