import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppContext } from '../../Utils/AppContext';
// import { Badge } from 'react-native-elements';

const BottomNav = () => {
  const navigation = useNavigation();
  const route = useRoute();
//   const { cartCount, wishlistCount } = useAppContext();

  const [selected, setSelected] = useState('');

  useEffect(() => {
    if (route.name === 'Home') setSelected('home');
    else if (route.name === 'Wishlist') setSelected('wishlist');
    else if (route.name === 'Cart') setSelected('cart');
    else if (route.name === 'Account') setSelected('profile');
  }, [route.name]);

  const handleClick = (value, screen) => {
    setSelected(value);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Home */}
      <TouchableOpacity
        style={[styles.button, selected === 'home' && styles.activeButton]}
        onPress={() => handleClick('home', 'Landing')}
      >
        <Image
          source={require('../../assets/Images/NavLogo.png')}
          style={{ width: 30, height: 30 }}
        />
        <Text style={[styles.label, selected === 'Landing' && styles.activeLabel]}>Home</Text>
      </TouchableOpacity>

      {/* Wishlist */}
      <TouchableOpacity
        style={[styles.button, selected === 'wishlist' && styles.activeButton]}
        onPress={() => handleClick('wishlist', 'Wishlist')}
      >
        {/* <Badge
          value={wishlistCount}
          status="primary"
          containerStyle={styles.badge}
        /> */}
        <Feather
          name={selected === 'wishlist' ? 'heart' : 'heart'}
          size={22}
          color={selected === 'wishlist' ? '#6D28D9' : '#000'}
        />
        <Text style={[styles.label, selected === 'wishlist' && styles.activeLabel]}>Wishlist</Text>
      </TouchableOpacity>

      {/* Cart */}
      <TouchableOpacity
        style={[styles.button, selected === 'cart' && styles.activeButton]}
        onPress={() => handleClick('cart', 'Cart')}
      >
        {/* <Badge
          value={cartCount}
          status="primary"
          containerStyle={styles.badge}
        /> */}
        <MaterialIcons
          name={selected === 'cart' ? 'cart' : 'cart-outline'}
          size={24}
          color={selected === 'cart' ? '#6D28D9' : '#000'}
        />
        <Text style={[styles.label, selected === 'cart' && styles.activeLabel]}>Cart</Text>
      </TouchableOpacity>

      {/* Account */}
      <TouchableOpacity
        style={[styles.button, selected === 'profile' && styles.activeButton]}
        onPress={() => handleClick('profile', 'Account')}
      >
        <Icon
          name={selected === 'profile' ? 'person' : 'person-outline'}
          size={24}
          color={selected === 'profile' ? '#6D28D9' : '#000'}
        />
        <Text style={[styles.label, selected === 'profile' && styles.activeLabel]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    justifyContent: 'space-around',
    paddingVertical: 8,
    position: 'absolute', 
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  activeButton: {
    backgroundColor: '#ede9fe',
    borderTopWidth: 3,
    borderTopColor: '#6D28D9',
    borderRadius: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: '#000',
    marginTop: 4,
  },
  activeLabel: {
    color: '#6D28D9',
    fontWeight: '600',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: 20,
    zIndex: 10,
  },
});
