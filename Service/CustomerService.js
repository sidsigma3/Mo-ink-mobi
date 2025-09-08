import axios from 'axios';
import { APP_BASE_URL } from '@env';

const BASE_URL = `${APP_BASE_URL}/customer`

export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(BASE_URL, customerData);
    return response.data;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

export const getCustomerDetails = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${customerId}`);
    return response.data; // Return the fetched customer data
  } catch (error) {
    console.error("Error fetching customer details:", error);
    throw error;
  }
};


export const updateCustomerDetails = async (customerId, updatedData) => {
    try {
      await axios.put(`${BASE_URL}/${customerId}`, updatedData);
      return true;
    } catch (error) {
      console.error("Error updating customer details:", error);
      throw error;
    }
  };


  export const deleteCustomerAddress = async (customerId, addressId) => {
    try {
      await axios.delete(`${BASE_URL}/${customerId}/address/${addressId}`);
      return true;
    } catch (error) {
      console.error("Error deleting customer address:", error);
      throw error;
    }
  };


export const loginCustomer = async (loginId, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, { loginId, password });

    if (response.data.status === "SUCCESS") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Login failed. Please try again." };
  }
};


export const getWalletTransactions = async (customerId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${customerId}/wallet`);
    return response.data.data; // Returns the `data` array from the API response
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    throw error;
  }
};
