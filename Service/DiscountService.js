import axios from 'axios';
import { APP_BASE_URL } from '@env';

const BASE_URL = APP_BASE_URL + "/discount"; 


export const getAllDiscounts = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data; 
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};



export const getDiscountById = async (discountId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${discountId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching discounts:", error);
    throw error;
  }
};
