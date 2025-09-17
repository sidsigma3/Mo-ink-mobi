import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter phone number</Text>
      <Text style={styles.subheader}>We'll keep you updated and connected.</Text>

      <TextInput
        placeholder="Enter phone number"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      {/* Terms and conditions checkbox */}
      <View style={styles.checkboxContainer}>
        <Switch value={accepted} onValueChange={setAccepted} />
        <Text style={styles.checkboxText}>
          By creating an account, I accept Hiring Hub Terms of Use and Privacy Policy.
        </Text>
      </View>

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
  container: { flex:1, justifyContent:'center', padding:20, backgroundColor:'#FBFAF7' },
  header: { fontSize:24, marginBottom:4, fontWeight:'bold' },
  subheader: { fontSize:14, marginBottom:16, color:'#555' },
  input: { borderWidth:1, borderColor:'#ddd', borderRadius:8, padding:12, marginBottom:12, backgroundColor:'#fff' },
  checkboxContainer: { flexDirection:'row', alignItems:'center', marginBottom:16 },
  checkboxText: { fontSize:12, color:'#444', marginLeft:8, flex:1 },
  button: { backgroundColor:'#7B32FF', padding:16, borderRadius:8 },
  buttonText: { color:'#fff', fontWeight:'bold', textAlign:'center', fontSize:16 },
});
