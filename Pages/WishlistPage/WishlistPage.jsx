// WishlistPage.js
import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';

// Import your custom components (need to be RN compatible)
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import Navbar from '../../Components/Navbar/Navbar';
import HeroSection from '../../Components/HeroSection/HeroSection';
import Wishlist from './Wishlist';
import Cta from '../../Components/Cta/Cta';
import Footer from '../../Components/Footer/Footer';
import BottomNav from '../../Components/BottomNav/BottomNav';

const WishlistPage = () => {
  const breadcrumbs = [
    { label: 'Home', link: '/home' },
    { label: 'Account', link: '/account' },
    { label: 'Wishlist', link: '/wishlist' },
  ];

  // No window.scrollTo in RN — ScrollView handles scrolling
  useEffect(() => {
    // You can trigger analytics, fetch data, etc. here
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* You can keep TopNavigation if it’s RN-compatible */}
        <NavbarHeader />
      
        <HeroSection productName="Wishlist" breadcrumbs={breadcrumbs} />
        <Wishlist />
        <Cta />
        <Footer />
      </ScrollView>
      <BottomNav />
    </View>
  );
};

export default WishlistPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color instead of Tailwind
  },
  scrollContent: {
    paddingHorizontal: 16, // instead of px-6 md:px-14
    paddingVertical: 12,
  },
});
