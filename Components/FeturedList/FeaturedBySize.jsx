import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { fetchProducts } from '../../Service/ProductService';
import { useNavigation } from '@react-navigation/native';

const CATEGORY_IMAGES = {
  'cotton': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%2017078565.png?updatedAt=1751277730814',
  'bamboo': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478566.png?updatedAt=1751278205292',
  'micro modal': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478563.png?updatedAt=1751278205521',
  'excel': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478564.png?updatedAt=1751278205379',
  'viscose': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478570.png?updatedAt=1754984120078',
  'tencel': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478571.png?updatedAt=1754984120045',
  'ecovero': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478569.png?updatedAt=1754984120131',
  'livaeco': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478569.png?updatedAt=1754984120131',
  'flax varieties': 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Group%201707478568.png?updatedAt=1754984120259'
};

const getCategoryImage = (productName) => {
  const lowerName = productName.toLowerCase();
  for (const [key, value] of Object.entries(CATEGORY_IMAGES)) {
    if (lowerName.includes(key)) {
      return value;
    }
  }
  return 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/placeholder.png';
};

const CardItem = ({ card, onPress }) => {
  const categoryImage = getCategoryImage(card.productName);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: categoryImage }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{card.productName}</Text>
        <Text style={styles.cardSubtitle}>
          <Text style={styles.bold}>{card.size}</Text>
          <Text> | </Text>
          <Text style={[
            styles.bold,
            card.variantType.toLowerCase() === 'cone' ? styles.coneText :
            card.variantType.toLowerCase() === 'hank' ? styles.hankText : null
          ]}>
            {card.variantType}
          </Text>
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const FeaturedBySize = () => {
  const [variantCards, setVariantCards] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const loadVariants = async () => {
      const res = await fetchProducts();
      if (!res.success) return;
      const products = res.data.filter(p => p.availableStatus === 'ACTIVE');
      const allVariantCards = [];

      products.forEach(product => {
        const grouped = {};
        product.variants.forEach(variant => {
          if (variant.availableStatus !== 'ACTIVE') return;
          const key = `${product.id}_${variant.size}_${variant.variantType}`;
          if (!grouped[key]) {
            grouped[key] = {
              productId: product.id,
              size: variant.size,
              variantType: variant.variantType,
              productName: product.productName,
              productImage: product.productImage,
              variants: [],
              price: variant.pricePerKg,
              markupPrice: variant.markupPricePerKg,
              product: product,
              variantDescription: variant.variantDescription,
            };
          }
          grouped[key].variants.push({
            ...variant,
            color: variant.color || { colorName: 'Unknown', hexCode: '#ccc' },
          });
        });
        Object.values(grouped).forEach(card => allVariantCards.push(card));
      });

      setVariantCards(allVariantCards);
    };
    loadVariants();
  }, []);

  const handleCardClick = (card) => {
    navigation.navigate('ProductDetails', {
      product: card.product,
      size: card.size,
      variantType: card.variantType,
      color: card.variants[0]?.color,
      price: card.price,
      markupPrice: card.markupPrice,
      variantDescription: card.variantDescription,
    });
  };

  // Split into two rows
  const halfLength = Math.ceil(variantCards.length / 2);
  const row1Cards = variantCards.slice(0, halfLength);
  const row2Cards = variantCards.slice(halfLength);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Shop by Size</Text>
      </View>
      {/* First Row */}
      <FlatList
        data={row1Cards}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `row1-${i}`}
        contentContainerStyle={styles.flatList}
        renderItem={({ item }) => (
          <CardItem card={item} onPress={() => handleCardClick(item)} />
        )}
      />
      {/* Second Row */}
      <FlatList
        data={row2Cards}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => `row2-${i}`}
        contentContainerStyle={styles.flatList}
        renderItem={({ item }) => (
          <CardItem card={item} onPress={() => handleCardClick(item)} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 24, marginBottom: 24, paddingHorizontal: 8 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  header: { fontSize: 24, fontWeight: 'bold', color: '#6D28D9', paddingVertical: 8 },
  flatList: { paddingBottom: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 12,
    minWidth: 180,
    elevation: 2,
  },
  cardImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#6D28D9', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#555' },
  bold: { fontWeight: 'bold', color: '#222' },
  coneText: { color: '#D7263D' },
  hankText: { color: '#F59E42' },
});

export default FeaturedBySize;