import axios from 'axios';
import { APP_BASE_URL } from '@env';

const API_BASE_URL = `${APP_BASE_URL}/customer`

export const loginCustomer = async (loginId, password) => {
  if (!loginId || !password) {
    return {
      success: false,
      message: "Login ID and password are required.",
    };
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      loginId,
      password,
    });

    if (response.data.status === "SUCCESS") {
      return {
        success: true,
        data: response.data.data,
        message: response.data.message,
      };
    } else {
      return {
        success: false,
        message: response.data.message,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed. Please try again.",
    };
  }
};


export const forgotPassword = async (customerData) => {
  try {
    const response = await axios.post(`${APP_BASE_URL}/password/forgot-password`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    throw error;
  }
};


export const otpSend = async (customerData) => {
  try {
    const response = await axios.post(`${APP_BASE_URL}/otp/send`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error sending otp:", error);
    throw error;
  }
};



export const otpVerify = async (customerData) => {
  try {
    const response = await axios.post(`${APP_BASE_URL}/otp/verify`, customerData);
    return response.data;
  } catch (error) {
    console.error("Error sending otp:", error);
    throw error;
  }
};
