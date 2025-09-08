import axios from 'axios';
import { APP_BASE_URL } from '@env';

const API_BASE_URL = `${APP_BASE_URL}/product`


export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    if (response.data.status === "SUCCESS") {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to fetch products." };
  }
};
