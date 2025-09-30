import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Modal,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import HeroSection from '../../Components/HeroSection/HeroSection';
import Footer from '../../Components/Footer/Footer';
import BottomNav from '../../Components/BottomNav/BottomNav';
import CategoryBox from '../../Components/CategoryBox/CategoryBox';
import { fetchProducts } from '../../Service/ProductService';
import IconFilter from 'react-native-vector-icons/Ionicons';
import IconClose from 'react-native-vector-icons/Ionicons';
import IconCheck from 'react-native-vector-icons/Ionicons';

import { Fonts } from '../Utils/Fonts';
const { height: screenHeight } = Dimensions.get('window');

export default function Category() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState('CONE');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Temporary selections for the filter modal
  const [tempCategory, setTempCategory] = useState(null);
  const [tempVariantType, setTempVariantType] = useState('CONE');
  
  // Animation value for bottom sheet
  const slideAnim = useState(new Animated.Value(screenHeight))[0];

  const route = useRoute();
  const categoryFromRoute = route?.params?.name;

  useEffect(() => {
    const load = async () => {
      const response = await fetchProducts();
      setLoading(false);

      if (response.success) {
        const active = response.data.filter((p) => p.availableStatus === 'ACTIVE');
        setProducts(active);

        let defaultCat =
          categoryFromRoute || (active.length > 0 ? active[0].productName : null);
        setSelectedCategory(defaultCat);
        setTempCategory(defaultCat);
      }
    };
    load();
  }, [categoryFromRoute]);

  // Animation functions
  const openBottomSheet = () => {
    setTempCategory(selectedCategory);
    setTempVariantType(selectedVariantType);
    setIsOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(slideAnim, {
      toValue: screenHeight,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsOpen(false);
    });
  };

  const applyFilters = () => {
    setSelectedCategory(tempCategory);
    setSelectedVariantType(tempVariantType);
    closeBottomSheet();
  };

  const clearAllFilters = () => {
    const defaultCategory = products.length > 0 ? products[0].productName : null;
    setTempCategory(defaultCategory);
    setTempVariantType('CONE');
  };

  const variantType = [{ name: 'CONE' }, { name: 'HANK' }];

  const filteredVariants = useMemo(() => {
    const product = products.find((p) => p.productName === selectedCategory);
    if (!product) return [];

    const activeVariants = product.variants.filter(
      (v) => v.availableStatus === 'ACTIVE' && v.variantType === selectedVariantType
    );

    const grouped = {};
    activeVariants.forEach((v) => {
      const key = `${v.size}_${v.variantType}`;
      if (!grouped[key]) {
        grouped[key] = {
          key,
          size: v.size,
          variantType: v.variantType,
          variants: [],
          price: v.pricePerKg,
          markupPrice: v.markupPricePerKg,
          product,
        };
      }
      grouped[key].variants.push(v);
    });

    return Object.values(grouped);
  }, [selectedCategory, selectedVariantType, products]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#6B21A8" size="large" />
      </View>
    );
  }

  const breadcrumbs = [
    { label: 'Home', link: '/home' },
    { label: 'Category', link: '/category' },
    { label: selectedCategory || 'All' },
  ];

  return (
    <View style={styles.container}>
      {/* Main ScrollView */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <NavbarHeader />
        <HeroSection productName={selectedCategory} breadcrumbs={breadcrumbs} />

        <View style={styles.filterWrapper}>
          <TouchableOpacity style={styles.filterBtn} onPress={openBottomSheet}>
            <IconFilter name="filter" size={20} color="#6B21A8" />
            <Text style={styles.filterText}>Filters (1)</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredVariants}
          numColumns={2}
          keyExtractor={(item) => item.key}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <CategoryBox
              size={item.size}
              variantType={item.variantType}
              color={item.variants}
              price={item.price}
              product={item.product}
              markupPrice={item.markupPrice}
              categoryName={selectedCategory}
              currentFilters={{
                selectedVariantType,
              }}
            />
          )}
        />

        <Footer />
      </ScrollView>
      
      <BottomNav />

      {/* Bottom Sheet Modal */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={closeBottomSheet}
      >
        <TouchableWithoutFeedback onPress={closeBottomSheet}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.bottomSheet,
                  {
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                {/* Header */}
                <View style={styles.bottomSheetHeader}>
                  <Text style={styles.bottomSheetTitle}>Filters (1)</Text>
                  <TouchableOpacity onPress={closeBottomSheet}>
                    <IconClose name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.bottomSheetContent}>
                  {/* Category Section */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Category</Text>
                    {products.map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.filterOption}
                        onPress={() => setTempCategory(product.productName)}
                      >
                        <View style={styles.filterOptionContent}>
                          <Text style={styles.filterOptionText}>
                            {product.productName}
                          </Text>
                          {tempCategory === product.productName && (
                            <IconCheck name="checkmark" size={20} color="#6B21A8" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Type Section */}
                  <View style={styles.filterSection}>
                    <Text style={styles.filterSectionTitle}>Type</Text>
                    {variantType.map((variant) => (
                      <TouchableOpacity
                        key={variant.name}
                        style={styles.filterOption}
                        onPress={() => setTempVariantType(variant.name)}
                      >
                        <View style={styles.filterOptionContent}>
                          <Text style={styles.filterOptionText}>
                            {variant.name}
                          </Text>
                          {tempVariantType === variant.name && (
                            <IconCheck name="checkmark" size={20} color="#6B21A8" />
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Bottom Buttons */}
                <View style={styles.bottomSheetActions}>
                  <TouchableOpacity 
                    style={styles.clearAllBtn}
                    onPress={clearAllFilters}
                  >
                    <Text style={styles.clearAllText}>CLEAR ALL</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.applyBtn}
                    onPress={applyFilters}
                  >
                    <Text style={styles.applyText}>APPLY</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
     
    flex: 1, 
    backgroundColor: '#fff' 
  
  },
  filterWrapper: {
    
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginTop: 12,
  
  },
  filterBtn: {
    
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  
  },
  filterText: {
    fontFamily: Fonts.medium,
    marginLeft: 6,
    color: '#6B21A8',
    fontSize: 14,
    fontWeight: '500',
  },
  grid: {
    
    paddingHorizontal: 16,
    paddingBottom: 85,
    marginTop: 8,
  
  },
  loader: {
     
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  
  },
  
  // Bottom Sheet Styles
  modalOverlay: {
    
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  
  },
  bottomSheet: {
    
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: screenHeight * 0.8,
    minHeight: screenHeight * 0.5,
  
  },
  bottomSheetHeader: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  
  },
  bottomSheetTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  bottomSheetContent: {
    
    flex: 1,
    padding: 16,
  
  },
  filterSection: {
    
    marginBottom: 24,
  
  },
  filterSectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterOption: {
    
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  
  },
  filterOptionContent: {
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  
  },
  filterOptionText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#374151',
  },
  bottomSheetActions: {
    
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  
  },
  clearAllBtn: {
    
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    backgroundColor: '#fff',
  
  },
  clearAllText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  applyBtn: {
    
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6B21A8',
  
  },
  applyText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

});