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

import { Fonts } from '../../Utils/Fonts';
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

    try {
      setLoading(true);

      const updatedData = {
        customerName: `${firstName} ${lastName}`.trim(),
        gstNumber: gst || null,
        whatsappNumber: whatsapp || null,
        company: company || null,
      };

      // ✅ Use customer.id directly
      await updateCustomerDetails(customer.id, updatedData);

      // ✅ Update AsyncStorage
      const mergedData = { ...customer, ...updatedData };
      await AsyncStorage.setItem('customerData', JSON.stringify(mergedData));

      Alert.alert("Success", "Profile updated successfully");
      navigation.navigate('AccountCreatedScreen');

    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to update profile");
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
    fontFamily: Fonts.bold,
    fontSize: 24,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'start',
  },
  subheader: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: '#555',
    textAlign: 'start',
  },
  input: {
    fontFamily: Fonts.regular,
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
    fontFamily: Fonts.bold,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

});