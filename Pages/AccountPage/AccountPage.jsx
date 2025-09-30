import React, { useEffect, useState } from "react";
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

import { Fonts } from '../Utils/Fonts';
const AccountPage = () => {
  const navigation = useNavigation();
  const [expandedDropdowns, setExpandedDropdowns] = useState({});

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
      type: "navigation",
    },
    {
      title: "Your Orders",
      subtitle: "View or buy products again",
      icon: { name: "bag-outline", color: "#6b21a8" },
      route: "Order",
      type: "navigation",
    },
    {
      title: "Wallet",
      subtitle: "Add money to your wallet and use",
      icon: { name: "wallet-outline", color: "#6b21a8" },
      route: "Wallet",
      type: "navigation",
    },
    {
      title: "Shopping Cart",
      subtitle: "View your cart and proceed check out",
      icon: { name: "cart-outline", color: "#6b21a8" },
      route: "ShoppingCart",
      type: "navigation",
    },
    {
      title: "Wishlist",
      subtitle: "Explore your wishlist and shop",
      icon: { name: "heart-outline", color: "#6b21a8" },
      route: "Wishlist",
      type: "navigation",
    },
    {
      title: "Saved Address",
      subtitle: "Add or update your addresses",
      icon: { name: "location-outline", color: "#6b21a8" },
      route: "Address",
      type: "navigation",
    },
    {
      title: "Helpful Links",
      subtitle: "Find useful resources and support",
      icon: { name: "help-circle-outline", color: "#6b21a8" },
      type: "dropdown",
      id: "helpfulLinks",
      dropdownItems: [
        { title: "Contact Us", route: "Contact" },
        { title: "Frequently Asked Questions", route: "Faq" },
        { title: "Terms of Use", route: "Terms" },
      ],
    },
    {
      title: "Our Policies",
      subtitle: "Read terms, privacy and return policies",
      icon: { name: "document-text-outline", color: "#6b21a8" },
      type: "dropdown",
      id: "ourPolicies",
      dropdownItems: [
        { title: "Return Policy", route: "ReturnPolicy" },
        { title: "Refund Policy", route: "RefundPolicy" },
        { title: "Shipping Policy", route: "ShippingPolicy" },
        { title: "Privacy Policy", route: "PrivacyPolicy" },
      ],
    },
  ];

  const toggleDropdown = (id) => {
    setExpandedDropdowns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleMenuPress = (item) => {
    if (item.type === "dropdown") {
      toggleDropdown(item.id);
    } else {
      navigation.navigate(item.route);
    }
  };

  const renderMenuItem = (item, index) => {
    const isExpanded = expandedDropdowns[item.id];
    
    return (
      <View key={index} style={styles.menuItemContainer}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => handleMenuPress(item)}
        >
          <View style={[styles.iconWrapper, { backgroundColor: "#f3e8ff" }]}>
            <Icon name={item.icon.name} size={25} color={item.icon.color} />
          </View>
          <View style={styles.menuTextWrapper}>
            <Text style={styles.menuTitle}>{item.title}</Text>
            <View style={styles.menuSubtitleRow}>
              <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
              <View style={styles.arrowWrapper}>
                <Icon 
                  name={item.type === "dropdown" 
                    ? (isExpanded ? "chevron-up" : "chevron-down")
                    : "arrow-forward"
                  } 
                  size={18} 
                  color="#4b5563" 
                />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Dropdown Content */}
        {item.type === "dropdown" && isExpanded && (
          <View style={styles.dropdownContainer}>
            {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
              <TouchableOpacity
                key={dropdownIndex}
                style={[
                  styles.dropdownItem,
                  dropdownIndex === item.dropdownItems.length - 1 && styles.lastDropdownItem
                ]}
                onPress={() => navigation.navigate(dropdownItem.route)}
              >
                <View style={styles.dropdownBullet} />
                <Text style={styles.dropdownText}>{dropdownItem.title}</Text>
                <Icon name="arrow-forward" size={16} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

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
            {menuItems.map((item, index) => renderMenuItem(item, index))}
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
  menuItemContainer: {
    
    marginBottom: 10,
  
  },
  menuItem: {
    
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
  
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
    fontFamily: Fonts.semiBold,
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
    fontFamily: Fonts.regular,
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
  dropdownContainer: {
    
    backgroundColor: "#f9fafb",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginTop: -3, // Overlap with main menu item border
  
  },
  dropdownItem: {
    
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  
  },
  lastDropdownItem: {
    
    borderBottomWidth: 0,
  
  },
  dropdownBullet: {
    
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6b21a8",
    marginRight: 12,
  
  },
  dropdownText: {
    fontFamily: Fonts.regular,
    flex: 1,
    fontSize: 14,
    color: "#374151",
  },

});