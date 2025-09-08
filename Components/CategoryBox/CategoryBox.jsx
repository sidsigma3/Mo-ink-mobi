// CategoryBox.js  (React Native)

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const CategoryBox = ({
  size,
  color,
  price,
  product,
  variantType,
  markupPrice,
  variantDescription,
  categoryName,
  currentFilters,
}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleClick = () => {
    const currentCategory = categoryName || route?.params?.categoryName || 'All Products';

    navigation.navigate('ProductDetails', {
      product,
      size,
      variantType,
      color,
      price,
      markupPrice,
      variantDescription,
      categoryName: currentCategory,
      selectedVariantType: currentFilters?.selectedVariantType,
      selectedCounters: currentFilters?.selectedCounters,
      previousUrl: route.name,
    });
  };

  const imageSource =
    variantType === 'CONE'
      ? {
          uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/balls.png?updatedAt=1748517272738',
        }
      : {
          uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/yarn%20(1).png?updatedAt=1748516744330',
        };

  return (
    <TouchableOpacity style={styles.card} onPress={handleClick} activeOpacity={0.8}>
      <View style={styles.inner}>
        <Image source={imageSource} style={styles.icon} resizeMode="contain" />
        <Text style={styles.sizeText}>{size}</Text>
        <Text style={styles.colorText}>
          Total color - {Array.isArray(color) ? color.length : 1}
        </Text>
        <Text
          style={[
            styles.variantText,
            variantType === 'CONE' && { color: '#ec4899' },
            variantType === 'HANK' && { color: '#d97706' },
          ]}
        >
          {variantType}
        </Text>

        <View style={styles.buttonWrapper}>
          <Text style={styles.viewColorsButton}>VIEW COLORS</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CategoryBox;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#E9D5FF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    marginHorizontal: 4,
  },
  inner: {
    alignItems: 'center',
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 6,
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4B0082',
  },
  colorText: {
    fontSize: 13,
    color: '#555',
    marginVertical: 4,
  },
  variantText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#6B21A8',
  },
  buttonWrapper: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewColorsButton: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B21A8',
  },
});
