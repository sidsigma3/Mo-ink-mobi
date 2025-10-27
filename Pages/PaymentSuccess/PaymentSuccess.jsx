import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons"; // you can replace with lucide-react-native if installed
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import HeroSection from "../../Components/HeroSection/HeroSection";
import BottomNav from "../../Components/BottomNav/BottomNav";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";

const PaymentSuccess = () => {
  const navigation = useNavigation();

  const breadcrumbs = [
    { label: "Home", link: "/home" },
    { label: "Checkout", link: "/CheckoutPage" },
    { label: "Payment Success", link: "PaymentSuccess" },
  ];


  useEffect(() => {
    // Scroll reset if needed
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NavbarHeader></NavbarHeader>
        <View>
            <HeroSection productName={'Payment Success'} breadcrumbs={breadcrumbs} ></HeroSection>
        </View>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../../assets/images/payment_success.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Thank You! Payment Successful</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          We’ve received your payment and we’re excited to get things rolling.
          You’ll receive a confirmation email shortly with all the details.
        </Text>

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.secondaryButtonText}>Explore More</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate("Orders")}
          >
            <Icon name="cart-outline" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Go To Orders</Text>
            <Icon name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        <Cta></Cta>
        <Footer></Footer>
      </ScrollView>
      <BottomNav></BottomNav>
    </View>
  );
};

export default PaymentSuccess;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  imageWrapper: {
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  primaryButton: {
    backgroundColor: "#6d28d9",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 6,
  },
  secondaryButton: {
    backgroundColor: "#f3f4f6",
  },
  secondaryButtonText: {
    color: "#374151",
    fontWeight: "600",
  },
});
