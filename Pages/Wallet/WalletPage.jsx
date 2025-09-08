import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import Navbar from "../../Components/Navbar/Navbar";
import HeroSection from "../../Components/HeroSection/HeroSection";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import BottomNav from "../../Components/BottomNav/BottomNav";
// import { RiFilePaper2Line } from "react-icons/ri"; 
import * as LucideIcons from "lucide-react-native";
import { getWalletTransactions } from "../../Service/CustomerService";
import { downloadCreditReceipt } from "../../Service/InvoiceService";
import AsyncStorage from '@react-native-async-storage/async-storage';

const WalletPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [customer, setCustomer] = useState(null);

 useEffect(() => {
  const loadCustomer = async () => {
    try {
      const storedData = await AsyncStorage.getItem("userData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (parsedData?.customerId) {
          setCustomer(parsedData);
        }
      }
    } catch (error) {
      console.error("Error reading userData from AsyncStorage", error);
    }
  };

  loadCustomer();
}, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!customer) return;
      setLoading(true);
      try {
        const data = await getWalletTransactions(customer.customerId);
        setTransactions(data || []);
        setWalletBalance(data[data.length - 1]?.totalAmount || 0);
      } catch (error) {
        console.error("Error loading transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    if (customer) {
      fetchTransactions();
    }
  }, [customer]);

  const handleDownloadCreditReceipt = async (source) => {
    const lowerSource = source.toLowerCase();
    const isCancellation = lowerSource.includes("cancellation");
    const isReturn = lowerSource.includes("return");

    const orderIdMatch = source.match(/order:\s*(\d+)/i);
    const returnedIdMatch = source.match(/item:\s*(\d+)/i);

    const orderId = orderIdMatch ? orderIdMatch[1] : null;
    const returnedId = returnedIdMatch ? returnedIdMatch[1] : null;

    if (!orderId || (!isCancellation && !isReturn)) {
      console.error("Invalid source format:", source);
      return;
    }

    const type = isCancellation ? "cancelled" : "returned";

    try {
      if (type === "returned") {
        if (!returnedId) {
          console.error("Returned ID missing for return type");
          return;
        }
        await downloadCreditReceipt(orderId, type, returnedId);
      } else {
        await downloadCreditReceipt(orderId, type);
      }
    } catch (error) {
      console.error("Failed to download credit receipt:", error);
    }
  };

  const breadcrumbs = [
    { label: "Home", link: "/home" },
    { label: "Account", link: "/account" },
    { label: "Wallet", link: "/wallet" },
  ];

  return (
    <View style={{ flex: 1 }}>
     

      <ScrollView style={{ flex: 1, padding: 1}}>
      <View style={{marginTop: 10}}>
      <NavbarHeader/>
      </View>

       <View style={{marginTop: 15}}>
      <HeroSection productName={"Wallet"} breadcrumbs={breadcrumbs} />
      </View>
      {/* Wallet Balance */}
      <View style={styles.balanceBox}>
        <Text style={styles.balanceLabel}>Wallet Balance:</Text>
        <Text style={styles.balanceAmount}>₹{walletBalance.toFixed(0)}</Text>
      </View>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#888" />
            <Text>Loading...</Text>
          </View>
        ) : transactions.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Last Transactions</Text>
            {transactions.slice().reverse().map((item, index) => (
              <View key={index} style={styles.transactionCard}>
                <View style={styles.transactionDate}>
                  <Text style={styles.transactionDay}>
                    {new Date(item.createdAt).getDate()}
                  </Text>
                  <Text style={styles.transactionMonth}>
                    {new Date(item.createdAt).toLocaleString("default", { month: "short" })} '
                    {new Date(item.createdAt).getFullYear().toString().slice(-2)}
                  </Text>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 8 }}>
                  <Text numberOfLines={2} style={{ fontSize: 14 }}>
                    {item.source}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "bold",
                      color: item.type === "CREDIT" ? "#3CAA82" : "#FF0000",
                    }}
                  >
                    {item.type === "DEBIT" ? "−" : "+"}
                    ₹{new Intl.NumberFormat("en-IN").format(item.amount.toFixed(0))}
                  </Text>
                  {(item.source?.includes("Refund for cancellation") ||
                    item.source?.includes("Refund for return")) && (
                    <TouchableOpacity
                      style={styles.downloadButton}
                      onPress={() => handleDownloadCreditReceipt(item.source)}
                    >
                      <LucideIcons.ArrowDownToLine size={16} color="#5b21b6" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.center}>
            {/* <RiFilePaper2Line size={60} color="#ccc" /> */}
            <Text style={{ color: "#888" }}>There's no transaction till now!</Text>
          </View>
        )}

        <Cta />
        <Footer />
      </ScrollView>

      <BottomNav />
    </View>
  );
};

const styles = StyleSheet.create({
  balanceBox: {
    backgroundColor: "#ede9fe",
    padding: 12,
    alignItems: "center",
    marginTop: 15,
  },
  balanceLabel: { fontSize: 18, fontWeight: "bold" },
  balanceAmount: { fontSize: 18, fontWeight: "bold", color: "green" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginVertical: 8 },
  transactionCard: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  transactionDate: {
    backgroundColor: "#5b21b6",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  transactionDay: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  transactionMonth: { color: "#fff", fontSize: 12 },
  downloadButton: {
    marginTop: 4,
    backgroundColor: "#ede9fe",
    borderRadius: 50,
    padding: 4,
    alignSelf: "flex-end",
  },
  center: { alignItems: "center", justifyContent: "center", padding: 20 },
});

export default WalletPage;
