import React, { useEffect } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";

// Import your React Native components (must be implemented in RN style)
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import HeroSection from "../../Components/HeroSection/HeroSection";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import Inquiries from "../../Components/Inquiries/Inquiries";
import BottomNav from "../../Components/BottomNav/BottomNav";

const ContactPage = () => {
  useEffect(() => {
    // In React Native there's no window.scrollTo
    // Use ScrollView's ref & scrollTo if needed
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Navbar Header */}
          <View style={styles.section}>
            <NavbarHeader />
          </View>



          {/* Hero Section */}
          <View style={styles.section}>
            <HeroSection productName="Contact Us" />
          </View>

          {/* Inquiries */}
          <View style={styles.section}>
            <Inquiries show={false}></Inquiries>
          </View>

          {/* CTA */}
          <View style={styles.section}>
            <Cta />
          </View>

          {/* Footer */}
          <View style={styles.section}>
            <Footer />
          </View>
        </ScrollView>

        {/* Fixed Bottom Navigation */}
        <BottomNav />
      </View>
    </SafeAreaView>
  );
};

export default ContactPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 80, // leave space for bottom nav
  },
  section: {
    marginBottom: 20,
  },
  navbarWrapper: {
    display: "none", // Hide if you don't want navbar on mobile
  },
});
