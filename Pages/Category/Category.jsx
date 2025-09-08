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
} from 'react-native';

import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import HeroSection from '../../Components/HeroSection/HeroSection';
import Footer from '../../Components/Footer/Footer';
import BottomNav from '../../Components/BottomNav/BottomNav';
import CategoryBox from '../../Components/CategoryBox/CategoryBox';
import { fetchProducts } from '../../Service/ProductService';

import IconFilter from 'react-native-vector-icons/Ionicons';
import IconClose from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';

export default function Category() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedVariantType, setSelectedVariantType] = useState('CONE');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const categoryFromRoute = route?.params?.categoryName;

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
      }
    };
    load();
  }, [categoryFromRoute]);

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
    {/* Sidebar overlay OUTSIDE ScrollView */}
    {isOpen && (
      <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sidebar}>
              <View style={styles.sidebarHeader}>
                <Text style={styles.sidebarTitle}>Filters</Text>
                <IconClose
                  name="close"
                  size={24}
                  color="#fff"
                  onPress={() => setIsOpen(false)}
                />
              </View>
              {/* Sidebar's own ScrollView */}
              <ScrollView contentContainerStyle={{ padding: 12 }}>
                {/* category */}
                <Text style={styles.sectionTitle}>Category</Text>
                {products.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => {
                      setSelectedCategory(p.productName);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.itemTag,
                      selectedCategory === p.productName && {
                        backgroundColor: '#E9D5FF',
                      },
                    ]}
                  >
                    <Text>{p.productName}</Text>
                  </TouchableOpacity>
                ))}

                <Text style={[styles.sectionTitle, { marginTop: 14 }]}>Type</Text>
                {variantType.map((v) => (
                  <TouchableOpacity
                    key={v.name}
                    onPress={() => {
                      setSelectedVariantType(v.name);
                      setIsOpen(false);
                    }}
                    style={[
                      styles.itemTag,
                      selectedVariantType === v.name && {
                        backgroundColor: '#E9D5FF',
                      },
                    ]}
                  >
                    <Text>{v.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )}

    {/* Main ScrollView */}
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <NavbarHeader />
      <HeroSection productName={selectedCategory} breadcrumbs={breadcrumbs} />

      <View style={styles.filterWrapper}>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setIsOpen(true)}>
          <IconFilter name="filter" size={20} color="#6B21A8" />
          <Text style={styles.filterText}>Filters</Text>
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
  </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  filterWrapper: {
    alignItems: 'flex-end',
    marginHorizontal: 16,
    marginTop: 12,
  },
  filterBtn: {
    flexDirection: 'row',
    padding: 8,
    borderWidth: 1,
    borderColor: '#E9D5FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  filterText: {
    marginLeft: 6,
    color: '#6B21A8',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  sidebar: {
    width: Dimensions.get('window').width * 0.8,
    backgroundColor: '#fff',
    height: '100%',
    zIndex: 11,
  },
  sidebarHeader: {
    backgroundColor: '#6B21A8',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sidebarTitle: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6 },
  itemTag: {
    padding: 10,
    marginBottom: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 85,
    marginTop: 8,
  },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
