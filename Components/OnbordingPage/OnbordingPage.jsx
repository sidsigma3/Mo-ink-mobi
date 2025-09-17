import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';

const onboardingData = [
  {
    image: require('../../assets/Images/logo.png'),
    title: '',
    description: '',
    isLogo: true,
  },
  {
    image: require('../../assets/Images/onboarding-1.png'),
    title: 'Quality You Can Trust',
    description: 'Soft, strong, and consistent yarns crafted with precision for every creation.',
    highlight: 'Quality',
  },
  {
    image: require('../../assets/Images/onboarding-2.png'),
    title: 'Sustainability at Heart',
    description: 'Our yarns are made responsibly to support a greener tomorrow.',
    highlight: 'Sustainability',
  },
  {
    image: require('../../assets/Images/onboarding-3.png'),
    title: 'Craft the Extraordinary',
    description: 'Explore our collections and bring your ideas to life with InkNdye.',
    highlight: 'Extraordinary',
    bold: 'InkNdye',
  },
];

export default function OnbordingPage() {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('PhoneNumberScreen'); 
  };

  return (
    <Swiper loop={false} showsPagination={true} activeDotColor="#7B32FF">
      {onboardingData.map((item, index) => (
        <View style={styles.slide} key={index}>
          {item.isLogo ? (
            <View style={styles.centered}>
              <Image source={item.image} style={styles.logo} />
              <Text style={styles.logoText}>InkNdye</Text>
            </View>
          ) : (
            <>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.title}>
              
                <Text style={styles.highlight}>{item.highlight}</Text>
                {item.title.split(item.highlight)[1]}
              </Text>
              <Text style={styles.description}>
                {item.description.split(item.bold || '')}
                <Text style={styles.bold}>{item.bold || ''}</Text>
                {item.description.split(item.bold || '')[1]}
              </Text>
              <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
                <Text style={styles.buttonText}>Get started</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipBtn} onPress={handleGetStarted}>
                <Text style={styles.skipText}>Skip</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      ))}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7B32FF',
  },
  image: {
    width: 260,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'medium',
    textAlign: 'center',
    marginBottom: 12,
    color: '#1A1A1A',
  },
  highlight: {
    fontWeight: 'bold',
    color: '#7B32FF',
  },
  bold: {
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 16,
    color: '#353434',
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#7B32FF',
    paddingVertical: 14,
    width: '90%',
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  skipBtn: {
    marginBottom: 8,
  },
  skipText: {
    color: '#7B32FF',
    fontSize: 14,
    textAlign: 'center',
  },
});
