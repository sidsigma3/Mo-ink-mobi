import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function OnboardingScreen2() {
  const navigation = useNavigation();

  const handleNext = () => {
    navigation.navigate('OnboardingScreen3');
  };

  const handleSkip = async () => {
    try {
      await AsyncStorage.setItem('hasCompletedOnboarding', 'true');
      navigation.replace('PhoneNumberScreen');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      navigation.replace('PhoneNumberScreen');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top section with back and skip */}
        <View style={styles.topSection}>
          <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
            <Icon name="chevron-left" size={24} color="#6B21A8" />
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.skipBtnTop} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity> */}
        </View>

        {/* Main content */}
        <View style={styles.mainContent}>
          <Image source={require('../../assets/Images/onboarding-2.png')} style={styles.image} />
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              <Text style={styles.highlight}>Sustainability</Text> at Heart
            </Text>
            <Text style={styles.description}>
              Our yarns are made responsibly to support a greener tomorrow.
            </Text>
          </View>
        </View>

        {/* Bottom section with pagination and button */}
        <View style={styles.bottomSection}>
          <View style={styles.pagination}>
            <View style={styles.dot} />
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
          </View>
          
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>

           <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                                <Text style={styles.skipBottomText}>Skip for now</Text>
                              </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 0,
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 0,
    paddingHorizontal: 0,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e7e7e7ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  backText: {
    color: '#6B21A8',
    fontSize: 20,
    fontWeight: '900',
  },
  skipBtnTop: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    color: '#6B21A8',
    fontSize: 16,
    fontWeight: '500',
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 400,
    height: 480,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1A1A1A',
    lineHeight: 32,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#6B21A8',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 10,
  },
  bottomSection: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#6B21A8',
    width: 20,
  },
  nextButton: {
    backgroundColor: '#6B21A8',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },

  skipBtn: {
    paddingVertical: 12,
  },
  skipBottomText: {
    color: '#6B21A8',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});