import React, { useState, useMemo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // or other icon sets
import Toast from "../Toast/Toast"; // needs to be a React Native Toast

import { downloadCreditReceipt ,downloadInvoice } from "../../Service/InvoiceService";

const OrderBox = ({ order }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  const handleDownloadInvoice = async (orderId) => {
    const result = await downloadInvoice(orderId);
    if (!result.success) {
      showToast("Failed to download invoice.", "error");
    }
  };

  const handleDownloadCreditReceipt = async (orderId, type) => {
    try {
      await downloadCreditReceipt(orderId, type);
    } catch (error) {
      console.error("Failed to download credit receipt:", error);
    }
  };

  const calculatedAmounts = useMemo(() => {
    const orderVariants = order.orderVariantResponse || [];
    const activeVariants = orderVariants.filter(
      (variant) => variant.status !== "CANCELLED" && variant.status !== "RETURNED"
    );

    const totalWeight = orderVariants.reduce((sum, item) => sum + Number(item.orderWeight || 0), 0);
    const activeWeight = activeVariants.reduce((sum, item) => sum + Number(item.orderWeight || 0), 0);

    const totalCancelledItems = orderVariants.filter((item) => item.status === "CANCELLED").length;
    const totalReturnedItems = orderVariants.filter((item) => item.status === "RETURNED").length;

    let adjustedNetPay = 0;
    let refundAdjustedWalletUsed = 0;

    if (activeVariants.length > 0) {
      const activeItemsDiscountedPrice = activeVariants.reduce((sum, item) => {
        const itemPrice = Number(item.discountedPrice || item.finalPrice || item.price || 0);
        return sum + itemPrice;
      }, 0);

      let discountedPriceOfActiveItems = activeItemsDiscountedPrice;

      if (activeItemsDiscountedPrice === 0 && activeWeight > 0 && totalWeight > 0) {
        const totalOrderValue = Number(order.totalAmount || order.totalCost || 0);
        const totalDiscount = Number(order.totalDiscount || 0);
        const totalDiscountedPrice = totalOrderValue - totalDiscount;
        const activeWeightRatio = activeWeight / totalWeight;
        discountedPriceOfActiveItems = totalDiscountedPrice * activeWeightRatio;
      }

      const totalGST = Number(order.gstAmount || 0);
      const gstForActiveItems = totalWeight > 0 ? (totalGST * activeWeight) / totalWeight : 0;

      const totalPlatformFees = Number(order.platformFees || 0);
      const platformFeesForActiveItems =
        totalWeight > 0 ? (totalPlatformFees * activeWeight) / totalWeight : 0;

      const totalHandlingCharges = Number(order.handlingCharges || 0);
      const handlingChargesForActiveItems =
        totalWeight > 0 ? (totalHandlingCharges * activeWeight) / totalWeight : 0;

      const totalWalletUsed = Number(order.walletUsed || 0);
      const inactiveWeight = totalWeight - activeWeight;
      const refundAdjustmentRatio = totalWeight > 0 ? inactiveWeight / totalWeight : 0;
      refundAdjustedWalletUsed = totalWalletUsed * (1 - refundAdjustmentRatio);

      adjustedNetPay =
        discountedPriceOfActiveItems +
        gstForActiveItems +
        platformFeesForActiveItems +
        handlingChargesForActiveItems -
        refundAdjustedWalletUsed;

      adjustedNetPay = Math.max(0, adjustedNetPay);
    }

    return {
      adjustedNetPay: Math.round(adjustedNetPay * 100) / 100,
      totalWeight,
      activeWeight,
      totalCancelledItems,
      totalReturnedItems,
      activeVariants: activeVariants.length,
      totalVariants: orderVariants.length,
      refundAdjustedWalletUsed: Math.round(refundAdjustedWalletUsed * 100) / 100,
    };
  }, [order]);

  const orderDateObj = new Date(order.createdAt);
  const estimatedDeliveryDateObj = new Date(orderDateObj);
  estimatedDeliveryDateObj.setDate(orderDateObj.getDate() + 18);
  const estimatedDeliveryDate = estimatedDeliveryDateObj.toDateString();

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <Image
        source={{
          uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/unur73unur73unur.png?updatedAt=1748863098691",
        }}
        style={styles.image}
      />

      {/* Order Info */}
      <View style={styles.info}>
        <Text>Order ID: <Text style={styles.bold}>{order.orderId}</Text></Text>
        <Text>Total: ₹{calculatedAmounts.adjustedNetPay}</Text>
        <Text>Weight: {calculatedAmounts.activeWeight} Kg</Text>
        <Text style={{ color: "green" }}>
          Delivery expected before {estimatedDeliveryDate}
        </Text>

        {/* Rating placeholder */}
        <View style={styles.ratingRow}>
          {[...Array(5)].map((_, i) => (
            <Icon key={i} name="star-border" size={20} color="gray" />
          ))}
        </View>
      </View>

      {/* Status Tags */}
      <View>
        {calculatedAmounts.totalReturnedItems > 0 && (
          <Text style={styles.statusReturned}>
            Returned ({calculatedAmounts.totalReturnedItems} items)
          </Text>
        )}
        {calculatedAmounts.totalCancelledItems > 0 && (
          <Text style={styles.statusCancelled}>
            Cancelled ({calculatedAmounts.totalCancelledItems} items)
          </Text>
        )}
        {calculatedAmounts.adjustedNetPay === 0 &&
          calculatedAmounts.totalCancelledItems === calculatedAmounts.totalVariants && (
            <Text style={styles.statusRefunded}>Fully Refunded</Text>
          )}
      </View>

      {/* Action Buttons */}
      <View>
        {(order.status === "SHIPPED" ||
          order.status === "DELIVERED" ||
          order.status === "RETURNED") && (
          <TouchableOpacity
            onPress={() => handleDownloadInvoice(order.orderId)}
            style={styles.invoiceButton}
          >
            <Icon name="description" size={20} color="purple" />
            <Text>Order Invoice</Text>
          </TouchableOpacity>
        )}

        {order.cancelCreditReceiptGenerated === "true" && (
          <TouchableOpacity
            onPress={() => handleDownloadCreditReceipt(order.orderId, "cancelled")}
            style={styles.cancelButton}
          >
            <Icon name="description" size={20} color="red" />
            <Text>Cancel Receipt</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Toast */}
      {toasts.map((toast, index) => (
        <Toast
          key={index}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts((prev) => prev.filter((_, i) => i !== index))}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 6,
  },
  info: {
    marginTop: 8,
  },
  bold: {
    fontWeight: "bold",
  },
  ratingRow: {
    flexDirection: "row",
    marginTop: 4,
  },
  statusReturned: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    padding: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  statusCancelled: {
    backgroundColor: "#FEE2E2",
    color: "#B91C1C",
    padding: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  statusRefunded: {
    backgroundColor: "#E5E7EB",
    color: "#374151",
    padding: 6,
    borderRadius: 6,
    marginTop: 6,
  },
  invoiceButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#EDE9FE",
    borderRadius: 6,
    marginTop: 8,
  },
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    backgroundColor: "#FEE2E2",
    borderRadius: 6,
    marginTop: 8,
  },
});

export default OrderBox;
