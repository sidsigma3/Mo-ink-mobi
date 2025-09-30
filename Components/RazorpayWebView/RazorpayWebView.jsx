import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRoute, useNavigation } from "@react-navigation/native";
import { updateOrderStatuses } from "../../Service/OrderService";
import { removeFromCart } from "../../Service/CartService";
import { useAppContext } from "../../Utils/AppContext";
import Toast from "../Toast/Toast";

import { Fonts } from '../../Utils/Fonts';
const RazorpayWebView = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [checkoutHtml, setCheckoutHtml] = useState("");
  const [toasts, setToasts] = useState([]);

  // ✅ params from navigation
  const {
    razorpayOrderId,
    amount,
    customer,
    orderId,
    selectedCartItems = [],
  } = route.params || {};

  // ✅ context helpers
  const { updateCartAndWishlistCounts } = useAppContext();

  // ✅ your Razorpay key (must be defined in app config/env)
  const razorpayKey = process.env.RAZORPAY_CLIENT_KEY;


  useEffect(() => {
    if (!razorpayOrderId || !amount || !razorpayKey) return;

    // Build Razorpay checkout HTML
    const htmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  </head>
  <body>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        var options = {
          "key": "${razorpayKey}",
          "amount": "${amount * 100}",  
          "currency": "INR",
          "name": "Mo ink and Dye",
          "description": "Order Payment",
          "order_id": "${razorpayOrderId}",
          "prefill": {
            "name": "${customer?.customerName || ""}",
            "email": "${customer?.email || ""}",
            "contact": "${customer?.phoneNumber || ""}"
          },
          "theme": { "color": "#3399cc" },
          "handler": function (response){
            window.ReactNativeWebView.postMessage(JSON.stringify({ success: true, response }));
          },
          "modal": {
            "ondismiss": function(){
              window.ReactNativeWebView.postMessage(JSON.stringify({ success: false, message: "Payment Cancelled" }));
            }
          }
        };
        var rzp = new Razorpay(options);
        rzp.open();
      });
    </script>
  </body>
</html>`;
    setCheckoutHtml(htmlContent);
  }, [razorpayOrderId, amount, customer, razorpayKey]);

  if (!checkoutHtml) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  return (
    <>
      <WebView
        originWhitelist={["*"]}
        source={{ html: checkoutHtml }}
        onMessage={async (event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.success) {
              // ✅ Payment success → update order + clear cart
              try {
                await updateOrderStatuses(orderId, { status: "NEW" });

                if (Array.isArray(selectedCartItems) && selectedCartItems.length > 0) {
                  await Promise.all(
                    selectedCartItems.map((item) =>
                      removeFromCart(customer?.customerId, item.variantId)
                    )
                  );
                }

                updateCartAndWishlistCounts();
                navigation.replace("PaymentSuccess", { orderId });
              } catch (err) {
                console.error("Post-payment flow failed:", err);
                showToast("Payment succeeded but post-processing failed.", "error");
                navigation.replace("PaymentFail", { orderId });
              }
            } else {
              // ❌ Payment failed/cancelled
              console.error("Payment failed:", data.message);
              showToast("Payment failed. Please try again.", "error");
              navigation.replace("PaymentFail", { orderId });
            }
          } catch (e) {
            console.error("Error parsing Razorpay response:", e);
            showToast("Payment Failed", "error");
            navigation.replace("PaymentFail", { orderId });
          }
        }}
      />

      {toasts.map((t, i) => (
        <Toast key={i} message={t.message} type={t.type} />
      ))}
    </>
  );
};

export default RazorpayWebView;

const styles = StyleSheet.create({
  
  loader: {
    
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  
  },

});
