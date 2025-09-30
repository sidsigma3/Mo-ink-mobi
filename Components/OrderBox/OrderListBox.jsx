import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { fetchProductsById } from '../../Service/ProductService';
import { updateOrderVariantStatuses } from '../../Service/OrderService';
import { downloadCreditReceipt } from '../../Service/InvoiceService';
import ReturnModal from '../Modal/ReturnModal';
import Toast from '../Toast/Toast'; 
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { Fonts } from '../../Utils/Fonts';
const statusOptions = {
  NEW: "New Order",
  CANCELLED: "Cancelled",
  CONFIRMED: "Confirmed",
  MANUFACTURING: "Manufactured",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  RETURNED: "Returned",
  RETURN_REQUESTED: "Return Requested",
  RETURN_REJECTED: "Return Rejected",
};

const statusStyleMap = {
  NEW: { backgroundColor: '#DBEAFE', color: '#2563EB' },
  CONFIRMED: { backgroundColor: '#ECFCCB', color: '#65A30D' },
  SHIPPED: { backgroundColor: '#FEF3C7', color: '#CA8A04' },
  MANUFACTURING: { backgroundColor: '#EDE9FE', color: '#7C3AED' },
  DELIVERED: { backgroundColor: '#D1FADF', color: '#16A34A' },
  CANCELLED: { backgroundColor: '#FEE2E2', color: '#DC2626' },
  RETURNED: { backgroundColor: '#F3F4F6', color: '#6B7280' },
  RETURN_REQUESTED: { backgroundColor: '#FFEDD5', color: '#EA580C' },
  RETURN_REJECTED: { backgroundColor: '#FCE7F3', color: '#DB2777' },
};

const OrderListBox = ({ item, status, orderId }) => {
  const [productName, setProductName] = useState("Product");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [returnRequested, setReturnRequested] = useState(item.status === 'RETURN_REQUESTED');
  const [pricePerKg, setPricePerKg] = useState(0);
  const [gstRate, setGstRate] = useState(0);
  const [productImage, setProductImage] = useState();
  const [toasts, setToasts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const backendUrl = process.env.REACT_APP_IMAGE_URL
  const weight = parseFloat(item.orderWeight) || 0;

  useEffect(() => {
    const fetchProductData = async () => {
      const res = await fetchProductsById(item.productId);
      if (res.success) {
        const product = res.data;
        setProductName(product.productName);
        setGstRate(Number(product.gstOnProduct) || 0);
        setProductImage(product.productImage);

        const matchedVariant = product.variants.find(
          (v) =>
            v.size === item.size &&
            v.color?.id === item.color?.id &&
            (item.variantType ? v.variantType === item.variantType : true)
        );
        setPricePerKg(matchedVariant?.pricePerKg || 0);
      }
    };
    if (item?.productId) {
      fetchProductData();
    }
  }, [item.productId]);

  const baseCost = weight * pricePerKg;

  const handleConfirmReturn = async ({ reason, comment, returnWeight }) => {
    const showToast = (message, type = "error") => {
      setToasts([{ message, type }]);
      setTimeout(() => setToasts([]), 3000);
    };
    try {
      await updateOrderVariantStatuses(orderId, {
        orderVariantId: item.orderVariantId,
        status: "RETURN_REQUESTED",
        reason,
        returnWeight,
        remark: comment || "Customer initiated return",
      });
      setReturnRequested(true);
      showToast("Return request submitted successfully!", "success");
    } catch (error) {
      showToast("Failed to submit return request", "error");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleDownloadCreditReceipt = async (orderId, type, orderVariantId) => {
    try {
      await downloadCreditReceipt(orderId, type, orderVariantId);
      Alert.alert("Success", "Credit receipt downloaded.");
    } catch (error) {
      Alert.alert("Error", "Failed to download credit receipt.");
    }
  };

  const getImageByVariantType = (variantType) => {
    if (!productImage || productImage.length === 0) return '';
    const match = productImage.find((url) =>
      url.includes(variantType.toLowerCase())
    );
    return match || '';
  };

  const statusStyle = statusStyleMap[item.status] || { backgroundColor: '#F3F4F6', color: '#222' };

  return (
    <View style={styles.box}>
      {/* Product Image */}
      <View style={styles.imageSection}>
        <Image
          source={{ uri: `${backendUrl}${item.color?.colorImage}` }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Product Info */}
      <View style={styles.infoSection}>
        <Text style={styles.productTitle}>
          {productName} - {item.size} - {item.variantType?.toLowerCase()}
        </Text>
        <Text style={styles.colorText}>{item.color?.colorName}</Text>
        <Text style={styles.colorCode}>{item.color?.colorCode?.toUpperCase()}</Text>
        {/* Mobile Status */}
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
          <Text style={[styles.statusText, { color: statusStyle.color }]}>
            {statusOptions[item.status]}
          </Text>
        </View>
      </View>

      {/* Pricing and Return Button */}
      <View style={styles.priceSection}>
        <Text style={styles.price}>₹{baseCost.toFixed(0)}</Text>
        <Text style={styles.weight}>Wt: {weight}Kg</Text>
        {returnRequested && (
          <View style={styles.returnRequestedBadge}>
            <View style={styles.returnDot} />
            <Text style={styles.returnRequestedText}>Return Requested</Text>
          </View>
        )}
        {status === 'DELIVERED' && item.status !== 'RETURNED' && item.status !== 'CANCELLED' && (
          <TouchableOpacity
            style={[
              styles.returnBtn,
              returnRequested ? styles.returnBtnDisabled : null
            ]}
            onPress={() => {
              if (!returnRequested) setIsModalOpen(true);
            }}
            disabled={returnRequested}
          >
            <Icon name="undo" size={24} color={returnRequested ? "#ccc" : "#6D28D9"} />
          </TouchableOpacity>
        )}
      </View>

      {/* Return Receipt Button */}
      {item.status === 'RETURNED' && (
        <TouchableOpacity
          style={styles.receiptBtn}
          onPress={() => handleDownloadCreditReceipt(orderId, "returned", item.orderVariantId)}
        >
          <Icon name="file-document-outline" size={20} color="#16A34A" />
          <Text style={styles.receiptText}>Return Receipt</Text>
        </TouchableOpacity>
      )}

      {/* Return Modal */}
      <ReturnModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmReturn}
        weight={item.orderWeight}
      />

      {/* Toast Notification */}
      {toasts.map((toast, idx) => (
        <Toast
          key={idx}
          message={toast.message}
          type={toast.type}
          onClose={() => setToasts([])}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  
  box: {
    
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    elevation: 2,
    alignItems: 'center',
    minHeight: 110,
    position: 'relative',
  
  },
  imageSection: {
    
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  image: {
    
    width: 64,
    height: 64,
    borderRadius: 10,
  
  },
  infoSection: {
    
    flex: 1,
    justifyContent: 'center',
  
  },
  productTitle: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 2,
  },
  colorText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  colorCode: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#888',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statusBadge: {
    
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 6,
  
  },
  statusText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    fontWeight: 'bold',
  },
  priceSection: {
    
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  
  },
  price: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#7C3AED',
  },
  weight: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: '#555',
    fontWeight: '500',
    marginBottom: 2,
  },
  returnRequestedBadge: {
    
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 6,
  
  },
  returnDot: {
    
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E42',
    marginRight: 6,
  
  },
  returnRequestedText: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: '#CA8A04',
    fontWeight: 'bold',
  },
  returnBtn: {
    
    marginTop: 8,
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#EDE9FE',
  
  },
  returnBtnDisabled: {
    
    backgroundColor: '#f3f3f3',
  
  },
  receiptBtn: {
    
    position: 'absolute',
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FADF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  
  },
  receiptText: {
    fontFamily: Fonts.bold,
    marginLeft: 6,
    color: '#16A34A',
    fontWeight: 'bold',
    fontSize: 14,
  },

});

export default OrderListBox;