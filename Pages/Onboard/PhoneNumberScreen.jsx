import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { otpSend } from '../../Service/authService';

import { Fonts } from '../../Utils/Fonts';
export default function PhoneNumberScreen({ navigation }) {
  const [phone, setPhone] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    if (!phone) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }
    if (!accepted) {
      Alert.alert("Error", "You must accept the terms to continue");
      return;
    }

    try {
      setLoading(true);

      const res = await otpSend({ phone });

      if (res?.success) {
        navigation.navigate('OtpScreen', { phone });
      } else {
        Alert.alert("Error", res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleTermsPress = (e) => {
    e.stopPropagation(); // Prevent checkbox toggle
    console.log('Navigate to Terms of Use');
    navigation.navigate('Terms'); 
  };

  const handlePrivacyPress = (e) => {
    e.stopPropagation(); // Prevent checkbox toggle
    console.log('Navigate to Privacy Policy');
    navigation.navigate('PrivacyPolicy'); 
  };

  return (
    <View style={styles.container}>
      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.header}>Enter phone number</Text>
        <Text style={styles.subheader}>We'll text you a code to verify your account and keep you updated on your orders & yarn updates.</Text>

        <TextInput
          placeholder="Enter phone number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Terms and conditions checkbox */}
        <TouchableOpacity 
          style={styles.checkboxContainer}
          onPress={() => setAccepted(!accepted)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
            {accepted && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <View style={styles.checkboxTextWrapper}>
            <Text style={styles.checkboxText}>
              By creating an account, I accept Ink N Dyes{' '}
              <Text 
                style={styles.linkText}
                onPress={handleTermsPress}
              >
                Terms of Use
              </Text>
              {' '}and{' '}
              <Text 
                style={styles.linkText}
                onPress={handlePrivacyPress}
              >
                Privacy Policy
              </Text>
              .
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Button at Bottom */}
      <TouchableOpacity
        style={[styles.button, (!accepted || loading) && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!accepted || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  
  container: {
    
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 20,
    paddingTop: 120, // Add top padding for status bar
    paddingBottom: 40, // Add bottom padding
  
  },
  content: {
    
    flex: 1,
    justifyContent: 'flex-start',
  
  },
  header: {
    fontFamily: Fonts.bold,
    fontSize: 24,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'start',
  },
  subheader: {
    fontFamily: Fonts.regular,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: '#555',
    textAlign: 'start',
  },
  input: {
    fontFamily: Fonts.regular,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  checkboxContainer: {
    
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  
  },
  checkbox: {
    
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2, // Slight adjustment to align with text
  
  },
  checkboxChecked: {
    
    backgroundColor: '#6B21A8',
    borderColor: '#6B21A8',
  
  },
  checkmark: {
    fontFamily: Fonts.bold,
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxTextWrapper: {
    
    flex: 1,
    marginLeft: 12,
  
  },
  checkboxText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
  },
  linkText: {
    fontFamily: Fonts.medium,
    color: '#6B21A8', // Your primary color
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  button: {
    
    backgroundColor: '#6B21A8',
    padding: 18,
    borderRadius: 12,
    marginTop: 'auto', // This pushes the button to the bottom
  
  },
  buttonText: {
    fontFamily: Fonts.bold,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },

});