import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import ProductDetailBox from './ProductDetailBox'; // Use your RN version
import { fetchProducts } from '../../Service/ProductService';

const SliderCard = ({ title, data, onViewAll }) => {
  const flatListRef = useRef(null);

  const handlePrevious = () => {
    flatListRef.current?.scrollToOffset({
      offset: Math.max(0, (flatListRef.current?._listRef?._scrollMetrics?.offset || 0) - 500),
      animated: true,
    });
  };

  const handleNext = () => {
    flatListRef.current?.scrollToOffset({
      offset: ((flatListRef.current?._listRef?._scrollMetrics?.offset || 0) + 500),
      animated: true,
    });
  };

  return (
    <View style={styles.sliderCard}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderTitle}>{title} Yarns</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllBtn}>View All</Text>
        </TouchableOpacity>
        <View style={styles.navBtns}>
          <TouchableOpacity onPress={handlePrevious} style={styles.navBtn}>
            <Text style={styles.navBtnText}>{"<"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNext} style={styles.navBtn}>
            <Text style={styles.navBtnText}>{">"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.variantId}
        contentContainerStyle={styles.sliderList}
        renderItem={({ item }) => (
          <View style={styles.sliderItem}>
            <ProductDetailBox {...item} />
          </View>
        )}
      />
    </View>
  );
};

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [finalData, setFinalData] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetchProducts();
      if (response.success) {
        const activeProducts = response.data.filter(
          (product) => product.availableStatus === "ACTIVE"
        );
        setProducts(activeProducts);
      } else {
        console.error(response.message);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const aggregated = aggregateProductData(products);
      setFinalData(aggregated);
    }
  }, [products]);

  const aggregateProductData = (productData) => {
    return productData.map((product) => {
      const groupedVariants = product.variants.reduce((acc, variant) => {
        const { size, color, availableWeight, id, variantType, pricePerKg } = variant;
        const key = `${size}_${variantType}`;

        if (!acc[key]) {
          acc[key] = {
            id,
            size,
            variantType,
            variants: [],
            totalWeight: 0,
          };
        }

        acc[key].variants.push({
          colorName: color.colorName,
          hexCode: color.hexCode || '#ccc',
          available: Number(availableWeight),
          price: pricePerKg,
          id: id,
        });

        acc[key].totalWeight += Number(availableWeight);
        return acc;
      }, {});

      return {
        productId: product.id,
        productName: product.productName,
        productDescription: product.productDescription,
        productImage: product.productImage,
        compareAtPrice: product.productPrice?.compareAtPrice,
        costPerItemPerKg: product.productPrice?.costPerItemPerKg,
        gstOnProduct: product.productPrice?.gstOnProduct,
        pricePerKg: product.productPrice?.pricePerKg,
        availableStatus: product.availableStatus,
        groupedVariants: Object.values(groupedVariants).sort(
          (a, b) => b.totalWeight - a.totalWeight
        ),
        variants: product.variants,
      };
    });
  };

  const handleViewAll = (productName) => {
    navigation && navigation.navigate && navigation.navigate('Category', { name: productName });
  };

  return (
    <ScrollView style={styles.container}>
      {products.map((product) => (
        <View key={product.id} style={styles.productSection}>
          <SliderCard
            title={product.productName}
            data={product.variants
              .filter((variant) => variant.availableStatus !== "INACTIVE")
              .map((variant) => ({
                productName: product.productName,
                size: variant.size,
                color: variant.color.colorName,
                price: variant.pricePerKg,
                variantId: variant.id,
                markupPrice: variant.markupPricePerKg,
                navigateCart: true,
                hexCode: variant.color.colorCode || '#ccc',
                variantType: variant.variantType,
                imageUrl: product.productImage,
                colorImage: variant.color.colorImage,
              }))
            }
            onViewAll={() => handleViewAll(product.productName)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  productSection: { marginBottom: 24 },
  sliderCard: { marginHorizontal: 8, marginBottom: 8 },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 12,
  },
  sliderTitle: { fontSize: 20, fontWeight: 'bold', color: '#6D28D9' },
  viewAllBtn: { color: '#6D28D9', fontWeight: 'bold', fontSize: 15 },
  navBtns: { flexDirection: 'row', marginLeft: 10 },
  navBtn: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginHorizontal: 2,
  },
  navBtnText: { color: '#6D28D9', fontWeight: 'bold', fontSize: 18 },
  sliderList: { paddingBottom: 8 },
  sliderItem: { marginRight: 12, width: 260 },
});

export default ProductList;