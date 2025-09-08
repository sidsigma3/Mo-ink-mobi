import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { forgotPassword } from '../../Service/authService';
// import Toast from '../../components/Toast';
// import { forgotPassword } from '../../services/customerService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const accountType = 'CUSTOMER';
  const navigation = useNavigation();
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts([{ id, message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  const handleSubmit = async () => {
    if (!email) {
    //   showToast("Please enter your email.");
      return;
    }   
    
    try {
      await forgotPassword({ email, accountType });
    //   showToast("Password reset link sent to your email.", "success");
    } catch (err) {
    //   showToast("Email doesn't exist, try another.", "error");
      console.error(err);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Background Image Layer */}
      <Image
        source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/dddepth-198.jpg?updatedAt=1751281331520' }}
        style={styles.background}
        resizeMode="cover"
        blurRadius={3}
      />

      {/* Logo */}
      <Image source={{uri:'../../assets/Images/logo.png'}} style={styles.logo} />

      {/* Main Card */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to login</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Forgot your password?</Text>
        <Text style={styles.subheading}>
          Don’t worry, it happens. Enter your email to recover your password.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your Email Address"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      {/* Toast Notification */}
      <View style={styles.toastContainer}>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
          />
        ))}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordPage;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  logo: {
    position: 'absolute',
    top: 40,
    left: 20,
    width: 100,
    height: 30,
    resizeMode: 'contain',
  },
  card: {
    // backgroundColor: 'rgba(255,255,255,0.85)',
    borderColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    width: '90%',
    zIndex: 2,
  },
  backText: {
    color: '#555',
    marginBottom: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#222',
  },
  subheading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#6b21a8',
    color: '#000',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6b21a8',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  toastContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 100,
  },
});
