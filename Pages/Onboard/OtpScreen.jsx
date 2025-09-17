import React, { useState, useEffect } from "react";
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
      await otpSend(customerData.phoneNumber);
      setTimer(20);
      Alert.alert("Info", "OTP resent to your phone");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter OTP</Text>
      <Text style={styles.subheader}>
        We've sent a code to {phone}. Please enter it below.
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
        <TouchableOpacity onPress={handleResend}>
          <Text style={[styles.timer, { color: "#7B32FF" }]}>Resend Code</Text>
        </TouchableOpacity>
      )}

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
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#FBFAF7" },
  header: { fontSize: 24, marginBottom: 4, fontWeight: "bold" },
  subheader: { fontSize: 14, marginBottom: 16, color: "#555" },
  otpContainer: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  otpInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    width: 40,
    textAlign: "center",
    fontSize: 18,
    backgroundColor: "#fff",
  },
  timer: { fontSize: 12, textAlign: "center", marginBottom: 16, color: "#777" },
  button: { backgroundColor: "#7B32FF", padding: 16, borderRadius: 8 },
  buttonText: { color: "#fff", fontWeight: "bold", textAlign: "center", fontSize: 16 },
});
