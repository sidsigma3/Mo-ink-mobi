// Wishlist.js (React Native)
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getWishlist } from "../../Service/WishlistService";
import { fetchProducts } from "../../Service/ProductService";
import ProductDetailBox from "../../Components/ProductList/ProductDetailBox"; // Must be RN compatible

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Load customer from AsyncStorage
  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const storedData = await AsyncStorage.getItem("userData");
        if (storedData) {
          const parsed = JSON.parse(storedData);
          if (parsed?.customerId) {
            setCustomer(parsed);
          }
        }
      } catch (error) {
        console.error("Error reading userData:", error);
      }
    };
    loadCustomer();
  }, []);

  // Fetch wishlist data
  const fetchWishlistData = useCallback(async () => {
    if (!customer?.customerId) return;

    setLoading(true);
    try {
      const wishlistResponse = await getWishlist(customer.customerId);
      const wishlistVariantIds = wishlistResponse?.variantIds || [];
      const wishlistId = wishlistResponse?.wishlistId;

      setWishlistIds(wishlistVariantIds);

      const productResponse = await fetchProducts();
      const allProducts = productResponse?.data || [];

      const wishlistProducts = allProducts.flatMap((product) =>
        product.variants
          .filter((variant) => wishlistVariantIds.includes(variant.id))
          .map((variant) => ({
            productName: product.productName,
            size: variant.size,
            colorName: variant.color.colorName,
            price: variant.pricePerKg,
            markupPrice: variant.markupPricePerKg,
            variantId: variant.id,
            hexCode: variant.color.colorCode,
            productImage: product.productImage,
            variantType: variant.variantType,
            colorImage: variant.color.colorImage,
            wishlistId,
          }))
      );

      setWishlistItems(wishlistProducts);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  }, [customer]);

  // Run when customer is loaded
  useEffect(() => {
    if (customer) {
      fetchWishlistData();
    }
  }, [customer, fetchWishlistData]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6B21A8" />
      ) : wishlistItems.length > 0 ? (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => item.variantId.toString()}
          horizontal
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductDetailBox
              productName={item.productName}
              size={item.size}
              color={item.colorName}
              price={item.price}
              markupPrice={item.markupPrice}
              variantId={item.variantId}
              isWishlist={wishlistIds.includes(item.variantId)}
              onWishlistToggle={fetchWishlistData}
              hexCode={item.hexCode}
              imageUrl={item.productImage}
              variantType={item.variantType}
              isWishlistPage={true}
              colorImage={item.colorImage}
            />
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No wishlist items found.</Text>
      )}
    </View>
  );
};

export default Wishlist;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    flex: 1,
  },
  list: {
    paddingHorizontal: 8,
    gap: 12, // Only works in RN >= 0.71, else use marginRight
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});
