// ProductDetailPage.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";

import { addToCart, getCart } from "../../Service/CartService";
import { getUnusedActiveColors } from "../../Service/ColorService";
import Toast from "../../Components/Toast/Toast";
import { useAppContext } from "../../Utils/AppContext";
import { AntDesign } from "@expo/vector-icons";
import IconBack from "react-native-vector-icons/Ionicons";
import IconCart from "react-native-vector-icons/Ionicons";
import IconClose from "react-native-vector-icons/Ionicons";
import IconStar from "react-native-vector-icons/MaterialIcons";
import BottomNav from "../../Components/BottomNav/BottomNav";
import NavbarHeader from "../../Components/NavBarHeader/NavbarHeader";
import Cta from "../../Components/Cta/Cta";
import Footer from "../../Components/Footer/Footer";
import IconInfo from "react-native-vector-icons/Feather";
import IconPackage from "react-native-vector-icons/Feather";
import IconSettings from "react-native-vector-icons/Feather";
import IconShield from "react-native-vector-icons/Feather";


import { Fonts } from '../Utils/Fonts';
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProductDetailPage() {
  const route = useRoute();
  const navigation = useNavigation();
  const { updateCartAndWishlistCounts } = useAppContext();

  const {
    product,
    size,
    color,
    price,
    variantType,
    markupPrice,
    variantDescription,
    categoryName,
    selectedVariantType,
    selectedCounters,
  } = route.params || {};

  const backendUrl = process.env.REACT_APP_IMAGE_URL;
  const [toast, setToast] = useState(null);
  const [filteredColors, setFilteredColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchColor, setSearchColor] = useState("");
  const [isInCart, setIsInCart] = useState(false);
  const [customer, setCustomer] = useState(null);

  // Accordion state
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Accordion data
 const accordionData = [
  {
    title: "Product Description",
    icon: "info",
    iconColor: "#6B21A8",
    content: (
      <View>
        {(variantDescription || "No description available.")
          .split("\n")
          .map((line, idx) => (
            <Text key={idx} style={styles.accordionText}>
              {line.trim()}
            </Text>
          ))}
      </View>
    ),
  },
  {
    title: "Packaging & Delivery",
    icon: "package",
    iconColor: "#6B21A8",
    content: (
      <View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Carton Box with moisture resistant gunny bag packing.</Text>
        </View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Orders are dispatched within 7 business days.</Text>
        </View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Timely delivery to the doorstep / nearest transport godown.</Text>
        </View>
      </View>
    ),
  },
  {
    title: "Suggested Use",
    icon: "settings",
    iconColor: "#6B21A8",
    content: (
      <View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Suitable for handloom and power loom weaving.</Text>
        </View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Customized processing available on pre-order basis.</Text>
        </View>
      </View>
    ),
  },
  {
    title: "Precautions",
    icon: "shield",
    iconColor: "#6B21A8",
    content: (
      <View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Store yarns in a dry, cool place away from sunlight.</Text>
        </View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Keep packaging sealed to avoid dust accumulation.</Text>
        </View>
        <View style={styles.listItemRow}>
          <View style={styles.bulletPoint} />
          <Text style={styles.listItem}>Storage area should be rodent-free with pest control.</Text>
        </View>
      </View>
    ),
  },
];


  useEffect(() => {
    const loadCustomer = async () => {
      const raw = await AsyncStorage.getItem("userData");
      const parsed = raw ? JSON.parse(raw) : null;
      setCustomer(parsed);
    };
    loadCustomer();
  }, []);

useEffect(() => {
  if (product?.id) {
    loadColors();
  }
}, [product, size, variantType]); // ✅ also re-run when size/type changes

const loadColors = async () => {
  try {
    if (!product?.id) {
      console.warn("⚠️ No product.id available, skipping fetch");
      return;
    }
    const colors = await getUnusedActiveColors(product.id, size, variantType);
    setFilteredColors(colors || []);
  } catch (err) {
    setFilteredColors([]); // fallback to empty
  }
};


  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    if (!customer?.customerId) {
      showToast("Please login", "error");
      return;
    }
    if (selectedColors.length === 0) {
      showToast("Please select a color", "error");
      return;
    }

    const cart = await getCart(customer.customerId);
    const currentItems = cart.cartItems || [];

    let added = false;
    for (let variant of selectedColors) {
      const inCart = currentItems.some((x) => x.variantId === variant.id);
      if (!inCart) {
        await addToCart(customer.customerId, variant.id, 1);
        added = true;
      }
    }

    setIsInCart(true);
    updateCartAndWishlistCounts();

    showToast(added ? "Item added to cart" : "Already in cart", added ? "success" : "info");
  };

  const handleColorSelect = (item) => {
    const exists = selectedColors.find((c) => c.id === item.id);
    if (exists) {
      setSelectedColors((prev) => prev.filter((x) => x.id !== item.id));
    } else {
      setSelectedColors((prev) => [...prev, item]);
    }
  };

  const filteredList = filteredColors.filter(
    (c) => c.colorName.toLowerCase().includes(searchColor) || c.colorCode.toLowerCase().includes(searchColor)
  );

  const renderColorItem = ({ item }) => {
    const selected = selectedColors.some((c) => c.id === item.id);
    return (
      <TouchableOpacity
        onPress={() => handleColorSelect(item)}
        style={[styles.colorItem, selected && { borderColor: "#6B21A8" }]}
      >
        <Image source={{ uri: backendUrl + item.colorImage }} style={styles.colorImg} />
        <Text style={styles.colorName}>{item.colorName}</Text>
        <Text style={styles.colorCode}>{item.hexCode}</Text>
      </TouchableOpacity>
    );
  };

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>No product details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ marginBottom: 100 }}>
        <NavbarHeader />
        {/* Back Button */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Category", {
              categoryName,
              selectedVariantType,
              selectedCounters,
            })
          }
          style={styles.backBtn}
        >
          <IconBack name="arrow-back" size={20} color="#6B21A8" />
        </TouchableOpacity>

        {/* Product Image */}
        <Image
          resizeMode="contain"
          source={{
            uri:
              backendUrl +
              (product.productImage.find((x) => x.includes(variantType.toLowerCase())) || product.productImage[0]),
          }}
          style={styles.productImg}
        />

        {/* Info Block */}
        <View style={styles.info}>
          <Text style={styles.productTitle}>
            {product.productName} - {size} - {variantType}
          </Text>

          <View style={styles.ratingRow}>
            <View style={styles.ratingBox}>
              <IconStar name="star" size={16} color="#d97706" />
              <Text>4.5</Text>
            </View>
            <Text style={styles.reviewsLabel}>(32 reviews)</Text>
          </View>

          <Text style={styles.price}>₹{Math.round(price)}</Text>

          {/* Color Selector */}
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.colorSelectBtn}>
            <Image source={require("../../assets/Images/select-color.png")} style={styles.colorPaletteIcon} />
            <Text style={{ color: "#2563eb", fontWeight: "600" }}>Click here for color catalogue</Text>
          </TouchableOpacity>

          {/* Selected Colors */}
          <View style={styles.selectedWrapper}>
            {selectedColors.map((c) => (
              <View key={c.id} style={styles.selectedItem}>
                <Image source={{ uri: backendUrl + c.colorImage }} style={styles.selectedImg} />
                <Text style={styles.selectedLabel}>{c.colorName}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (isInCart) {
                navigation.navigate("Cart"); 
              } else {
                handleAddToCart();
              }
            }}
            style={[styles.addBtn, isInCart && { backgroundColor: "#16a34a" }]}
          >
            <IconCart size={18} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: "#fff", marginLeft: 6 }}>
              {isInCart ? "GO TO CART" : "ADD TO CART"}
            </Text>
          </TouchableOpacity>

        </View>

        {/* Accordion */}
        <View style={styles.accordionWrapper}>
        
  <Text style={styles.sectionHeaderTitle}>Product Information</Text>
  {accordionData.map((section, index) => (
    <View key={index} style={[
      styles.section, 
      index === accordionData.length - 1 && { borderBottomWidth: 0 }
    ]}>
      <TouchableOpacity onPress={() => toggleAccordion(index)} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: `${section.iconColor}15` }]}>
            <IconInfo name={section.icon} size={18} color={section.iconColor} />
          </View>
          <Text style={styles.accordionTitle}>{section.title}</Text>
        </View>
        <View style={[styles.chevronContainer, activeIndex === index && styles.chevronActive]}>
          <AntDesign name="down" size={18} color="#4b5563" />
        </View>
      </TouchableOpacity>
      {activeIndex === index && (
        <View style={styles.content}>
          {section.content}
        </View>
      )}
    </View>
  ))}
</View>
        <View style={{ marginTop: 20 }}>
        <Cta></Cta>
        </View>

        <View style={{ marginTop: 20 }}>
          <Footer></Footer>
        </View>
      </ScrollView>

      {/* ----- Color Modal ----- */}
      <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)} animationType="slide">
        <View style={styles.modal}>
          <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
            <IconClose name="close" size={22} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Select Colors</Text>
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            onChangeText={(v) => setSearchColor(v.toLowerCase())}
          />
          <FlatList
            data={filteredList}
            numColumns={3}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderColorItem}
            contentContainerStyle={{ paddingVertical: 4 }}
          />
          <View style={{ marginTop: 20, alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.submitBtn}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: "#fff" }}>DONE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
     flex: 1, backgroundColor: "#fff" 
  },
  centered: {
     flex: 1, justifyContent: "center", alignItems: "center" 
  },
  backBtn: {
    
    margin: 16,
    marginLeft: 16,
    padding: 6,
    backgroundColor: "#f3e8ff",
    borderRadius: 6,
    width: 32,
    alignItems: "center",
  
  },
  productImg: {
     width: "100%", height: 450, backgroundColor: "#eee" 
  },
  info: {
     padding: 16 
  },
  productTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20, fontWeight: "700", color: "#111"
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: 22, fontWeight: "700", color: "#6B21A8", marginTop: 8
  },
  ratingRow: {
     flexDirection: "row", alignItems: "center", marginTop: 6 
  },
  ratingBox: {
    
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDE68A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  
  },
  reviewsLabel: {
     marginLeft: 6, color: "#888" 
  },
  colorSelectBtn: {
    
    paddingVertical: 8,
    marginTop: 12,
    alignItems: "center",
    borderRadius: 6,
    display: "flex",
    flexDirection: "row",
    gap: 10,
  
  },
  colorPaletteIcon: {
     width: 30, height: 30, resizeMode: "contain" 
  },
  selectedWrapper: {
     flexDirection: "row", flexWrap: "wrap", marginTop: 12 
  },
  selectedItem: {
     alignItems: "center", marginRight: 8, marginBottom: 8 
  },
  selectedImg: {
     width: 48, height: 48, borderRadius: 4 
  },
  selectedLabel: {
    fontFamily: Fonts.regular,
    fontSize: 10, marginTop: 2
  },
  addBtn: {
    
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#6B21A8',
  
  },

  // Modal
  modal: {
     flex: 1, padding: 16, backgroundColor: "#fff" 
  },
  modalClose: {
     alignSelf: "flex-end" 
  },
  modalTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 18, fontWeight: "600", marginBottom: 10
  },
  searchInput: {
    
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    marginBottom: 12,
  
  },
  colorItem: {
    
    width: "30%",
    aspectRatio: 0.78,
    margin: "1.5%",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    justifyContent: "space-between", // Changed from flex-start
    backgroundColor: "#fff",
  
  },
  colorImg: {
     
    width: "95%", // Reduced from 80% to give more equal padding
    height: "69%", // Reduced from 65% to give more equal padding
    borderRadius: 6,
    resizeMode: "contain",
    backgroundColor: "#f5f5f5",
    marginTop: 5, 
    marginBottom: 6,
  
  },
  colorName: {
    fontFamily: Fonts.bold,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 5, // Add bottom margin for equal spacing below
  },

  submitBtn: {
    
      backgroundColor: "#6B21A8",
      paddingVertical: 12,
      paddingHorizontal: 48,
      alignItems: 'center',
      borderRadius: 8,
    
  },
// colorCode: {
    fontFamily: Fonts.regular,
    //   fontSize: 10, 
//   color: "#666",
//   textAlign: "center",
//   marginTop: 2,
//
  },

  // Accordion
accordionWrapper: {
    
  marginTop: 24,
  borderRadius: 12,
  backgroundColor: "#fff",


  },

sectionHeaderTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
  fontWeight: "700",
  color: "#121313ff",
  marginBottom: 16,
  letterSpacing: 0.5,
  marginHorizontal: 16,
  },

section: {
    
  borderBottomWidth: 1,
  borderBottomColor: "#F3F4F6",
    marginHorizontal: 16,


  },
header: {
     
  flexDirection: "row", 
  justifyContent: "space-between", 
  alignItems: "center",
  paddingVertical: 16,
  paddingHorizontal: 16,

  },
headerLeft: {
    
  flexDirection: "row",
  alignItems: "center",
  flex: 1,

  },
iconContainer: {
    
  width: 36,
  height: 36,
  borderRadius: 18,
  justifyContent: "center",
  alignItems: "center",
  marginRight: 12,

  },
accordionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 16, 
  fontWeight: "600", 
  color: "#1F2937",
  flex: 1,
  },
chevronContainer: {
    
  width: 28,
  height: 28,
  borderRadius: 20,
  backgroundColor: "#F9FAFB",
  justifyContent: "center",
  alignItems: "center",
  transform: [{ rotate: "0deg" 
  }],
},
chevronActive: {
    
  transform: [{ rotate: "180deg" 
  }],
  backgroundColor: "#EDE9FE",
},
content: {
     
  paddingHorizontal: 16,
  paddingBottom: 16,
  paddingTop: 4,

  },
accordionText: {
    fontFamily: Fonts.regular,
    fontSize: 14, 
  color: "#6B7280", 
  lineHeight: 20,
  marginBottom: 8,
  },
listItemRow: {
    
  flexDirection: "row",
  alignItems: "flex-start",
  marginBottom: 8,

  },
bulletPoint: {
    
  width: 6,
  height: 6,
  borderRadius: 3,
  backgroundColor: "#6B21A8",
  marginTop: 7,
  marginRight: 12,

  },
listItem: {
    fontFamily: Fonts.regular,
    fontSize: 14, 
  color: "#6B7280", 
  lineHeight: 20,
  flex: 1,
  },

});
