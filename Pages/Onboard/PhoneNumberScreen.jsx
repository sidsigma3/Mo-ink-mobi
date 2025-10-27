import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { otpSend } from '../../Service/authService';

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

    const res = await otpSend({
      emailOrPhone: phone,      
      accountType: 'CUSTOMER',  
      otpType: 'PHONE',         
    });
      Alert.alert("Success", "OTP sent successfully");
      navigation.navigate('OtpScreen', { phone });
  } catch (err) {
    console.error(err);
    Alert.alert("Error", "Something went wrong while sending OTP");
  } finally {
    setLoading(false);
  }
};


  const handleTermsPress = (e) => {
    e.stopPropagation();
    navigation.navigate('Terms'); 
  };

  const handlePrivacyPress = (e) => {
    e.stopPropagation();
    navigation.navigate('PrivacyPolicy'); 
  };

  const handleAlreadyHaveAccount = () => {
    navigation.navigate('Auth'); // Direct to Auth/Login page
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Enter phone number</Text>
        <Text style={styles.subheader}>
          We'll text you a code to verify your account and keep you updated on your orders & yarn updates.
        </Text>

        <TextInput
          placeholder="Enter phone number"
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

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
              <Text style={styles.linkText} onPress={handleTermsPress}>Terms of Use</Text> and{' '}
              <Text style={styles.linkText} onPress={handlePrivacyPress}>Privacy Policy</Text>.
            </Text>
          </View>
        </TouchableOpacity>

        {/* Already have an account link */}
        <TouchableOpacity onPress={handleAlreadyHaveAccount} style={styles.loginLink}>
          <Text style={styles.loginText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, (!accepted || loading) && { opacity: 0.5 }]}
        onPress={handleContinue}
        disabled={!accepted || loading}
      >
        <Text style={styles.buttonText}>{loading ? "Sending..." : "Continue"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFAF7',
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  header: { fontSize: 24, marginBottom: 4, fontWeight: 'bold', textAlign: 'start' },
  subheader: { fontSize: 16, lineHeight: 24, marginBottom: 32, color: '#555', textAlign: 'start' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 16, marginBottom: 24, backgroundColor: '#fff', fontSize: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: '#ddd', borderRadius: 3, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: 2 },
  checkboxChecked: { backgroundColor: '#6B21A8', borderColor: '#6B21A8' },
  checkmark: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  checkboxTextWrapper: { flex: 1, marginLeft: 12 },
  checkboxText: { fontSize: 14, color: '#444', lineHeight: 20 },
  linkText: { color: '#6B21A8', textDecorationLine: 'underline', fontWeight: '500' },
  loginLink: { marginTop: 12 },
  loginText: { color: '#6B21A8', fontWeight: '600', textAlign: 'center' },
  button: { backgroundColor: '#6B21A8', padding: 18, borderRadius: 12, marginTop: 'auto' },
  buttonText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 16 },
});
