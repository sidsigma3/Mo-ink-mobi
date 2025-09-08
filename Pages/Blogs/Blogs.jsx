// Blogs.js (React Native version)
import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
// import TopNavigation from '../../Components/TopNavigation/TopNavigation';
import Cta from '../../Components/Cta/Cta';
import Footer from '../../Components/Footer/Footer';
import HeroSection from '../../Components/HeroSection/HeroSection';
import BottomNav from '../../Components/BottomNav/BottomNav';
import BlogBox1 from '../../Components/BlogList/BlogBox1';
import BlogBox2 from '../../Components/BlogList/BlogBox2';
import BlogBox3 from '../../Components/BlogList/BlogBox3';
import BlogBox4 from '../../Components/BlogList/BlogBox4';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';

const Blogs = () => {
  const breadcrumbs = [
    { label: 'Home', link: '/home' },
    { label: 'Blogs', link: '/blogs' },
  ];

  useEffect(() => {
    // For React Native, there's no `window.scrollTo`
    // but ScrollView will automatically start from top
  }, []);

  return (
    <View style={styles.container}>
        <NavbarHeader></NavbarHeader>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <HeroSection productName="Blogs" breadcrumbs={breadcrumbs} />

        {/* Blog Boxes */}
        <View style={styles.blogGrid}>
          <BlogBox1 />
          <BlogBox2 />
          <BlogBox3 />
          <BlogBox4 />
        </View>

        {/* CTA */}
        <Cta />

        {/* Footer */}
        <Footer />
      </ScrollView>

      {/* Fixed Bottom Nav */}
      <BottomNav />
    </View>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 80, // space for bottom nav
  },
  blogGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
});
