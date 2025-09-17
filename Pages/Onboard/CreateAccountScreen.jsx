import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { createCustomer } from "../../Service/authService";

export default function CreateAccountScreen({ navigation, route }) {
  const { customerData: phoneData } = route.params || {}; // ✅ Get phone/whatsapp from OTP screen

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!email || pw.length < 8 || pw !== confirm) {
      Alert.alert("Error", "Please enter a valid email and matching passwords");
      return;
    }

    // ✅ Build minimal customer data
    const customerData = {
      customerName: "", // will be filled later in ProfileScreen
      phoneNumber: phoneData?.phoneNumber || null,
      whatsappNumber: phoneData?.whatsappNumber || null,
      email: email,
      password: pw,
      company: null,
      gstNumber: null,
      customerAddress: "",
      addresses: [
        {
          customerAddress: "",
          street: "",
          city: "",
          state: "",
          country: "",
          zipcode: "",
          addressType: "HOME",
        },
      ],
      customerStatus: "ACTIVE",
    };

    try {
      setLoading(true);
      const res = await createCustomer({ email, password: pw, phoneNumber: phone });

      if (res?.id || res?.success) {
        Alert.alert("Success", "Account created successfully!");
        navigation.navigate("ProfileScreen", { customer: res });
        await AsyncStorage.setItem('customerData', JSON.stringify(res)); 
      } else {
        Alert.alert("Error", res?.message || "Something went wrong");
      }
    } catch (err) {
      Alert.alert("Error", "Account creation failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create account</Text>
      <Text style={styles.subheader}>Start your journey with us</Text>

      <TextInput
        placeholder="example@gmail.com"
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Password input with eye toggle */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="must be 8 characters"
          style={styles.inputField}
          value={pw}
          onChangeText={setPw}
          secureTextEntry={!showPw}
        />
        <TouchableOpacity
          onPress={() => setShowPw(!showPw)}
          style={styles.eyeIcon}
        >
          <Ionicons name={showPw ? "eye-off" : "eye"} size={20} color="#555" />
        </TouchableOpacity>
      </View>

      {/* Confirm password input with eye toggle */}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="repeat password"
          style={styles.inputField}
          value={confirm}
          onChangeText={setConfirm}
          secureTextEntry={!showConfirm}
        />
        <TouchableOpacity
          onPress={() => setShowConfirm(!showConfirm)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirm ? "eye-off" : "eye"}
            size={20}
            color="#555"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.signin}>
        Have an account? <Text style={{ color: "#7B32FF" }}>Sign in here</Text>
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Text>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Text>Facebook</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.6 }]}
        onPress={handleCreateAccount}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#FBFAF7" },
  header: { fontSize: 24, marginBottom: 4, fontWeight: "bold" },
  subheader: { fontSize: 14, marginBottom: 16, color: "#555" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    paddingRight: 10,
  },
  inputField: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 6,
  },
  signin: { fontSize: 14, marginBottom: 12, textAlign: "center" },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  socialButton: {
    backgroundColor: "#eee",
    padding: 10,
    margin: 4,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  button: { backgroundColor: "#7B32FF", padding: 16, borderRadius: 8 },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
