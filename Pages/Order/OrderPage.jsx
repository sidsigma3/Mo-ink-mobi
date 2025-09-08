import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import HeroSection from "../../Components/HeroSection/HeroSection";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import OrderBox from "../../Components/OrderBox/OrderBox";
import BottomNav from "../../Components/BottomNav/BottomNav";

import { getPaginatedCustomerOrders } from "../../Service/OrderService";

export default function OrderPage() {
  const navigation = useNavigation();
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const userStr = await AsyncStorage.getItem("userData");
      const user = userStr ? JSON.parse(userStr) : {};
      if (user?.customerId) {
        fetchOrders(user.customerId, currentPage);
      }
    })();
  }, [currentPage]);

  const fetchOrders = async (customerId, page) => {
    setLoading(true);
    try {
      const data = await getPaginatedCustomerOrders(customerId, page, 10);

      if (data) {
        setOrders(data.orders || []);
        const totalOrders = data.totalOrders || data.total || 0;
        setTotalPages(Math.ceil(totalOrders / 10));
      } else {
        setOrders([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = (order) => {
    navigation.navigate("OrderDetails", { order });
  };

  const renderOrder = ({ item }) => {
    if (item.status === "PENDING" || item.status === "FAILED") return null;
    return (
      <TouchableOpacity onPress={() => handleOrderClick(item)}>
        <OrderBox order={item} />
      </TouchableOpacity>
    );
  };

   const breadcrumbs = [
    { label: "Home", link: "/home" },
    { label: "Account", link: "/account" },
    { label: "Orders", link: "/orders" },
  ];


  return (
    <View style={{ flex: 1 }}>
      <NavbarHeader />
      <HeroSection productName={"Your Orders"} breadcrumbs={breadcrumbs}/>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6B21A8" />
        ) : orders.filter(o => o.status !== "PENDING" && o.status !== "FAILED").length > 0 ? (
          <FlatList
            data={orders}
            keyExtractor={(item, index) => String(index)}
            renderItem={renderOrder}
          />
        ) : (
          <Text style={styles.noOrders}>No orders found</Text>
        )}
      </View>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
          >
            <Icon name="chevron-back" size={20} color={currentPage === 1 ? "#ccc" : "#6B21A8"} />
          </TouchableOpacity>

          {[...Array(totalPages).keys()].map((_, i) => {
            const page = i + 1;
            return (
              <TouchableOpacity
                key={page}
                onPress={() => setCurrentPage(page)}
                style={[styles.pageButton, currentPage === page && styles.activePage]}
              >
                <Text style={currentPage === page ? styles.activeText : styles.pageText}>
                  {page}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
          >
            <Icon name="chevron-forward" size={20} color={currentPage === totalPages ? "#ccc" : "#6B21A8"} />
          </TouchableOpacity>
        </View>
      )}

      <Cta />
      <Footer />
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  noOrders: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#6B21A8",
    marginHorizontal: 2,
    borderRadius: 4,
  },
  pageText: {
    color: "#6B21A8",
  },
  activePage: {
    backgroundColor: "#6B21A8",
  },
  activeText: {
    color: "#fff",
  },
  disabledButton: {
    borderColor: "#ccc",
  },
});
