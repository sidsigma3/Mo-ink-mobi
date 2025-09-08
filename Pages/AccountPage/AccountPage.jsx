import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Example - can import other icon sets too

// Import your RN components
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import Navbar from "../../Components/Navbar/Navbar";
import HeroSection from "../../Components/HeroSection/HeroSection";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import BottomNav from "../../Components/BottomNav/BottomNav";

// If you're using React Navigation
import { useNavigation } from "@react-navigation/native";

const AccountPage = () => {
  const navigation = useNavigation();

  useEffect(() => {
    // No window.scrollTo in RN
    // ScrollView will handle scrolling
  }, []);

  const breadcrumbs = [
    { label: "Home", link: "Home" },
    { label: "Account", link: "Account" },
  ];

  const menuItems = [
    {
      title: "Profile",
      subtitle: "Edit log in name, password and address",
      icon: { name: "settings-outline", color: "#6b21a8" },
      route: "Profile",
    },
    {
      title: "Your Orders",
      subtitle: "View or buy products again",
      icon: { name: "bag-outline", color: "#6b21a8" },
      route: "Order",
    },
    {
      title: "Wallet",
      subtitle: "Add money to your wallet and use",
      icon: { name: "wallet-outline", color: "#6b21a8" },
      route: "Wallet",
    },
    {
      title: "Shopping Cart",
      subtitle: "View your cart and proceed check out",
      icon: { name: "cart-outline", color: "#6b21a8" },
      route: "ShoppingCart",
    },
    {
      title: "Wishlist",
      subtitle: "Explore your wishlist and shop",
      icon: { name: "heart-outline", color: "#6b21a8" },
      route: "Wishlist",
    },
    {
      title: "Saved Address",
      subtitle: "Add or update your addresses",
      icon: { name: "location-outline", color: "#6b21a8" },
      route: "Address",
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Navbar Header */}
          <View style={styles.section}>
            <NavbarHeader />
          </View>

          {/* Hero Section */}
          <View style={styles.section}>
            <HeroSection productName="Account" breadcrumbs={breadcrumbs} />
          </View>

          {/* Menu Items */}
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={[styles.iconWrapper, { backgroundColor: "#f3e8ff" }]}>
                  <Icon name={item.icon.name} size={25} color={item.icon.color} />
                </View>
                <View style={styles.menuTextWrapper}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <View style={styles.menuSubtitleRow}>
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                    <View style={styles.arrowWrapper}>
                      <Icon name="arrow-forward" size={18} color="#4b5563" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
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

export default AccountPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80, // leave space for bottom nav
  },
  section: {
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: "column",
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 50,
  },
  menuTextWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  menuSubtitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#6b7280",
    flex: 1,
  },
  arrowWrapper: {
    padding: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 50,
    marginLeft: 8,
  },
});
