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
      content: (
        <View>
          <Text style={styles.listItem}>• Carton Box with moisture resistant gunny bag packing.</Text>
          <Text style={styles.listItem}>• Orders are dispatched within 7 business days.</Text>
          <Text style={styles.listItem}>• Timely delivery to the doorstep / nearest transport godown.</Text>
        </View>
      ),
    },
    {
      title: "Suggested Use",
      content: (
        <View>
          <Text style={styles.listItem}>• Suitable for handloom and power loom weaving.</Text>
          <Text style={styles.listItem}>• Customized processing available on pre-order basis.</Text>
        </View>
      ),
    },
    {
      title: "Precautions",
      content: (
        <View>
          <Text style={styles.listItem}>• Store yarns in a dry, cool place away from sunlight.</Text>
          <Text style={styles.listItem}>• Keep packaging sealed to avoid dust accumulation.</Text>
          <Text style={styles.listItem}>• Storage area should be rodent-free with pest control.</Text>
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

  console.log(product.id,size,variantType)

  useEffect(() => {
    if (product?.id) {
      loadColors();
    }
  }, [product]);

  const loadColors = async () => {
  if (!size) return;

  // Extract only the first token before space → "2/80"
  const normalizedSize = size.split(" ")[0];  

  console.log("Sending size:", normalizedSize, "variantType:", variantType);

  const colors = await getUnusedActiveColors(product.id, normalizedSize, variantType);
  console.log("API returned colors:", colors);

  setFilteredColors(colors);
};

  

  console.log(filteredColors)
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
      <ScrollView>
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
            <Text style={{ color: "#2563eb", fontWeight: "600" }}>Choose Color</Text>
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
            onPress={handleAddToCart}
            style={[styles.addBtn, isInCart && { backgroundColor: "#16a34a" }]}
          >
            <IconCart size={18} color="#fff" />
            <Text style={{ color: "#fff", marginLeft: 6 }}>{isInCart ? "Go to Cart" : "Add to Cart"}</Text>
          </TouchableOpacity>
        </View>

        {/* Accordion */}
        <View style={styles.accordionWrapper}>
          {accordionData.map((section, index) => (
            <View key={index} style={styles.section}>
              <TouchableOpacity onPress={() => toggleAccordion(index)} style={styles.header}>
                <Text style={styles.accordionTitle}>{section.title}</Text>
                <AntDesign name={activeIndex === index ? "up" : "down"} size={20} color="#333" />
              </TouchableOpacity>
              {activeIndex === index && <View style={styles.content}>{section.content}</View>}
            </View>
          ))}
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
            contentContainerStyle={{ paddingVertical: 10 }}
          />
          <View style={{ marginTop: 20, alignItems: "flex-end" }}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.submitBtn}>
              <Text style={{ color: "#fff" }}>Done</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backBtn: {
    marginTop: 16,
    marginLeft: 16,
    padding: 6,
    backgroundColor: "#f3e8ff",
    borderRadius: 6,
    width: 32,
    alignItems: "center",
  },
  productImg: { width: "100%", height: 280, backgroundColor: "#eee" },
  info: { padding: 16 },
  productTitle: { fontSize: 20, fontWeight: "700", color: "#111" },
  price: { fontSize: 22, fontWeight: "700", color: "#6B21A8", marginTop: 8 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FDE68A",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reviewsLabel: { marginLeft: 6, color: "#888" },
  colorSelectBtn: {
    paddingVertical: 8,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2563eb",
    borderRadius: 6,
  },
  selectedWrapper: { flexDirection: "row", flexWrap: "wrap", marginTop: 12 },
  selectedItem: { alignItems: "center", marginRight: 8, marginBottom: 8 },
  selectedImg: { width: 48, height: 48, borderRadius: 4 },
  selectedLabel: { fontSize: 10, marginTop: 2 },
  addBtn: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6B21A8",
    paddingVertical: 10,
    borderRadius: 6,
  },

  // Modal
  modal: { flex: 1, padding: 16, backgroundColor: "#fff" },
  modalClose: { alignSelf: "flex-end" },
  modalTitle: { fontSize: 18, fontWeight: "600", marginBottom: 10 },
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
    margin: "1.5%",
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 6,
    alignItems: "center",
  },
  colorImg: { width: "100%", height: 50, borderRadius: 4 },
  colorName: { fontSize: 10, marginTop: 4 },
  colorCode: { fontSize: 10, color: "#888" },
  submitBtn: {
    backgroundColor: "#6B21A8",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },

  // Accordion
  accordionWrapper: {
    marginTop: 16,
    borderRadius: 8,
    borderColor: "#E9D5FF",
    borderWidth: 1,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: "#E9D5FF",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  accordionTitle: { fontSize: 16, fontWeight: "600", color: "#1F2937" },
  content: { marginTop: 8 },
  accordionText: { fontSize: 14, color: "#4B5563", marginBottom: 6 },
  listItem: { fontSize: 14, color: "#4B5563", marginLeft: 12, marginBottom: 6 },
});
