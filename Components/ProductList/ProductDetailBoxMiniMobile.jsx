import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import {REACT_APP_IMAGE_URL} from '@env';


const ProductDetailBoxMiniMobile = ({
  cartItems = [],
  setCartItems = () => {},
  selectedWeight = {},
  setSelectedWeight = () => {},
  onQuantityChange = () => {},
  onRemove = () => {},
  fetchOrders = () => {},
}) => {
   const [toasts, setToasts] = useState([]);
   const backendUrl = REACT_APP_IMAGE_URL 
  

  // Group products by productName-size-variantType
  const groupedProducts = cartItems.reduce((groups, item) => {
    const key = `${item.productName}-${item.size}-${item.variantType}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
    return groups;
  }, {});

  const getDisplayColor = (item) => {
    return item.colorName || item.color || item.colour || item.colorCode || 'Default Color';
  };

  const handleChangeWeight = (id, value) => {
    setSelectedWeight((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
  };

  const handleIncrease = (variantId, currentQty) => {
    const newQty = currentQty + 1;
    onQuantityChange(variantId, newQty);
  };

  const handleDecrease = (variantId, currentQty) => {
    if (currentQty > 1) {
      const newQty = currentQty - 1;
      onQuantityChange(variantId, newQty);
    }
  };

  const handleRemoveFromCart = async (variantId) => {
    try {
      await onRemove(variantId);
      setCartItems((prev) => prev.filter(item => item.variantId !== variantId));
      setToasts([{ message: "Item removed from cart!", type: "success" }]);
      fetchOrders();
    } catch (error) {
      setToasts([{ message: "Failed to remove item from cart!", type: "error" }]);
    }
    setTimeout(() => setToasts([]), 3000);
  };

  return (
    <View style={{ padding: 10 }}>
      {Object.entries(groupedProducts).map(([groupKey, groupItems]) => {
        if (!groupItems.length) return null;
        const firstItem = groupItems[0];
        const totalQuantityKg = groupItems.reduce((sum, item) => {
          const weight = selectedWeight[item.variantId] || 10;
          return sum + (item?.quantity || 0) * weight;
        }, 0);
        const totalPrice = groupItems.reduce((sum, item) => {
          const weight = selectedWeight[item.variantId] || 10;
          return sum + (item?.price || 0) * (item?.quantity || 0) * weight;
        }, 0);

        return (
          <View key={groupKey} style={styles.groupCard}>
            {/* Header */}
            <View style={styles.headerRow}>
              <Image
                source={{ uri: `${backendUrl}${firstItem.productImage?.[0] || ''}` }}
                style={styles.headerImage}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{firstItem.productName}</Text>
                <Text style={styles.productInfo}>
                  {firstItem.size} • {firstItem.variantType.toLowerCase()} • {groupItems.length} colors
                </Text>
                <Text style={styles.pricePerKg}>
                  ₹{Math.round(firstItem.price)} per kg
                </Text>
              </View>
            </View>
            {/* Color Variants */}
            {groupItems.map((item) => {
              const weight = selectedWeight[item.variantId] || 10;
              const totalPriceForItem = item.price * item.quantity * weight;
              return (
              <View key={item.variantId} style={styles.variantCard}>
                  <View style={styles.variantHeader}>
                    <View style={styles.colorCircle}>
                      <Image
                        source={{ uri: `${backendUrl}${item.colorImage}` }}
                        style={styles.colorImage}
                      />
                    </View>
                    <Text style={styles.colorName}>{getDisplayColor(item)}</Text>
                    <Text style={styles.hexCode}>{item.hexCode?.toUpperCase()}</Text>
                    <TouchableOpacity
                      onPress={() => handleRemoveFromCart(item.variantId)}
                      style={styles.removeBtn}
                    >
                      <Icon name="close" size={24} color="#D7263D" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.variantControls}>
                   <Picker
                    selectedValue={weight}
                    style={styles.picker}
                    onValueChange={(value) => handleChangeWeight(item.variantId, value)}
                    >
                    <Picker.Item label="10kg" value={10} color="#000" />
                    <Picker.Item label="25kg" value={25} color="#000" />
                    <Picker.Item label="50kg" value={50} color="#000" />
                    </Picker>

                    <View style={styles.qtyControls}>
                      <TouchableOpacity
                        onPress={() => handleDecrease(item.variantId, item.quantity)}
                        disabled={item.quantity <= 1}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{weight * item.quantity} Kg</Text>
                      <TouchableOpacity
                        onPress={() => handleIncrease(item.variantId, item.quantity)}
                        style={styles.qtyBtn}
                      >
                        <Text style={styles.qtyBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.variantPrice}>
                      ₹{totalPriceForItem.toFixed(0)}
                    </Text>
                  </View>
                </View>
              );
            })}
            {/* Group Total */}
            <View style={styles.groupTotalRow}>
              <Text style={styles.groupTotalText}>Total ({totalQuantityKg}kg):</Text>
              <Text style={styles.groupTotalPrice}>₹{totalPrice.toFixed(0)}</Text>
            </View>
          </View>
        );
      })}
      {/* Toast Notification */}
      {toasts.map((toast, idx) => (
        <View key={idx} style={[styles.toast, toast.type === 'success' ? styles.toastSuccess : styles.toastError]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  groupCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 16,
    padding: 12,
  },
  headerRow: { flexDirection: 'row', marginBottom: 10 },
  headerImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  productName: { fontWeight: 'bold', fontSize: 18, color: '#222' },
  productInfo: { fontSize: 14, color: '#555', marginTop: 2 },
  pricePerKg: { fontSize: 15, color: '#222', marginTop: 4 },
  variantCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
  },
  variantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  colorCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  colorImage: { width: '100%', height: '100%' },
  colorName: { fontWeight: 'bold', fontSize: 14, marginRight: 8 },
  hexCode: { fontSize: 13, color: '#555', marginRight: 8 },
  removeBtn: { marginLeft: 'auto' },
  variantControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    width: 70,
    height: 30,
    backgroundColor: '#fff',
    color: '#000', // 👈 fixes invisible text
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: { fontSize: 18, color: '#222' },
  qtyText: { fontWeight: 'bold', fontSize: 15, marginHorizontal: 8 },
  variantPrice: { fontWeight: 'bold', fontSize: 16, color: '#222', width: 70, textAlign: 'right' },
  groupTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupTotalText: { fontSize: 16, fontWeight: '500' },
  groupTotalPrice: { fontSize: 17, fontWeight: 'bold', color: '#6D28D9' },
  toast: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
    borderRadius: 8,
    zIndex: 999,
    minWidth: 120,
  },
  toastText: { color: '#fff', fontWeight: 'bold' },
  toastSuccess: { backgroundColor: '#4ADE80' },
  toastError: { backgroundColor: '#F87171' },
});

export default ProductDetailBoxMiniMobile;