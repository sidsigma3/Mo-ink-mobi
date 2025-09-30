import React, { useState, useEffect } from "react";
import { Fonts } from '../../Utils/Fonts';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { otpVerify , otpSend} from "../../Service/authService"; // ✅ import API

export default function OtpScreen({ navigation, route }) {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(20);
  const [loading, setLoading] = useState(false);

  const phone = route?.params?.phone; // ✅ phone passed from previous screen

  // countdown
  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await otpVerify({
        emailOrPhone: phone,
        otp,
        accountType: "CUSTOMER",
        otpType: "PHONE",
      });

      if (res?.success) {
        Alert.alert("Success", "OTP verified successfully!");
        navigation.navigate("CreateAccountScreen", { phone });
      } else {
        Alert.alert("Error", res?.message || "Invalid OTP");
      }
    } catch (err) {
      console.error("OTP Verify Error:", err);
      Alert.alert("Error", "Something went wrong verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await otpSend({ phone }); // Fixed: use phone from route params
      setTimer(20);
      Alert.alert("Info", "OTP resent to your phone");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <View style={styles.container}>
      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.header}>Enter OTP</Text>
        <Text style={styles.subheader}>
          We've sent a code to {phone}. Please enter it below to verify your account.
        </Text>

        {/* OTP Inputs */}
        <View style={styles.otpContainer}>
          {[...Array(6)].map((_, i) => (
            <TextInput
              key={i}
              style={styles.otpInput}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[i] || ""}
              onChangeText={(v) => {
                const next = otp.split("");
                next[i] = v;
                setOtp(next.join(""));
              }}
            />
          ))}
        </View>

        {/* Timer / Resend */}
        {timer > 0 ? (
          <Text style={styles.timer}>Send code again in 00:{timer < 10 ? `0${timer}` : timer}</Text>
        ) : (
          <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
            <Text style={[styles.timer, styles.resendText]}>Resend Code</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Button at Bottom */}
      <TouchableOpacity
        style={[styles.button, (otp.length !== 6 || loading) && { opacity: 0.5 }]}
        onPress={handleVerify}
        disabled={otp.length !== 6 || loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Verifying..." : "Continue"}
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
  otpContainer: {
    
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  
  },
  otpInput: {
    fontFamily: Fonts.semiBold,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 16,
    width: 48,
    height: 56,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
    fontWeight: '600',
  },
  timer: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#777",
    lineHeight: 20,
  },
  resendText: {
    fontFamily: Fonts.medium,
    color: "#6B21A8",
    fontWeight: '500',
    textDecorationLine: 'underline',
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