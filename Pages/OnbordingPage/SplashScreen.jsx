import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        // Check if user has completed onboarding
        const hasCompletedOnboarding = await AsyncStorage.getItem('hasCompletedOnboarding');
        
        // Simulate splash screen delay
        setTimeout(() => {
          if (hasCompletedOnboarding === 'true') {
            // Navigate to main app (e.g., Home screen)
            navigation.replace('PhoneNumberScreen'); // or your main screen
          } else {
            // Navigate to onboarding
            navigation.replace('OnboardingScreen1');
          }
        }, 2000); // 2 second splash delay
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // Default to onboarding if error occurs
        setTimeout(() => {
          navigation.replace('OnboardingScreen1');
        }, 2000);
      }
    };

    checkFirstLaunch();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.centered}>
        <Image source={require('../../assets/Images/logo.png')} style={styles.logo} />
        <Text style={styles.logoText}>InkNdye</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7B32FF',
    letterSpacing: 1,
  },
});