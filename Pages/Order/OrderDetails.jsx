import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, FlatList, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { fetchProductsById } from '../../Service/ProductService';
import { downloadCreditReceipt,downloadInvoice } from '../../Service/InvoiceService';
import { getDiscountById } from '../../Service/DiscountService';
import { sendCodOrderById, getCodOrderById } from '../../Service/OrderService';
import { addToCart, getCart, removeFromCart } from '../../Service/CartService';
import TimelineComponent from '../../Components/TimelineComponent/TimelineComponent';
import OrderListBox from '../../Components/OrderBox/OrderListBox';
import PaymentModal from '../../Components/Modal/PaymentModal';
import ModalConfirmReplaceCart from '../../Components/Modal/ModalConfirmReplaceCart';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import HeroSection from '../../Components/HeroSection/HeroSection';
import BottomNav from '../../Components/BottomNav/BottomNav';

import { Fonts } from '../../Utils/Fonts';
const paymentDescriptions = {
  "100%": "100% Online Payment",
  "50%": "50% Online + 50% COD",
  "30%": "30% Online + 70% COD",
  "25%": "25% Online + 75% COD",
  "0%": "0% Online + 100% COD",
};

const paymentDiscountMap = {
  "100%": 1.5,
  "50%": 0.5,
  "30%": 0.3,
  "25%": 0.5,
  "0%": 0,
};

const OrderDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const order = route.params?.order || {};
  const customer = route.params?.customer || {};
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const walletAmount = order?.payment?.walletAmount || 0;
  const cancelRefundAmount = order?.payment?.cancelRefundAmount || 0;
  const walletDeduction = walletAmount > cancelRefundAmount ? walletAmount - cancelRefundAmount : 0;
  const platformFees = 0;

  useEffect(() => {
    const fetchPaymentHistory = async (orderId) => {
      try {
        const res = await getCodOrderById(orderId);
        const codTransactions = res.data?.paymentCodTransactions || [];
        const formattedTransactions = codTransactions.map((tx, index) => ({
          srNo: index + 1,
          transactionId: tx.razorpayReferenceId,
          date: tx.paidAt ? new Date(tx.paidAt).toLocaleString() : "N/A",
          paymentMode: tx.razorpayOrderId ? "Online Payment Link" : "Cash",
          amountCollected: tx.amountPaid || 0,
          remainingAmount: tx.remainingAmount ?? 0,
          status: tx.status || (tx.remainingAmount === 0 ? "Completed" : "Pending"),
        }));
        setPaymentHistory(formattedTransactions);
      } catch (error) {
        setPaymentHistory([]);
      }
    };

    if (order?.orderId) {
      fetchPaymentHistory(order?.orderId);
    }
  }, [order?.orderId]);

  useEffect(() => {
    const fetchDiscount = async () => {
      if (order?.discountId) {
        try {
          const coupon = await getDiscountById(order.discountId);
          setAppliedCoupon(coupon.data);
        } catch (err) {
          setAppliedCoupon(null);
        }
      }
    };
    fetchDiscount();
  }, [order?.discountId]);

  const calculateHandlingCharges = (cartItems, shippingAddressString) => {
    if (!shippingAddressString) return 0;
    const parts = shippingAddressString.split(",") || [];
    const state = parts.length >= 3 ? parts[parts.length - 3]?.trim().toLowerCase() : "";
    if (!state) return 0;
    const ratePerKg = state === "odisha" ? 3 : 5;
    const totalWeight = cartItems.reduce((acc, item) => {
      if (item.status === 'CANCELLED') return acc;
      const weight = Number(item.orderWeight) || 0;
      return acc + weight;
    }, 0);
    return Number((totalWeight * ratePerKg).toFixed(2));
  };

  const handlingCharges = calculateHandlingCharges(order.orderVariantResponse || [], order.shippingAddress);

  const calculateOrderSummary = async (
    order,
    appliedCoupon = null,
    handlingCharges = 0,
    platformFees = 0
  ) => {
    const orderVariants = (order.orderVariantResponse || []).filter(
      (variant) => variant.status !== 'CANCELLED'
    );
    let baseTotal = 0;
    let discountByCoupon = 0;
    let discountByPayment = 0;
    let gstAmount = 0;
    let totalWeight = 0;
    const productDataMap = new Map();
    const itemCosts = [];
    for (const variant of orderVariants) {
      const weight = Number(variant.orderWeight) || 0;
      const { productId, size, color, variantType } = variant;
      const colorId = color?.id;
      let pricePerKg = 0;
      if (productDataMap.has(productId)) {
        const cachedProduct = productDataMap.get(productId);
        const matchedVariant = cachedProduct.variants.find(
          (v) => v.size === size && v.color?.id === colorId && v.variantType === variantType
        );
        pricePerKg = matchedVariant?.pricePerKg || 0;
      } else {
        const res = await fetchProductsById(productId);
        if (res.success) {
          const product = res.data;
          productDataMap.set(productId, product);
          const matchedVariant = product.variants.find(
            (v) => v.size === size && v.color?.id === colorId && v.variantType === variantType
          );
          pricePerKg = matchedVariant?.pricePerKg || 0;
        }
      }
      const cost = weight * pricePerKg;
      baseTotal += cost;
      totalWeight += weight;
      itemCosts.push({
        variant,
        cost,
        gstRate: productDataMap.get(productId)?.gstOnProduct || 0,
      });
    }
    const couponDiscountValue = Number(appliedCoupon?.discountValue) || 0;
    const couponDiscountType = appliedCoupon?.discountType || 'Percentage';
    let discountAllowed = true;
    if (appliedCoupon?.minPurchaseRequirement?.includes('Minimum purchase amount')) {
      const match = appliedCoupon.minPurchaseRequirement.match(/\₹\s?(\d+)/);
      const minAmount = match ? Number(match[1]) : 0;
      discountAllowed = baseTotal >= minAmount;
    } else if (appliedCoupon?.minPurchaseRequirement?.includes('Minimum quantity required')) {
      const match = appliedCoupon.minPurchaseRequirement.match(/(\d+)/);
      const minQty = match ? Number(match[1]) : 0;
      discountAllowed = totalWeight >= minQty;
    }
    let couponDiscountAmount = 0;
    if (discountAllowed) {
      if (couponDiscountType === 'Percentage') {
        couponDiscountAmount = (baseTotal * couponDiscountValue) / 100;
      } else if (couponDiscountType === 'FixedAmount') {
        couponDiscountAmount = couponDiscountValue;
      }
    }
    const subtotalAfterCoupon = baseTotal - couponDiscountAmount;
    const paymentDiscountPercent = paymentDiscountMap[order.paymentTypeDiscount] || 0;
    const paymentDiscountAmount = (subtotalAfterCoupon * paymentDiscountPercent) / 100;
    const finalTotal = subtotalAfterCoupon - paymentDiscountAmount;
    discountByCoupon = couponDiscountAmount;
    discountByPayment = paymentDiscountAmount;
    const totalDiscount = discountByCoupon + discountByPayment;
    for (const { cost, gstRate } of itemCosts) {
      let discountedPrice = cost;
      if (discountAllowed) {
        if (couponDiscountType === 'Percentage') {
          const combinedPercent =
            couponDiscountValue +
            paymentDiscountPercent -
            (couponDiscountValue * paymentDiscountPercent) / 100;
          discountedPrice = cost - (cost * combinedPercent) / 100;
        } else if (couponDiscountType === 'FixedAmount') {
          const itemShare = (cost / baseTotal) * couponDiscountAmount;
          const afterCoupon = cost - itemShare;
          const paymentDiscount = (afterCoupon * paymentDiscountPercent) / 100;
          discountedPrice = afterCoupon - paymentDiscount;
        }
      } else {
        discountedPrice = cost - (cost * paymentDiscountPercent) / 100;
      }
      const gstForItem = (discountedPrice * gstRate) / 100;
      gstAmount += gstForItem;
    }
    const netPayable = finalTotal + gstAmount + handlingCharges + platformFees;
    const walletAmount = order?.payment?.walletAmount || 0;
    const cancelRefundAmount = order?.payment?.cancelRefundAmount || 0;
    const walletUsed =
      Number(walletAmount > cancelRefundAmount ? walletAmount - cancelRefundAmount : 0).toFixed(0) ||
      0;
    const adjustedNetPay = netPayable - walletUsed;
    const online = Number(order.paymentTypeDiscount?.replace('%', '')) || 0;
    const cod = 100 - online;
    const onlinePay = (adjustedNetPay * online) / 100;
    const codPay = adjustedNetPay - onlinePay;
    return {
      totalCost: baseTotal,
      discountByCoupon,
      discountByPayment,
      totalDiscount,
      finalTotal,
      gstAmount,
      netPayable,
      adjustedNetPay,
      walletUsed,
      online,
      cod,
      onlinePay,
      codPay,
      combinedDiscountPercent:
        couponDiscountType === 'Percentage'
          ? discountAllowed
            ? couponDiscountValue +
              paymentDiscountPercent -
              (couponDiscountValue * paymentDiscountPercent) / 100
            : paymentDiscountPercent
          : discountAllowed && baseTotal > 0
          ? Number(((couponDiscountAmount + discountByPayment) / baseTotal) * 100)
          : paymentDiscountPercent,
    };
  };

  useEffect(() => {
    const fetchSummary = async () => {
      const summaryData = await calculateOrderSummary(order, appliedCoupon, handlingCharges, platformFees);
      setSummary(summaryData);
      setLoading(false);
    };
    fetchSummary();
  }, [order, appliedCoupon, handlingCharges]);

  if (loading || !summary) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6D28D9" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const {
    totalCost,
    gstAmount,
    discountByCoupon,
    discountByPayment,
    totalDiscount,
    finalTotal,
    netPayable,
    adjustedNetPay,
    walletUsed,
    online,
    cod,
    onlinePay,
    codPay,
    combinedDiscountPercent,
  } = summary;

  const orderDateObj = new Date(order.createdAt);
  const orderDate = orderDateObj.toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
    timeZone: "Asia/Kolkata",
  });

  const estimatedDeliveryDateObj = new Date(orderDateObj);
  estimatedDeliveryDateObj.setDate(orderDateObj.getDate() + 18);
  const estimatedDeliveryDate = estimatedDeliveryDateObj.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getStateFromBillingAddress = (billingAddress) => {
    try {
      const beforePin = billingAddress.split("PIN:")[0];
      const parts = beforePin.split(",").map(p => p.trim()).filter(Boolean);
      const state = parts[parts.length - 1]?.toLowerCase();
      return state;
    } catch (err) {
      return "";
    }
  };

  const billingState = getStateFromBillingAddress(order?.billingAddress);
  const isOdisha = billingState?.toLowerCase() === "odisha";

  let balanceDueAmount;
  if (paymentHistory.length > 0) {
    const lastTransaction = paymentHistory[paymentHistory.length - 1];
    balanceDueAmount = lastTransaction.remainingAmount;
  } else {
    balanceDueAmount = (order?.payment?.pendingAmount || 0) - (order?.payment?.totalAdjustedAmount || 0);
  }
  const hasPaymentHistory = paymentHistory.length > 0;

  const handleDownloadInvoice = async (orderId) => {
    const result = await downloadInvoice(orderId);
    if (!result.success) {
      Alert.alert("Error", "Failed to download invoice.");
    }
  };

  const handleDownloadCreditReceipt = async (orderId, type) => {
    try {
      await downloadCreditReceipt(orderId, type);
    } catch (error) {
      Alert.alert("Error", "Failed to download credit receipt.");
    }
  };

  const handleBuyAgain = async (orderToBuy) => {
    const customerId = customer?.customerId;
    if (!customerId || !orderToBuy?.orderVariantResponse?.length) return;
    try {
      const cartResponse = await getCart(customerId);
      const cartItems = cartResponse?.cartItems || cartResponse?.data?.cartItems || [];
      if (cartItems.length > 0) {
        setPendingOrder(orderToBuy);
        setShowConfirmModal(true);
        return;
      }
      await proceedWithBuyAgain(orderToBuy);
    } catch (err) {
      Alert.alert("Error", "Something went wrong.");
    }
  };

  const proceedWithBuyAgain = async (orderToBuy) => {
    const customerId = customer?.customerId;
    try {
      const cartResponse = await getCart(customerId);
      const cartItems = cartResponse?.cartItems || cartResponse?.data?.cartItems || [];
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        await Promise.all(
          cartItems.map((item) =>
            removeFromCart(customerId, item.variantId)
          )
        );
      }
      for (const item of orderToBuy.orderVariantResponse) {
        const { productId, size, color, variantType, orderWeight } = item;
        const res = await fetchProductsById(productId);
        if (!res.success) continue;
        const product = res.data;
        const matchedVariant = product.variants.find(
          (v) =>
            v.size === size &&
            v.color?.id === color?.id &&
            (!variantType || v.variantType === variantType)
        );
        if (!matchedVariant) continue;
        await addToCart(customerId, matchedVariant.id, 1);
      }
      Alert.alert("Success", "All items added to cart!");
    } catch (err) {
      Alert.alert("Error", "Failed to add items to cart.");
    }
  };

  const handleModalConfirm = () => {
    setShowConfirmModal(false);
    if (pendingOrder) {
      proceedWithBuyAgain(pendingOrder);
      setPendingOrder(null);
    }
  };

  const handleModalCancel = () => {
    setShowConfirmModal(false);
    setPendingOrder(null);
  };

  const handlePayNow = () => {
    setShowPaymentModal(true);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
  };

  const handlePaymentInitiate = async (paymentData) => {
    try {
      const paymentRequestData = {
        orderId: order.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        customerDetails: paymentData.customerDetails
      };
      await sendCodOrderById(order.orderId, paymentData.amount);
      Alert.alert("Success", "Payment link sent to your number");
      handleClosePaymentModal();
    } catch (error) {
      Alert.alert("Error", "Failed to initiate payment. Please try again.");
      setShowPaymentModal(false);
    }
  };

    const breadcrumbs = [
    { label: "Home", link: "/home" },
    { label: "Account", link: "/account" },
    { label: "Orders", link: "/orders" },
    { label: "Order Details", link: "/orderDetails" },
  ];


  return (
    <View style={{flex: 1, backgroundColor: '#F8FAFC'}}>
     
    <ScrollView style={styles.container}>
           <NavbarHeader></NavbarHeader>
        <HeroSection productName={"Order Details"}  breadcrumbs={breadcrumbs}></HeroSection>
      <View style={styles.section}>
        <Text style={styles.title}>Order ID: {order.orderId}</Text>
        <Text style={styles.subtitle}>Order date: <Text style={styles.bold}>{orderDate}</Text></Text>
        <Text style={styles.subtitle}>Estimated delivery: <Text style={styles.bold}>{estimatedDeliveryDate}</Text></Text>
      </View>

      <View style={styles.section}>
        <TimelineComponent orderStatus={order.status} />
      </View>

      <View style={styles.section}>
        <FlatList
          data={order?.orderVariantResponse}
          keyExtractor={(_, idx) => `variant-${idx}`}
          renderItem={({ item }) => (
            <OrderListBox item={item} status={order.status} orderId={order.orderId} />
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <Text>{paymentDescriptions[order.paymentTypeDiscount]}</Text>
        <Text style={styles.sectionTitle}>Billing Address</Text>
        <Text>{order.billingAddress}</Text>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text>{order.shippingAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}><Text>Total Cost</Text><Text>₹{(totalCost).toFixed(0)}</Text></View>
        <View style={styles.summaryRow}><Text>Total Discount</Text><Text>- ₹{totalDiscount.toFixed(0)}</Text></View>
        <View style={styles.summaryRow}><Text>Final Cost</Text><Text>₹{Math.round(finalTotal)}</Text></View>
        {isOdisha ? (
          <>
            <View style={styles.summaryRow}><Text>CGST</Text><Text>₹{(gstAmount / 2).toFixed(0)}</Text></View>
            <View style={styles.summaryRow}><Text>SGST</Text><Text>₹{(gstAmount / 2).toFixed(0)}</Text></View>
          </>
        ) : (
          <View style={styles.summaryRow}><Text>IGST</Text><Text>₹{(gstAmount).toFixed(0)}</Text></View>
        )}
        <View style={styles.summaryRow}><Text>Handling Charges</Text><Text>₹{handlingCharges}</Text></View>
        <View style={styles.summaryRow}><Text>Platform Fees</Text><Text>₹{platformFees}</Text></View>
        <View style={styles.summaryRow}><Text>Net Pay</Text><Text>₹{Math.round(netPayable).toLocaleString()}</Text></View>
        <View style={styles.summaryRow}><Text>Wallet</Text><Text>- ₹{walletDeduction.toFixed(0) || 0}</Text></View>
        <View style={styles.summaryRow}><Text>To pay</Text><Text>₹{Math.round(adjustedNetPay).toLocaleString()}</Text></View>
        <View style={styles.summaryRow}><Text>Advance Paid ({online}%)</Text><Text>₹{order?.payment?.totalAmountPaid?.toFixed(0) || 0}</Text></View>
        <View style={styles.summaryRow}><Text>Balance Due ({cod}%)</Text><Text>₹{balanceDueAmount || 0}</Text></View>
      </View>

      {/* Payment History */}
      {hasPaymentHistory && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          <FlatList
            data={paymentHistory}
            keyExtractor={(_, idx) => `payment-${idx}`}
            renderItem={({ item }) => (
              <View style={styles.paymentRow}>
                <Text>Txn: {item.transactionId}</Text>
                <Text>Date: {item.date}</Text>
                <Text>Type: {item.paymentMode}</Text>
                <Text>Amount: ₹{item.amountCollected.toFixed(0)}</Text>
                <Text>Remaining: ₹{item.remainingAmount.toFixed(0)}</Text>
              </View>
            )}
          />
        </View>
      )}

      {/* Pay Now Button */}
      {balanceDueAmount > 0 && (
        <TouchableOpacity style={styles.payBtn} onPress={handlePayNow}>
          <Text style={styles.payBtnText}>Pay Now</Text>
        </TouchableOpacity>
      )}

      {/* Buy Again Button */}
      <TouchableOpacity style={styles.buyAgainBtn} onPress={() => handleBuyAgain(order)}>
        <Text style={styles.buyAgainText}>Buy Again</Text>
      </TouchableOpacity>

      {/* Modals */}
      <ModalConfirmReplaceCart
        isOpen={showConfirmModal}
        onCancel={handleModalCancel}
        onConfirm={handleModalConfirm}
      />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handleClosePaymentModal}
        orderDetails={order}
        balanceDue={balanceDueAmount}
        onPaymentInitiate={handlePaymentInitiate}
      />
    </ScrollView>
    <BottomNav></BottomNav>
    </View>
  );
};

const styles = StyleSheet.create({
  
  container: {
     flex: 1, backgroundColor: '#F8FAFC', padding: 16 ,marginBottom:100
  },
  loadingContainer: {
     flex: 1, justifyContent: 'center', alignItems: 'center' 
  },
  loadingText: {
    fontFamily: Fonts.regular,
    marginTop: 12, fontSize: 16, color: '#6D28D9'
  },
  section: {
     marginBottom: 24 
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 22, fontWeight: 'bold', color: '#6D28D9', marginBottom: 8
  },
  subtitle: {
    fontFamily: Fonts.regular,
    fontSize: 16, color: '#555', marginBottom: 4
  },
  bold: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold', color: '#222'
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 6
  },
  summaryRow: {
     flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 
  },
  paymentRow: {
     padding: 8, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8 
  },
  payBtn: {
    
    backgroundColor: '#F59E42',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  
  },
  payBtnText: {
    fontFamily: Fonts.bold,
    color: '#fff', fontWeight: 'bold', fontSize: 16
  },
  buyAgainBtn: {
    
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 12,
  
  },
  buyAgainText: {
    fontFamily: Fonts.bold,
    color: '#fff', fontWeight: 'bold', fontSize: 16
  },

});

export default OrderDetails;