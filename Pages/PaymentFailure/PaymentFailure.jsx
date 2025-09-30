import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from "react-native";
import { CreditCard, ArrowRight } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { updateOrderStatuses } from "../../Service/OrderService";
import { initiatePayment } from "../../Service/PaymentService";
import { removeFromCart } from "../../Service/CartService";
import { useAppContext } from "../../Utils/AppContext";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import BottomNav from "../../Components/BottomNav/BottomNav";

import { Fonts } from '../Utils/Fonts';
const PaymentFailure = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { updateCartAndWishlistCounts } = useAppContext();

  const [toasts, setToasts] = useState([]);
  const [retryCount, setRetryCount] = useState(route.params?.retryCount || 0);

  const orderId = route.params?.orderId;
  const customerId = route.params?.customerId;
  const selectedCartItems = route.params?.selectedCartItems || [];
  const onlinePay = route.params?.onlinePay;
  const codPay = route.params?.codPay;
  const customer = route.params?.customer;

  const showToast = (message, type = "error") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const handleRetryPayment = async () => {
    if (retryCount >= 2) return;
    setRetryCount(retryCount + 1);

    try {
      const paymentData = await initiatePayment(orderId);
      const { razorpayOrderId } = paymentData.data;

      if (!razorpayOrderId || paymentData.status !== "SUCCESS") {
        showToast("Failed to get valid Razorpay order", "error");
        return;
      }

      // Navigate to Razorpay screen
      navigation.navigate("RazorpayCheckoutScreen", {
        razorpayOrderId,
        amount: Number(onlinePay.toFixed(0)),
        customer,
        onSuccess: async () => {
          try {
            await updateOrderStatuses(orderId, { status: "NEW" });

            await Promise.all(
              selectedCartItems.map((item) =>
                removeFromCart(customerId, item.variantId)
              )
            );

            updateCartAndWishlistCounts();
            navigation.navigate("PaymentSuccess");
          } catch (err) {
            console.error("Post-payment flow failed:", err);
            showToast("Payment succeeded but post-processing failed.", "error");
            navigation.navigate("PaymentFail");
          }
        },
        onFailure: (errMessage) => {
          console.error("Payment failed:", errMessage);
          showToast("Payment failed. Please try again.", "error");
          navigation.navigate("PaymentFail");
        },
      });
    } catch (error) {
      console.error("Order creation failed:", error);
      showToast("Failed to retry payment", "error");
    }
  };

  const handlePlaceAsCOD = async () => {
    try {
    console.log(orderId,'orderId')
      await updateOrderStatuses(orderId, { status: "NEW" });

      await Promise.all(
        selectedCartItems.map((item) =>
          removeFromCart(customerId, item.variantId)
        )
      );

      updateCartAndWishlistCounts();
      navigation.navigate("Order");
    } catch (error) {
      console.error("Order creation failed:", error);
      showToast("Failed to place as COD", "error");
    }
  };

  const handleCloseOrder = async () => {
    try {
      await updateOrderStatuses(orderId, { status: "FAILED" });
      navigation.navigate("Home");
    } catch (err) {
      console.error(err);
      showToast("Failed to close order", "error");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Scrollable container */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <Image
          source={require("../../assets/Images/Card-Declined.png")}
          style={styles.image}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Oh no! Your transaction failed</Text>

        {/* Message */}
        <Text style={styles.message}>
          The payment failed due to a technical error. It happens, just try again
          now, or after a couple of minutes. If the error persists, please{" "}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL("mailto:support@example.com")}
          >
            write to our support
          </Text>
          , and we will help.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.codButton} onPress={handlePlaceAsCOD}>
            <Text style={styles.buttonText}>Place as COD</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRetryPayment}
            disabled={retryCount >= 2}
            style={[
              styles.retryButton,
              retryCount >= 2 && styles.disabledButton,
            ]}
          >
            <CreditCard size={20} color="#fff" />
            <Text style={styles.buttonText}>Retry Payment</Text>
            <ArrowRight size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Close button */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseOrder}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
        <Cta></Cta>
        <Footer></Footer>
      </ScrollView>

      {/* Toasts */}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <View
            key={toast.id}
            style={[
              styles.toast,
              toast.type === "error" && styles.errorToast,
              toast.type === "success" && styles.successToast,
            ]}
          >
            <Text style={styles.toastText}>{toast.message}</Text>
          </View>
        ))}
      </View>
      <BottomNav></BottomNav>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
    
    alignItems: "center",
    padding: 20,
  
  },
  image: {
    
    width: 120,
    height: 120,
    marginBottom: 20,
  
  },
  title: {
    fontFamily: Fonts.semiBold,
    fontSize: 22,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 20,
  },
  link: {
    fontFamily: Fonts.medium,
    color: "#7C3AED",
    fontWeight: "500",
  },
  buttonGroup: {
    
    width: "100%",
    marginTop: 10,
    gap: 10,
  
  },
  codButton: {
    
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F97316",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 10,
  
  },
  retryButton: {
    
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#7C3AED",
    paddingVertical: 12,
    borderRadius: 8,
  
  },
  disabledButton: {
    
    opacity: 0.5,
  
  },
  closeButton: {
    
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  
  },
  closeText: {
    fontFamily: Fonts.medium,
    color: "#333",
    fontWeight: "500",
  },
  buttonText: {
    fontFamily: Fonts.medium,
    color: "#fff",
    fontWeight: "500",
    marginHorizontal: 8,
  },
  toastContainer: {
    
    position: "absolute",
    top: 40,
    right: 20,
    left: 20,
    alignItems: "center",
  
  },
  toast: {
    
    padding: 10,
    borderRadius: 6,
    marginVertical: 4,
  
  },
  errorToast: {
    
    backgroundColor: "#F87171",
  
  },
  successToast: {
    
    backgroundColor: "#4ADE80",
  
  },
  toastText: {
    fontFamily: Fonts.medium,
    color: "#fff",
    fontWeight: "500",
  },

});

export default PaymentFailure;
