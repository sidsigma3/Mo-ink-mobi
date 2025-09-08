import axios from 'axios';
import { APP_BASE_URL } from '@env';

const PAYMENT_API_URL = `${APP_BASE_URL}/payment`;

// Initiate Razorpay payment for an order
export const initiatePayment = async (orderId) => {
  try {
    const response = await axios.post(`${PAYMENT_API_URL}/initiate/${orderId}`);
    return response.data; // Contains payment details like order_id, key_id etc.
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
};


