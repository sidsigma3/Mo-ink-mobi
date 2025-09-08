// AddressPage.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import AddressBox from '../../Components/AddressBox/AddressBox';
import ModalAddress from '../../Components/Modal/ModalAddress';
import Toast from '../../Components/Toast/Toast';
import Cta from '../../Components/Cta/Cta';
import Footer from "../../Components/Footer/Footer";
import HeroSection from '../../Components/HeroSection/HeroSection';
import BottomNav from '../../Components/BottomNav/BottomNav';
import { getCustomerDetails, deleteCustomerAddress } from '../../Service/CustomerService';
import Icon from 'react-native-vector-icons/Ionicons';

export default function AddressPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);

  const fetchCustomerData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');
      const storedCustomer = storedData ? JSON.parse(storedData) : {};
      const customerId = storedCustomer.customerId;

      if (!customerId) {
        console.error('Customer ID not found in storage');
        setLoading(false);
        return;
      }

      const customerData = await getCustomerDetails(customerId);
      setAddresses(customerData.data?.addresses || []);
      setCustomer(customerData.data);
      await AsyncStorage.setItem('userData', JSON.stringify(customerData.data));
    } catch (error) {
      console.error('Failed to fetch customer data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const addressTypesPresent = Array.isArray(addresses)
    ? new Set(addresses.map((addr) => addr.addressType))
    : new Set();

  const handleOpenModal = (address) => {
    setSelectedAddress(address || null);
    setShowModal(true);
  };

  const handleAddressSaved = async () => {
    await fetchCustomerData();
    showToast('Address saved successfully', 'success');
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedAddress(null);
  };

  const isAddDisabled =
    addressTypesPresent.has('HOME') &&
    addressTypesPresent.has('WORK') &&
    addressTypesPresent.has('OTHER');

  const handleDeleteAddress = async (typeToDelete) => {
    setShowModal(false);
    setSelectedAddress(null);

    try {
      const addressToDelete = customer.addresses.find(
        (address) => address.addressType === typeToDelete
      );

      if (!addressToDelete) {
        showToast('Address not found!', 'error');
        return;
      }

      await deleteCustomerAddress(customer.customerId, addressToDelete.id);
      await fetchCustomerData();
      showToast('Address deleted successfully!', 'success');
    } catch (error) {
      console.error('Failed to delete address:', error);
      showToast('Something went wrong while deleting the address.', 'error');
    }
  };

  const showToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6B21A8" />
      </View>
    );
  }

   const breadcrumbs = [
        { label: "Home", link: "/home" },
        { label: "Account", link: "/account" },
        { label: "Address", link: "/address" },
    ];

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <NavbarHeader />
    
      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add New Address Button */}
          <HeroSection productName={"Address"} breadcrumbs={breadcrumbs}></HeroSection>
        <View style={styles.addButtonWrapper}>
          <TouchableOpacity
            style={[
              styles.addButton,
              isAddDisabled && styles.addButtonDisabled,
            ]}
            disabled={isAddDisabled}
            onPress={() => !isAddDisabled && handleOpenModal(null)}
          >
            <Text
              style={[
                styles.addButtonText,
                isAddDisabled && styles.addButtonTextDisabled,
              ]}
            >
              ADD NEW ADDRESS
            </Text>
            <Icon
              name="add-circle-outline"
              size={20}
              color={isAddDisabled ? '#ccc' : '#6B21A8'}
            />
          </TouchableOpacity>
        </View>

        {/* Address List */}
        {addresses.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="location-off-outline" size={70} color="#ccc" />
            <Text style={styles.emptyText}>There's no saved addresses!</Text>
          </View>
        ) : (
          <FlatList
            data={addresses}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOpenModal(item)}>
                <AddressBox
                  address={item}
                  name={customer.customerName}
                  company={customer.company}
                  phone={customer.phoneNumber}
                  onDelete={() => handleDeleteAddress(item.addressType)}
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* CTA Section */}
        <Cta />

        {/* Footer */}
        <Footer />
      </ScrollView>
        <BottomNav></BottomNav>
      {/* Modal */}
      {customer && (
        <ModalAddress
          visible={showModal}
          onClose={handleClose}
          onAddressSaved={handleAddressSaved}
          customer={customer}
          selectedAddress={selectedAddress}
          usedAddressTypes={[...addressTypesPresent]}
        />
      )}

      {/* Toast */}
      <View style={styles.toastWrapper}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() =>
              setToasts((prev) => prev.filter((t) => t.id !== toast.id))
            }
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  addButtonWrapper: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E9D5FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#f3f3f3',
  },
  addButtonText: {
    color: '#6B21A8',
    fontWeight: 'bold',
    marginRight: 6,
  },
  addButtonTextDisabled: {
    color: '#ccc',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastWrapper: {
    position: 'absolute',
    top: 40,
    right: 10,
  },
});
