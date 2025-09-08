import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather'; // Menu and X icons

const MainHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigation = useNavigation();

  const menuItems = [
    { name: t('home'), path: 'Home' },
    { name: t('features'), path: 'Features' },
    { name: t('whyUs'), path: 'WhyUs' },
    { name: t('products'), path: 'Products' },
    { name: t('faqs'), path: 'Faqs' },
    { name: t('blogs'), path: 'Blogs' },
    { name: t('contactUs'), path: 'Contact' },
  ];

  return (
    <View style={styles.header}>
      {/* Logo */}
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        {/* <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" /> */}
      </TouchableOpacity>

      {/* Desktop navigation is skipped - React Native is mobile-only */}
      <View style={styles.languageSwitch}>
        {/* Replace with your LanguageSwitcher if using */}
      </View>

      {/* Hamburger Menu */}
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
        <Icon name={isOpen ? 'x' : 'menu'} size={28} color="#333" />
      </TouchableOpacity>

      {/* Mobile Menu */}
      {isOpen && (
        <View style={styles.mobileMenu}>
          <ScrollView>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.name}
                onPress={() => {
                  navigation.navigate(item.path);
                  setIsOpen(false);
                }}
              >
                <Text style={styles.menuItem}>{item.name}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => {
                setIsOpen(false);
                navigation.navigate('Login');
              }}
              style={styles.signupButton}
            >
              <Text style={styles.signupText}>{t('Sign Up')}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 60 : 20,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
  },
  logo: {
    height: 40,
    width: 100,
  },
  languageSwitch: {
    // Placeholder if needed
  },
 mobileMenu: {
  position: 'absolute',
  top: Platform.OS === 'ios' ? 100 : 80,
  right: 0,
  width: '70%',
  backgroundColor: '#fff',
  padding: 20,
  elevation: 20, // for Android
  zIndex: 999,   // for iOS
  borderRadius: 10,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
},
  menuItem: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#333',
  },
  signupButton: {
    marginTop: 20,
    borderColor: '#6b21a8',
    borderWidth: 1,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
  },
  signupText: {
    color: '#6b21a8',
    fontWeight: 'bold',
  },
});

export default MainHeader;
