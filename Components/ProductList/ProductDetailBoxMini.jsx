import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from "@react-native-picker/picker";

const ProductDetailBoxMini = ({
  productName,
  price,
  size,
  color,
  itemQuantity,
  variantId,
  isWishlist,
  onWishlistToggle,
  onCartToggle,
  hexCode,
  variantType,
  productImage,
  markupPrice,
  colorImage,
  colorCode,
  onRemove,
  selectedWeight,
  setSelectedWeight,
  isSelected = false,
  variants = [],
  showCart = true,
  onSelectChange = () => {},
  onQuantityChange = () => {},
  onVariantTypeChange = () => {},
}) => {
  const [quantity, setQuantity] = useState(itemQuantity || 1);
  const [isWishlisted, setIsWishlisted] = useState(isWishlist || false);
  const [isInCart, setIsInCart] = useState(true);

  useEffect(() => {
    setQuantity(itemQuantity);
  }, [itemQuantity]);

  const handleIncrease = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(variantId, newQty);
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      const newQty = quantity - 1;
      setQuantity(newQty);
      onQuantityChange(variantId, newQty);
    }
  };

  const handleRemove = async () => {
    try {
      await onRemove(variantId);
      Alert.alert('Success', 'Item removed from cart');
    } catch (err) {
      Alert.alert('Error', 'Failed to remove item');
    }
  };

  const handleWishlistClick = async () => {
    // Replace with your API logic
    setIsWishlisted(!isWishlisted);
    onWishlistToggle?.();
    onCartToggle?.();
    Alert.alert('Wishlist', isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onSelectChange(variantId)}
        >
          <Icon
            name={isSelected ? 'check-square' : 'square-o'}
            size={24}
            color="#6D28D9"
          />
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: colorImage || productImage }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.details}>
          <Text style={styles.productName}>
            {productName} <Text style={styles.dot}>•</Text> {size}
          </Text>
          <Text style={styles.colorText}>
            {color} <Text style={styles.dot}>•</Text> {hexCode?.toUpperCase()}
          </Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{Math.round(price)}</Text>
            <Text style={styles.markupPrice}>₹{Math.round(markupPrice)}</Text>
            <View style={styles.rating}>
              <Icon name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.weightPicker}>
              <Picker
                selectedValue={selectedWeight[variantId]}
                style={{ height: 40, width: 120 }}
                onValueChange={(itemValue) =>
                  setSelectedWeight((prev) => ({
                    ...prev,
                    [variantId]: Number(itemValue),
                  }))
                }
              >
                <Picker.Item label="10 Kg" value="10" />
                <Picker.Item label="25 Kg" value="25" />
                <Picker.Item label="50 Kg" value="50" />
              </Picker>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.row}>
            <Text style={styles.variantType}>{variantType}</Text>
            <TouchableOpacity
              onPress={handleWishlistClick}
              style={styles.wishlistBtn}
            >
              <Icon
                name="heart"
                size={20}
                color={isWishlisted ? "#D7263D" : "#6D28D9"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleRemove} style={styles.removeBtn}>
              <Icon name="trash" size={20} color="#888" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { margin: 10 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    padding: 10,
    alignItems: 'center',
  },
  checkbox: { position: 'absolute', top: 10, left: 10, zIndex: 2 },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 10,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { width: '100%', height: '100%' },
  details: { flex: 1 },
  productName: { fontWeight: 'bold', fontSize: 16 },
  dot: { fontSize: 18, color: '#888' },
  colorText: { fontSize: 14, color: '#555', marginTop: 2 },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  price: { color: '#6D28D9', fontWeight: 'bold', fontSize: 18 },
  markupPrice: { color: '#aaa', textDecorationLine: 'line-through', marginLeft: 8 },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    paddingHorizontal: 6,
    marginLeft: 10,
  },
  ratingText: { marginLeft: 4, color: '#FFD700', fontWeight: 'bold' },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 10 },
  weightPicker: { flex: 1 },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: 10,
  },
  qtyBtn: { padding: 6 },
  qtyBtnText: { fontSize: 18, color: '#555' },
  qtyText: { fontSize: 16, marginHorizontal: 8 },
  variantType: {
    backgroundColor: '#EDE9FE',
    color: '#6D28D9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
  },
  wishlistBtn: { marginLeft: 10 },
  removeBtn: { marginLeft: 10 },
});

export default ProductDetailBoxMini;