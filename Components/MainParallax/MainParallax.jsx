import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const MainParallax = () => {
  const { t } = useTranslation();

  const handleLoginPress = () => {
    // If using React Navigation, use: navigation.navigate('Login');
    // Otherwise, open external link (for web builds)
    Linking.openURL('/login');
  };

  return (
    <ImageBackground
      source={{uri:'../../assets/Images/ParallaxPic.jpg'}}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Dark overlay */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>{t('mainParallax.title')}</Text>
        <Text style={styles.description}>{t('mainParallax.description')}</Text>
        <TouchableOpacity style={styles.button} onPress={handleLoginPress}>
          <Text style={styles.buttonText}>{t('mainParallax.cta')}</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    height: 500,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    zIndex: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#6b21a8',
    borderWidth: 1,
    borderColor: '#6b21a8',
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 32,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MainParallax;
