import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateCustomerDetails } from '../../Service/authService';

export default function ProfileScreen({ navigation , route }) {
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
      <Text style={styles.header}>Create profile</Text>
      <Text style={styles.subheader}>Make it yours - Build your profile</Text>

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
        placeholder="Whatsapp"
        style={styles.input}
        value={whatsapp}
        onChangeText={setWhatsapp}
        keyboardType="phone-pad"
      />
      <TextInput
        placeholder="Company"
        style={styles.input}
        value={company}
        onChangeText={setCompany}
      />

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleSave}
        disabled={!firstName || !lastName || loading}
      >
        <Text style={styles.buttonText}>{loading ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#FBFAF7' },
  header: { fontSize:24, marginBottom:4, fontWeight:'bold' },
  subheader: { fontSize:14, marginBottom:16, color:'#555' },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:12, backgroundColor:'#fff' },
  button: { backgroundColor:'#7B32FF', padding:16, borderRadius:8 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center', fontSize:16 },
});
