// ModalAddress.native.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // You can change the icon set
import Toast from "react-native-toast-message"; // Optional for toast notifications

const ModalAddress = ({
  visible,
  onClose,
  onAddressSaved,
  customer,
  selectedAddress,
  usedAddressTypes = [],
}) => {
  const [formData, setFormData] = useState({
    customerAddress: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    zipcode: "",
    addressType: "HOME",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedAddress) {
      setFormData(selectedAddress);
    } else {
      const allTypes = ["HOME", "WORK", "OTHER"];
      const usedSet = new Set(usedAddressTypes);
      const availableType =
        allTypes.find((type) => !usedSet.has(type)) || "OTHER";

      setFormData({
        customerAddress: "",
        street: "",
        city: "",
        state: "",
        country: "India",
        zipcode: "",
        addressType: availableType,
      });
    }
  }, [selectedAddress, usedAddressTypes]);

  const showToast = (message, type = "error") => {
    Toast.show({
      type: type === "error" ? "error" : "success",
      text1: message,
    });
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressType = (type) => {
    setFormData((prev) => ({ ...prev, addressType: type }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    const requiredFields = [
      "customerAddress",
      "street",
      "city",
      "state",
      "country",
      "zipcode",
      "addressType",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field] || formData[field].trim() === ""
    );

    if (emptyFields.length > 0) {
      showToast("Please fill all required fields.");
      setIsSubmitting(false);
      return;
    }

    const existingAddresses = customer.addresses || [];

    const alreadyExists =
      existingAddresses.some(
        (addr) => addr.addressType === formData.addressType
      ) && !selectedAddress;

    if (alreadyExists) {
      showToast(`${formData.addressType} address already exists.`);
      setIsSubmitting(false);
      return;
    }

    try {
      let updatedAddresses;

      if (selectedAddress) {
        updatedAddresses = existingAddresses.map((addr) =>
          addr.addressType === selectedAddress.addressType
            ? { ...addr, ...formData }
            : addr
        );
      } else {
        updatedAddresses = [...existingAddresses, { ...formData }];
      }

      // Save (replace this with your API call)
      console.log("Saving address:", updatedAddresses);

      onClose();
      if (onAddressSaved) onAddressSaved();

      showToast("Address saved successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>
            {selectedAddress ? "Edit Address" : "Add New Address"}
          </Text>

          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Address *"
              value={formData.customerAddress}
              onChangeText={(text) => handleChange("customerAddress", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Apartment, suite, etc *"
              value={formData.street}
              onChangeText={(text) => handleChange("street", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Country *"
              value={formData.country}
              onChangeText={(text) => handleChange("country", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="State *"
              value={formData.state}
              onChangeText={(text) => handleChange("state", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="City *"
              value={formData.city}
              onChangeText={(text) => handleChange("city", text)}
            />
            <TextInput
              style={styles.input}
              placeholder="PIN code *"
              keyboardType="numeric"
              value={formData.zipcode}
              onChangeText={(text) => handleChange("zipcode", text)}
            />

            <Text style={styles.label}>Type of Address *</Text>
            <View style={styles.typeContainer}>
                {["HOME", "WORK", "OTHER"].map((label) => {
                    const safeUsedTypes = Array.isArray(usedAddressTypes) ? usedAddressTypes : [];
                    const isUsed = safeUsedTypes.includes(label);
                    const isEditingSameType = selectedAddress?.addressType === label;
                    const shouldDisable = isUsed && !isEditingSameType;

                    return (
                    <TouchableOpacity
                        key={label}
                        style={[
                        styles.typeButton,
                        formData.addressType === label && styles.typeButtonActive,
                        shouldDisable && styles.typeButtonDisabled,
                        ]}
                        disabled={shouldDisable}
                        onPress={() => handleAddressType(label)}
                    >
                        <Icon
                        name={
                            label === "HOME"
                            ? "home-outline"
                            : label === "WORK"
                            ? "briefcase-outline"
                            : "business-outline"
                        }
                        size={18}
                        color={formData.addressType === label ? "#fff" : "#555"}
                        />
                        <Text
                        style={[
                            styles.typeText,
                            formData.addressType === label && { color: "#fff" },
                            shouldDisable && { color: "#aaa" },
                        ]}
                        >
                        {label}
                        </Text>
                    </TouchableOpacity>
                    );
                })}
                </View>

          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>CANCEL</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "SAVING..." : "SAVE"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <Toast />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    maxHeight: "90%",
  },
  title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
  },
  label: { fontWeight: "bold", marginTop: 10 },
  typeContainer: { flexDirection: "row", gap: 10, marginTop: 5 },
  typeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 10,
  },
  typeButtonActive: { backgroundColor: "#6b21a8", borderColor: "#6b21a8" },
  typeButtonDisabled: { backgroundColor: "#f0f0f0", borderColor: "#ddd" },
  typeText: { marginLeft: 5 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  button: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 8 },
  cancelButton: { backgroundColor: "#6b7280" },
  saveButton: { backgroundColor: "#6b21a8" },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
});

export default ModalAddress;
