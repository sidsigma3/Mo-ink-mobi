import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function AccountCreatedScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Lottie Animation */}
      <View style={styles.animationContainer}>
        <LottieView
          source={{
            uri: 'https://lottie.host/d41f9aac-62e3-4fa7-895c-e029cb9eb460/7XHPougtI9.lottie'
          }}
          autoPlay
          loop
          style={styles.animation}
        />
      </View>
      
      <Text style={styles.header}>Account Created!</Text>
      <Text style={styles.subheader}>
            Welcome to Mo-Ink! Your account has been{'\n'}successfully created and you're ready to{'\n'}start your journey with us.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          // Navigate to home screen
          navigation.navigate('Auth'); // Replace 'Home' with your actual home screen name
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFAF7',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  animationContainer: {
    width: 440,
    height: 440,
    marginBottom: -100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 16,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: '#181a20ff',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6B21A8',
    paddingVertical: 16,
    width: '100%',
    borderRadius: 12,
     marginTop: 'auto',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});