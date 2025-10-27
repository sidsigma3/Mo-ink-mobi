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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from "react-native";
import { auth } from '../../firebase'; 
import * as AuthSession from 'expo-auth-session';
// import * as Facebook from 'expo-facebook';

export default function CreateAccountScreen({ navigation, route }) {
  const {phone} = route.params || {}; // ✅ Get phone/whatsapp from OTP screen

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

    navigation.navigate("ProfileScreen", {
      phone,
      email,
      password: pw,
    });
  };

  const handleSignInPress = () => {
    navigation.navigate("SignInScreen"); // Navigate to sign in screen
  };


  // Google Config
const googleClientId = "936934880171-7jrdsdglcgpetkueve55qcm1fsq9grl9.apps.googleusercontent.com"; // From Google Cloud
const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const [request, response, promptAsync] = AuthSession.useAuthRequest(
  {
    clientId: googleClientId,
    redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
    scopes: ['openid', 'profile', 'email'],
    responseType: 'id_token',
  },
  googleDiscovery
);

// Listen for Google response
React.useEffect(() => {
  if (response?.type === 'success') {
    const { id_token } = response.params;
    const credential = GoogleAuthProvider.credential(id_token);
    signInWithCredential(auth, credential)
      .then(user => Alert.alert('Google Sign-In Success', `Welcome ${user.user.displayName}`))
      .catch(err => Alert.alert('Error', err.message));
  }
}, [response]);

// Facebook Sign-In handler
// const handleFacebookLogin = async () => {
//   try {
//     await Facebook.initializeAsync({ appId: "1199335138639496" });
//     const { type, token } = await Facebook.logInWithReadPermissionsAsync({
//       permissions: ['public_profile','email'],
//     });

//     if (type === 'success' && token) {
//       const credential = FacebookAuthProvider.credential(token);
//       signInWithCredential(auth, credential)
//         .then(user => Alert.alert('Facebook Sign-In Success', `Welcome ${user.user.displayName}`))
//         .catch(err => Alert.alert('Error', err.message));
//     } else {
//       Alert.alert('Facebook login cancelled');
//     }
//   } catch (err) {
//     Alert.alert('Facebook login error', err.message);
//   }
// };


  return (
    <View style={styles.container}>
      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.header}>Create account</Text>
        <Text style={styles.subheader}>Start your journey with us and explore our premium yarn collection.</Text>

        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        {/* Password input with eye toggle */}
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Password (min 8 characters)"
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
            placeholder="Confirm password"
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

        <TouchableOpacity onPress={handleSignInPress} style={styles.signInContainer}>
          <Text style={styles.signin}>
            Or sign up with<Text style={styles.signInLink}></Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={() => promptAsync()}>
  <Image source={require('../../assets/images/google_icon.png')} style={styles.socialIcon} />
  <Text style={styles.socialButtonText}>Google</Text>
</TouchableOpacity>

{/* <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
  <Image source={require('../../assets/images/facebook_icon.png')} style={styles.socialIcon} />
  <Text style={styles.socialButtonText}>Facebook</Text>
</TouchableOpacity> */}

        </View>
      </View>

      {/* Button at Bottom */}
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
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
    fontSize: 24,
    marginBottom: 4,
    fontWeight: 'bold',
    textAlign: 'start',
  },
  subheader: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    color: '#555',
    textAlign: 'start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 32,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    marginBottom: 16,
    paddingRight: 16,
  },
  inputField: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 6,
  },
  signInContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  signin: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  signInLink: {
    color: '#6B21A8', // Changed to match PhoneNumberScreen color
    fontWeight: '500',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f2f2f2',
  paddingVertical: 16,
  paddingHorizontal: 24,
  borderRadius: 40,
  marginVertical: 5, 
  width: '40%',          // 🔹 constant width for both buttons
  alignSelf: 'center',   // 🔹 center align buttons
  borderWidth: 1,        // 🔹 border added
  borderColor: '#ccc',   // 🔹 light gray border
   justifyContent: 'center', 
},
socialIcon: {
  width: 20,
  height: 20,
  marginRight: 8,
  resizeMode: 'contain',
},
socialButtonText: {
  fontSize: 16,
  fontWeight: '500',
  color: '#333',
},

  button: {
    backgroundColor: '#6B21A8', // Changed to match PhoneNumberScreen color
    padding: 18,
    borderRadius: 12,
    marginTop: 'auto', // This pushes the button to the bottom
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});