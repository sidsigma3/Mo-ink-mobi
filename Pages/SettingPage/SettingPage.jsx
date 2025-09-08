import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert
} from 'react-native';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import Navbar from '../../Components/Navbar/Navbar';
import HeroSection from '../../Components/HeroSection/HeroSection';
import Cta from '../../Components/Cta/Cta';
import Footer from '../../Components/Footer/Footer';
import BottomNav from '../../Components/BottomNav/BottomNav';
import SelectState from '../../Components/selectState/SelectState';
import { getCustomerDetails , updateCustomerDetails } from '../../Service/CustomerService';
import Toast from '../../Components/Toast/Toast';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SettingPage() {
  const navigation = useNavigation();

  const [customerDetails, setCustomerDetails] = useState({});
  const [customer, setCustomer] = useState({});
  const [originalCustomer, setOriginalCustomer] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [toasts, setToasts] = useState([]);

  const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('userData');
    return jsonValue != null ? JSON.parse(jsonValue) : {};
  } catch (e) {
    console.error('Error reading value', e);
    return {};
  }
};

const [customerData, setCustomerData] = useState({});
const [userData, setUserData] = useState({});

useEffect(() => {
  (async () => {
    setCustomerData(await getUserData());
    setUserData(await getUserData());
  })();
}, []);


  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomerDetails(customerData.customerId);
        setCustomerDetails(data.data);
      } catch (error) {
        console.error('Failed to load customer data', error);
      }
    };
    fetchCustomerData();
  }, []);

  useEffect(() => {
    if (!customerDetails || Object.keys(customerDetails).length === 0) return;

    const workAddressIndex = customerDetails.addresses.findIndex(
      addr => addr.addressType === 'HOME'
    );
    const firstAddress = customerDetails.addresses[workAddressIndex];

    const formattedCustomer = {
      fullName: customerDetails.customerName || '',
      password: customerDetails.password || '',
      gender: customerDetails.gender || '',
      country: firstAddress.country || '',
      email: customerDetails.email || '',
      language: customerDetails.language || '',
      mobile: customerDetails.phoneNumber || '',
      whatsapp: customerDetails.whatsappNumber || '',
      pincode: firstAddress.zipcode || '',
      state: firstAddress.state || '',
      city: firstAddress.city || '',
      landmark: firstAddress.street || '',
      gstNumber: customerDetails.gstNumber || '',
      customerStatus: customerDetails.customerStatus
    };

    setCustomer(formattedCustomer);
    setOriginalCustomer(formattedCustomer);
  }, [customerDetails]);

  useEffect(() => {
    setIsModified(JSON.stringify(customer) !== JSON.stringify(originalCustomer));
  }, [customer, originalCustomer]);

  const showToast = (message, type = 'error') => {
    setToasts([{ id: Date.now(), message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  const handleInputChange = (name, value) => {
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!customerDetails) {
      showToast('Customer details not loaded.');
      return;
    }

    const existingAddresses = [...(customerDetails.addresses || [])];
    const workAddressIndex = existingAddresses.findIndex(addr => addr.addressType === 'HOME');
    const existingAddress = existingAddresses[workAddressIndex];

    const updatedAddress = {
      ...(existingAddress?.id ? { id: existingAddress.id } : {}),
      customerAddress: customer.landmark,
      street: customer.landmark,
      city: customer.city,
      state: customer.state,
      country: customer.country,
      zipcode: customer.pincode,
      addressType: 'HOME'
    };

    if (workAddressIndex !== -1) {
      existingAddresses[workAddressIndex] = updatedAddress;
    } else {
      existingAddresses.push(updatedAddress);
    }

    const updatedCustomerData = {
      customerName: customer.fullName,
      phoneNumber: customer.mobile,
      whatsappNumber: customer.whatsapp,
      email: customer.email,
      gstNumber: customer.gstNumber || '',
      customerAddress: customer.landmark,
      zipcode: customer.pincode,
      addresses: existingAddresses.slice(0, 3),
      customerStatus: customerDetails.customerStatus,
      company: userData.company
    };

    try {
      await updateCustomerDetails(customerDetails.customerId, updatedCustomerData);
      showToast('Changes saved successfully!', 'success');
      setOriginalCustomer(customer);
    } catch (error) {
      console.error('❌ Failed to save changes:', error);
      showToast('Failed to save changes.');
    }
  };

 const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('isAuthenticated');
    await AsyncStorage.removeItem('userData');
    navigation.navigate('Home');
  } catch (e) {
    console.error('Error clearing storage', e);
  }
};

const breadcrumbs = [
    { label: "Home", link: "/home" },
    { label: "Account", link: "/account" },
    { label: "Profile", link: "/setting" },
  ];


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <NavbarHeader />
        <HeroSection 
        productName={'Profile'} 
        breadcrumbs={breadcrumbs}
        />

        <View style={styles.formContainer}>
          <LabelInput label="Full Name" value={customer.fullName} onChangeText={val => handleInputChange('fullName', val)} />
          <LabelInput label="Password" value={customer.password} secureTextEntry onChangeText={val => handleInputChange('password', val)} />
          <LabelInput label="Country" value={customer.country} onChangeText={val => handleInputChange('country', val)} />
          <LabelInput label="Email" value={customer.email} onChangeText={val => handleInputChange('email', val)} />
          <LabelInput label="Mobile number" value={customer.mobile} onChangeText={val => handleInputChange('mobile', val)} />
          <LabelInput label="WhatsApp number" value={customer.whatsapp} onChangeText={val => handleInputChange('whatsapp', val)} />
          <LabelInput label="GST number" value={customer.gstNumber} onChangeText={val => handleInputChange('gstNumber', val)} />
          <LabelInput label="Pincode" value={customer.pincode} onChangeText={val => handleInputChange('pincode', val)} />
          <Text style={styles.label}>State</Text>
          <SelectState value={customer.state} onChange={val => handleInputChange('state', val)} />
          <LabelInput label="City" value={customer.city} onChangeText={val => handleInputChange('city', val)} />
          <LabelInput label="Landmark" value={customer.landmark} onChangeText={val => handleInputChange('landmark', val)} />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={handleLogout} style={[styles.button, styles.logoutBtn]}>
            <Text style={styles.logoutText}>LOG OUT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveChanges}
            disabled={!isModified}
            style={[styles.button, isModified ? styles.saveBtn : styles.disabledBtn]}
          >
            <Text style={isModified ? styles.saveText : styles.disabledText}>SAVE CHANGES</Text>
          </TouchableOpacity>
        </View>

        <Cta />
        <Footer />
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>

      {toasts.map(toast => (
        <Toast key={toast.id} message={toast.message} type={toast.type} />
      ))}
    </View>
  );
}

function LabelInput({ label, ...props }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 100 },
  formContainer: { paddingHorizontal: 16, paddingVertical: 8 },
  inputGroup: { marginBottom: 12 },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 8, fontSize: 14 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  button: { padding: 12, borderRadius: 6, width: '45%', alignItems: 'center' },
  logoutBtn: { backgroundColor: '#FEE2E2' },
  logoutText: { color: '#EF4444', fontWeight: 'bold' },
  saveBtn: { backgroundColor: '#E9D5FF' },
  saveText: { color: '#6B21A8', fontWeight: 'bold' },
  disabledBtn: { backgroundColor: '#E5E7EB' },
  disabledText: { color: '#9CA3AF' },
  bottomNavContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', elevation: 5
  }
});
