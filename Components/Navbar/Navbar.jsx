import React from 'react';
import { View, Text, Image, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome, FontAwesome5 } from '@expo/vector-icons'; // or 'react-native-vector-icons'

const Navbar = () => {
  const navigation = useNavigation();

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  };

  return (
    <View style={styles.navbar}>
      {/* Navigation Links */}
      <View style={styles.navLinks}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.linkText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('About')}>
          <Text style={styles.linkText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Blogs')}>
          <Text style={styles.linkText}>Blog</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
          <Text style={styles.linkText}>Contact</Text>
        </TouchableOpacity>
      </View>

      {/* Social & Contact */}
      <View style={styles.socialAndContact}>
        {/* Social Icons */}
        <View style={styles.socialIcons}>
          <TouchableOpacity onPress={() => openLink('https://www.linkedin.com/company/inkndyes/?originalSubdomain=in')}>
            <FontAwesome name="linkedin-square" size={24} color="#0e76a8" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://facebook.com')}>
            <FontAwesome name="facebook-square" size={24} color="#4267B2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://instagram.com')}>
            <FontAwesome name="instagram" size={24} color="#E1306C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => openLink('https://wa.me/917878865412')}>
            <FontAwesome name="whatsapp" size={24} color="#25D366" />
          </TouchableOpacity>
        </View>

        {/* Contact Info */}
        <View style={styles.contact}>
          <Ionicons name="headset" size={30} color="#6B21A8" />
          <View style={{ marginLeft: 8 }}>
            <Text style={styles.phone}>+91 74069 44477</Text>
            <Text style={styles.subText}>24/7 Support center</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'column',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  navLinks: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  linkText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  socialAndContact: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  socialIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  contact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phone: {
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  subText: {
    color: '#888',
    fontSize: 12,
  },
});
