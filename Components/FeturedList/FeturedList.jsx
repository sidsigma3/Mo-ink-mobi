import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import FeaturedBox from "./FeaturedBox";
import { fetchProducts } from "../../Service/ProductService";
import { useNavigation } from "@react-navigation/native";

// -- SliderCard component -----------------------------------------------
const SliderCard = ({ title, children }) => {
  const scrollRef = useRef(null);

  const handlePrevious = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: 0, animated: true });
    }
  };

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  };

  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity style={styles.navBtn} onPress={handlePrevious}>
            <Text>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={handleNext}>
            <Text>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContainer}
      >
        {children}
      </ScrollView>
    </View>
  );
};

// -- FeturedList component -----------------------------------------------
const FeturedList = () => {
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchProducts();
      if (response.success) {
        setProducts(response.data);
      } else {
        console.error(response.message);
      }
    };

    getProducts();
  }, []);

  const handleNavigation = (selectedCategory) => {
    console.log("Navigating to category:", selectedCategory);
    navigation.navigate("Category", { name: selectedCategory });
  };

  const aggregateProductData = (productData) => {
    return productData
      .filter((product) => product.availableStatus === "ACTIVE")
      .map((product) => {
        const groupedVariants = product.variants
          .filter((variant) => variant.availableStatus === "ACTIVE")
          .reduce((acc, variant) => {
            const { size, color, availableWeight, id } = variant;
            if (!acc[size]) {
              acc[size] = {
                id,
                size,
                variants: [],
                totalWeight: 0,
              };
            }
            // unique color
            if (
              !acc[size].variants.some(
                (v) => v.colorName === color.colorName
              )
            ) {
              acc[size].variants.push({
                colorName: color.colorName,
                hexCode: color.hexCode || "#ccc",
                price: variant.pricePerKg,
                id,
              });
            }
            acc[size].totalWeight += Number(availableWeight);
            return acc;
          }, {});

        return {
          productId: product.id,
          productName: product.productName,
          groupedVariants: Object.values(groupedVariants),
        };
      });
  };

  return (
    <View style={styles.root}>
      <SliderCard title="Categories">
        {products.length > 0 ? (
          aggregateProductData(products).map((product, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNavigation(product.productName)}
            >
              <FeaturedBox
                productName={product.productName}
                number={product.groupedVariants.length}
                color={product.groupedVariants
                  .map((group) => group.variants.length)
                  .reduce((acc, current) => acc + current, 0)}
              />
            </TouchableOpacity>
          ))
        ) : (
          <Text>No products available</Text>
        )}
      </SliderCard>
    </View>
  );
};

export default FeturedList;

const styles = StyleSheet.create({
  root: {
    marginTop: 8,
    paddingLeft: 16,
    paddingBottom: 30,
    backgroundColor: "#faf5ff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    paddingVertical: 12,
  },
  headerBtns: {
    flexDirection: "row",
    gap: 8,
  },
  navBtn: {
    borderWidth: 1,
    borderColor: "#6B21A8",
    padding: 8,
    borderRadius: 20,
  },
  sliderContainer: {
    flexDirection: "row",
  },
});
