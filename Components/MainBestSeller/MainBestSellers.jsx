import React from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 20;

const MainBestsellers = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const products = [
    { titleKey: 'Bamboo Yarn', price: '₹142.00/kg', img: require('../../assets/Images/Yarn1.jpg'), count: '2/80', type: 'Cone/Hank' },
    { titleKey: 'Modal Yarn', price: '₹256.00/kg', img: require('../../assets/Images/Yarn2.jpg'), count: '2/100', type: 'Cone/Hank' },
    { titleKey: 'Cotton Yarn', price: '₹327.00/kg', img: require('../../assets/Images/Yarn3.jpg'), count: '1/40', type: 'Cone/Hank' },
    { titleKey: 'Excel Yarn', price: '₹169.00/kg', img: require('../../assets/Images/Yarn4.jpg'), count: '2/60', type: 'Cone/Hank' },
    { titleKey: 'Viscose Yarn', price: '₹142.00/kg', img: require('../../assets/Images/Yarn5.jpg'), count: '2/90', type: 'Cone/Hank' },
    { titleKey: 'Spandex Yarn', price: '₹256.00/kg', img: require('../../assets/Images/Yarn6.jpg'), count: '1/60', type: 'Cone/Hank' },
    { titleKey: 'Linen Yarn', price: '₹327.00/kg', img: require('../../assets/Images/Yarn7.jpg'), count: '1/92', type: 'Cone/Hank' },
    { titleKey: 'Silk Yarn', price: '₹169.00/kg', img: require('../../assets/Images/Yarn8.jpg'), count: '2/80', type: 'Cone/Hank' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.img} style={styles.image} resizeMode="cover" />
      <Text style={styles.title}>{t(`mainBestsellers.products.${item.titleKey}`)}</Text>
      <Text style={styles.variant}>{t('mainBestsellers.variant')}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>{t('mainBestsellers.view')}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{t('mainBestsellers.subtitle')}</Text>
      <Text style={styles.heading}>{t('mainBestsellers.title')}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.titleKey}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 20,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  subtitle: {
    textAlign: 'center',
    color: '#6B21A8',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  heading: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    width: itemWidth,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderColor: '#e5e7eb',
    borderWidth: 1,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },
  variant: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#FFEE9A',
    color: '#6B21A8',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: '500',
  },
  link: {
    marginTop: 10,
    color: '#6B21A8',
    fontWeight: 'bold',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default MainBestsellers;
