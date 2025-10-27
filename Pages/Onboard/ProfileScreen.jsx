import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateCustomerDetails } from '../../Service/authService';
import { createCustomer } from '../../Service/CustomerService';
export default function ProfileScreen({ navigation, route }) {
  const { customer } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gst, setGst] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);

const handleSave = async () => {
  if (!firstName || !lastName) {
    Alert.alert("Error", "First name and last name are required");
    return;
  }

  console.log('hello')

  try {
    setLoading(true);

    // ✅ Build payload exactly as backend expects
    const customerData = {
      customerName: `${firstName.trim()} ${lastName.trim()}`,
      phoneNumber: route.params?.phone || "",
      whatsappNumber: whatsapp || route.params?.phone || "",
      email: route.params?.email || "",
      password: route.params?.password || "",
      company: company || "",
      gstNumber: gst || "",
      cancelledCheque: null,
      addresses: [
        {
          customerAddress: "",
          street: "",
          city: "",
          state: "",
          country: "",
          zipcode: "",
          addressType: "HOME"
        }
      ],
      customerStatus: "ACTIVE",
    };

    console.log("📤 Creating customer with data:", customerData);
    console.log("📤 Route params:", route.params);
    const res = await createCustomer(customerData);

    if (res?.data || res?.id) {
      await AsyncStorage.setItem("customerData", JSON.stringify(res));
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("AccountCreatedScreen");
    } else {
      Alert.alert("Error", res?.message || "Account creation failed");
    }

  } catch (err) {
    console.error("❌ Error creating customer:", err.response?.data || err.message);
    Alert.alert("Error", "Something went wrong during account creation");
  } finally {
    setLoading(false);
  }
};


  return (
    <View style={styles.container}>
      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.header}>Create profile</Text>
        <Text style={styles.subheader}>
          Make it yours - Build your profile and personalize your experience with us.
        </Text>

        <TextInput
          placeholder="First name"
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />

        <TextInput
          placeholder="Last name"
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
        />

        <TextInput
          placeholder="GST number (optional)"
          style={styles.input}
          value={gst}
          onChangeText={setGst}
        />

        <TextInput
          placeholder="WhatsApp number"
          style={styles.input}
          value={whatsapp}
          onChangeText={setWhatsapp}
          keyboardType="phone-pad"
        />

        <TextInput
          placeholder="Company (optional)"
          style={styles.input}
          value={company}
          onChangeText={setCompany}
        />
      </View>

      {/* Button at Bottom */}
      <TouchableOpacity
        style={[styles.button, (loading || !firstName || !lastName) && { opacity: 0.5 }]}
        onPress={handleSave}
        disabled={!firstName || !lastName || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Saving..." : "Save & Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 20,
    paddingTop: 120, // Add top padding for status bar
    paddingBottom: 40, // Add bottom padding
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: {
    fontSize: 24,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'start',
  },
  subheader: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: '#555',
    textAlign: 'start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16, // Reduced margin to fit more inputs
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6B21A8', // Same purple color as CreateAccountScreen
    padding: 18,
    borderRadius: 12,
    marginTop: 'auto', // This pushes the button to the bottom
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});