import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, KeyboardAvoidingView, Platform , ImageBackground} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { otpSend , otpVerify } from '../../Service/authService';
import { createCustomer } from '../../Service/CustomerService';

const Otp = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const customerData = route.params?.customerData;

  const [emailCode, setEmailCode] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);

  const [emailTimer, setEmailTimer] = useState(120);
  const [phoneTimer, setPhoneTimer] = useState(120);

  // Countdown timers
  useEffect(() => {
    let emailInterval = null;
    if (!isEmailVerified && emailTimer > 0) {
      emailInterval = setInterval(() => setEmailTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(emailInterval);
  }, [emailTimer, isEmailVerified]);

  useEffect(() => {
    let phoneInterval = null;
    if (!isPhoneVerified && phoneTimer > 0) {
      phoneInterval = setInterval(() => setPhoneTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(phoneInterval);
  }, [phoneTimer, isPhoneVerified]);

  useEffect(() => {
    if (isEmailVerified && isPhoneVerified && !isOtpVerified) {
      handleFinalSubmit();
    }
  }, [isEmailVerified, isPhoneVerified]);

  const showToast = (message, type = 'error') => {
    Toast.show({ type, text1: message });
  };

  const handleInput = async (value, type) => {
    const code = value.replace(/\D/g, '').slice(0, 6);
    type === 'email' ? setEmailCode(code) : setPhoneCode(code);

    if (code.length === 6) {
      const otpData = {
        emailOrPhone: type === 'email' ? customerData.email : customerData.phoneNumber,
        otp: code,
        accountType: 'CUSTOMER',
        otpType: type.toUpperCase(),
      };
      try {
        await otpVerify(otpData);
        showToast(`${type === 'email' ? 'Email' : 'Phone'} OTP Verified`, 'success');
        type === 'email' ? setIsEmailVerified(true) : setIsPhoneVerified(true);
      } catch (err) {
        showToast(`Invalid ${type} OTP`, 'error');
      }
    }
  };

  const resendOTP = async (type) => {
    if ((type === 'email' && isEmailVerified) || (type === 'phone' && isPhoneVerified)) return;
    const contact = type === 'email' ? customerData.email : customerData.phoneNumber;

    try {
      await otpSend({
        emailOrPhone: contact,
        accountType: 'CUSTOMER',
        otpType: type.toUpperCase(),
      });
      showToast(`${type === 'email' ? 'Email' : 'Phone'} OTP resent`, 'success');
      type === 'email' ? setEmailTimer(120) : setPhoneTimer(120);
    } catch (err) {
      showToast(`Failed to resend ${type} OTP`, 'error');
    }
  };

  const handleFinalSubmit = async () => {
    try {
      await createCustomer(customerData);
      setIsOtpVerified(true);
      showToast('Account created successfully!', 'success');
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (err) {
      showToast('Failed to create account', 'error');
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/dddepth-198.jpg' }}
        style={styles.backgroundImage}
        blurRadius={3}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <Image source={{uri:'../../assets/Images/logo.png'}} style={styles.logo} />

        <View style={styles.formBox}>
          <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
            <Text style={styles.backLink}>&larr; Back to registration</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Verify Your OTP</Text>
          <Text style={styles.subtitle}>OTP sent to your email and phone</Text>

          {/* Email OTP */}
          <Text style={styles.label}>Email OTP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={emailCode}
              onChangeText={(text) => handleInput(text, 'email')}
              keyboardType="numeric"
              maxLength={6}
              editable={!isEmailVerified}
              style={[styles.input, isEmailVerified && styles.disabledInput]}
              placeholder="Enter Email OTP"
              placeholderTextColor="#999"
            />
            {isEmailVerified && (
              <Image
                source={{
                  uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/check.png?updatedAt=1753792558024',
                }}
                style={styles.checkIcon}
              />
            )}
          </View>

          <TouchableOpacity
            disabled={isEmailVerified || emailTimer > 0}
            onPress={() => resendOTP('email')}
          >
            <Text style={styles.resend}>
              {isEmailVerified
                ? ''
                : emailTimer > 0
                ? `Resend (${formatTime(emailTimer)})`
                : 'Resend'}
            </Text>
          </TouchableOpacity>

          {/* Phone OTP */}
          <Text style={styles.label}>Phone OTP</Text>
          <View style={styles.inputContainer}>
            <TextInput
              value={phoneCode}
              onChangeText={(text) => handleInput(text, 'phone')}
              keyboardType="numeric"
              maxLength={6}
              editable={!isPhoneVerified}
              style={[styles.input, isPhoneVerified && styles.disabledInput]}
              placeholder="Enter Phone OTP"
              placeholderTextColor="#999"
            />
            {isPhoneVerified && (
              <Image
                source={{
                  uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/check.png?updatedAt=1753792558024',
                }}
                style={styles.checkIcon}
              />
            )}
          </View>

          <TouchableOpacity
            disabled={isPhoneVerified || phoneTimer > 0}
            onPress={() => resendOTP('phone')}
          >
            <Text style={styles.resend}>
              {isPhoneVerified
                ? ''
                : phoneTimer > 0
                ? `Resend (${formatTime(phoneTimer)})`
                : 'Resend'}
            </Text>
          </TouchableOpacity>

          {isEmailVerified && isPhoneVerified && (
            <Text style={styles.successText}>Creating your account...</Text>
          )}
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Otp;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 20,
    zIndex: 2,
  },
  formBox: {
    // backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 24,
    width: '90%',
    borderRadius: 20,
    borderColor: '#ffffff',
    borderWidth: 2,
    zIndex: 2,
  },
  backLink: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  label: {
    marginTop: 16,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  input: {
    flex: 1,
    borderColor: '#6D28D9',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 6,
    color: '#000',
  },
  disabledInput: {
    backgroundColor: '#e5e7eb',
    borderColor: '#d1d5db',
    color: '#999',
  },
  checkIcon: {
    width: 18,
    height: 18,
    position: 'absolute',
    right: 10,
    top: 18,
  },
  resend: {
    color: '#6D28D9',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'right',
  },
  successText: {
    textAlign: 'center',
    color: 'green',
    marginTop: 20,
  },
});
