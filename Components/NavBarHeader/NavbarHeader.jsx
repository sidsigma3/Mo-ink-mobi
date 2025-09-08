import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const NavbarHeader = () => {
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [customerData, setCustomerData] = useState({});

  const fetchCustomerData = async () => {
    const data = await AsyncStorage.getItem('userData');
    if (data) setCustomerData(JSON.parse(data));
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.navigate('Login');
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  return (
    <View style={styles.header}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Image source={require('../../assets/Images/logo.png')} style={styles.logo} />
      </TouchableOpacity>

      {/* Right side icons */}
      <View style={styles.iconGroup}>
        <TouchableOpacity onPress={() => navigation.navigate('Wishlist')}>
          <Icon name="heart-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSidebarVisible(true)}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Slide-out Menu */}
      <Modal
        visible={sidebarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSidebarVisible(false)}
        >
          <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
              <Text style={styles.sidebarTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setSidebarVisible(false)}>
                <Icon name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* <Text style={styles.sidebarItem}>{customerData?.customerName || 'Guest'}</Text>
              <Text style={styles.sidebarItem}>{customerData?.email || ''}</Text> */}

              <TouchableOpacity onPress={() => navigation.navigate('Landing')}>
                <Text style={styles.sidebarItem}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text style={styles.sidebarItem}>About</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Blogs')}>
                <Text style={styles.sidebarItem}>Blogs</Text>
              </TouchableOpacity>

              <TouchableOpacity  onPress={()=>navigation.navigate('Contact')}>
                <Text style={styles.sidebarItem}>Contact</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default NavbarHeader;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    paddingTop:30,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  sidebar: {
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sidebarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sidebarItem: {
    fontSize: 16,
    paddingVertical: 12,
    color: '#333',
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#E53935',
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
