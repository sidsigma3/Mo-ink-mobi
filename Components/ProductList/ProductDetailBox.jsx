import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeartIcon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import { getCustomerDetails } from '../../Service/CustomerService';
import { addToWishlist ,getWishlist ,removeFromWishlist } from '../../Service/WishlistService';
import { addToCart,getCart ,removeFromCart } from '../../Service/CartService';
import { useNavigation } from '@react-navigation/native';

const ProductDetailBox = ({
  productName,
  price,
  size,
  color,
  markupPrice,
  itemQuantity,
  variantId,
  isWishlist,
  onWishlistToggle,
  onCartToggle,
  hexCode,
  variantType,
  imageUrl,
  colorImage,
  isWishlistPage = false,
  showCart = true,
}) => {
  const Navigation = useNavigation();
  const [isWishlisted, setIsWishlisted] = useState(isWishlist);
  const [isInCart, setIsInCart] = useState(false);
  const [justRemoved, setJustRemoved] = useState(false);
  const [quantity, setQuantity] = useState(itemQuantity || 1);
  const [cartItems, setCartItems] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(10);
  const backendUrl = process.env.REACT_APP_IMAGE_URL
  const [customer, setCustomer] = useState({});



  useEffect(() => {
    // Simulate local storage for cart/wishlist
    setCartItems([]);
    setIsInCart(false);
    setIsWishlisted(isWishlist);
  }, [isWishlist, variantId]);


    useEffect(() => {
      const fetchAndStore = async () => {
        try {
          const data = await getCustomerDetails(1); // 🔥 always fetch
          // await AsyncStorage.setItem("userData", JSON.stringify(data.data)); // store
          setCustomer(data.data); // set state
  
        } catch (error) {
          console.error("❌ Error fetching customer:", error);
        }
      };
  
      fetchAndStore();
    }, []);
  

  const showToast = (message, type = "success") => {
    Toast.show({
      type,
      text1: message,
      position: 'top',
      visibilityTime: 2500,
    });
  };

  const handleIncrease = () => setQuantity(prev => prev + 1);
  const handleDecrease = () => quantity > 1 && setQuantity(prev => prev - 1);

  const handleWishlistClick = async () => {
    if (!customer?.customerId) return;
    try {
      if (isWishlisted) {
        await removeFromWishlist(customer.customerId, variantId);
        setIsWishlisted(false);
        setJustRemoved(true);
        showToast("Removed from wishlist!", "error");
      } else {
        await addToWishlist(customer.customerId, variantId);
        setIsWishlisted(true);
        setJustRemoved(false);
        showToast("Item added to wishlist", "success");
      }
      onWishlistToggle?.();
      onCartToggle?.();
    } catch (err) {
      showToast("Failed to update wishlist.", "error");
    }
  };

  const handleAddToCart = async () => {
    console.log('handleAddToCart called. variantId:', variantId, 'Quantity:', quantity, 'CustomerId:', customer?.customerId);
    console.log(customer)
    if (!customer?.customerId) {
      showToast("Please log in to add items to your cart.", "error");
      return;
    }
    try {
      await addToCart(customer.customerId, variantId, quantity);
      console.log('Added to cart:', variantId, 'Quantity:', quantity);
      setIsInCart(true);
      showToast("Item is moved to cart!", "success");
      onCartToggle?.();
    } catch (error) {
      showToast("Failed to add item to cart!", "error");
    }
  };

  const handleCartButtonClick = () => {
    console.log('Cart button clicked. isInCart:', isInCart);
    if (isInCart) {
        Navigation.navigate('Cart');
    } else {
      console.log('Calling handleAddToCart');
      handleAddToCart();
    }
  };

  return (
    <View style={styles.card}>
      {/* Image Section */}
      <View style={[
        styles.imageContainer,
        variantType === "CONE"
          ? styles.coneBg
          : variantType === "HANK"
          ? styles.hankBg
          : styles.defaultBg
      ]}>
        <Image
          source={{ uri: `${backendUrl}${colorImage}` }}
          style={styles.image}
          resizeMode="contain"
        />
        {/* Wishlist badge */}
        <TouchableOpacity
          style={styles.wishlistBtn}
          onPress={handleWishlistClick}
        >
          {isWishlistPage && justRemoved ? (
            <HeartIcon name="heart" size={22} color="#6D28D9" />
          ) : isWishlisted ? (
            <HeartIcon name="heart" size={22} color="red" />
          ) : (
            <HeartIcon name="heart-o" size={22} color="#6D28D9" />
          )}
        </TouchableOpacity>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.sizeText}>{size}</Text>
        <View style={styles.colorRow}>
          <Text style={styles.colorBadge}>{color}</Text>
          {/* {hexCode ? (
            <Text style={[styles.colorBadge, { backgroundColor: hexCode }]}>{hexCode?.toUpperCase()}</Text>
          ) : null} */}
        </View>

        {/* Weight Picker & Quantity */}
        {/* <View style={styles.row}>
          <View style={styles.weightPicker}>
            <Picker
              selectedValue={selectedWeight}
              style={{ height: 36, width: 100 }}
              onValueChange={(itemValue) => setSelectedWeight(Number(itemValue))}
            >
              <Picker.Item label="10 Kg" value={10} />
              <Picker.Item label="25 Kg" value={25} />
              <Picker.Item label="50 Kg" value={50} />
            </Picker>
          </View>
          <View style={styles.qtyContainer}>
            <TouchableOpacity onPress={handleDecrease} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.qtyInput}
              value={String(quantity)}
              editable={false}
              textAlign="center"
            />
            <TouchableOpacity onPress={handleIncrease} style={styles.qtyBtn}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View> */}

        {/* Price & Rating */}
        <View style={styles.priceRow}>
          <View style={styles.priceBox}>
            <Text style={styles.price}>₹{Math.round(price)}</Text>
            <Text style={styles.markupPrice}><Text style={{ textDecorationLine: 'line-through' }}>₹{Math.round(markupPrice)}</Text></Text>
          </View>
          <View>
           {showCart && (
            <TouchableOpacity
              style={[
                styles.cartBtn,
                isInCart ? styles.cartBtnActive : styles.cartBtnInactive
              ]}
              onPress={handleCartButtonClick}
            >
              <Icon name={isInCart ? "eye-outline" : "cart-outline"} size={20} color="#fff" />
  
            </TouchableOpacity>
          )}
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          
        </View>
      </View>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 3,
    margin: 10,
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coneBg: {
    backgroundColor: '#A2A5AC',
  },
  hankBg: {
    backgroundColor: '#D6D2D3',
  },
  defaultBg: {
    backgroundColor: '#C0C4C6',
  },
  image: {
    width: '90%',
    height: '90%',
  },
  wishlistBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F3E8FF',
    padding: 8,
    borderRadius: 20,
    elevation: 2,
  },
  content: {
    padding: 16,
  },
  sizeText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#6D28D9',
    textAlign: 'center',
    marginBottom: 6,
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  colorBadge: {
    backgroundColor: '#F3F4F6',
    color: '#222',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 13,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  weightPicker: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#F3E8FF',
    borderRadius: 8,
    overflow: 'hidden',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 6,
  },
  qtyBtn: {
    padding: 6,
  },
  qtyBtnText: {
    fontSize: 18,
    color: '#6D28D9',
    fontWeight: 'bold',
  },
  qtyInput: {
    width: 32,
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    marginHorizontal: 4,
    backgroundColor: '#fff',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceBox: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#6D28D9',
  },
  markupPrice: {
    color: '#aaa',
    fontSize: 16,
    marginLeft: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    marginLeft: 4,
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: 15,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 12,
  },
  cartBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: 50,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    borderRadius: 50,
  },
  cartBtnActive: {
    backgroundColor: '#22C55E',
  },
  cartBtnInactive: {
    backgroundColor: '#6D28D9',
  },
  cartBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProductDetailBox;