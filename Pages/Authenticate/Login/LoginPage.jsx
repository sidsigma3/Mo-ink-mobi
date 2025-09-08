import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
// import { Eye, EyeOff } from 'lucide-react-native'; // lucide-react-native is better for RN than lucide-react
import { useNavigation } from '@react-navigation/native';
import { loginCustomer } from '../../../Service/authService';

const LoginPage = ({ togglePage, setAuthStatus }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

 const handleLogin = async () => {
  if (!username || !password) {
    setError('Fill all Fields');
    return;
  }

  try {
    const response = await loginCustomer(username, password);
  
    if (response.success) {
      setAuthStatus(true);

      await AsyncStorage.setItem('isAuthenticated', 'true');
      await AsyncStorage.setItem('userData', JSON.stringify(response.data));

      Alert.alert('Login Sucessfull');
      navigation.navigate('Landing');
    } else {
      setError(response.message);
    }
  } catch (err) {
    console.log(err)
    setError('Something went wrong. Please try again.');
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Background Image */}
      <Image
        source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/dddepth-198.jpg?updatedAt=1751281331520' }}
        style={styles.backgroundImage}
        blurRadius={3}
      />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={{uri:'../../../assets/Images/logo.png'}} style={styles.logo} />
      </View>

      <View style={styles.formBox}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backLink}>&larr; {t('login.backToHome')}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{t('login.welcomeTitle')}</Text>

        {/* Tab Switch */}
        <View style={styles.tabSwitch}>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>{t('login.login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.inactiveTab} onPress={togglePage}>
            <Text style={styles.inactiveTabText}>{t('login.register')}</Text>
          </TouchableOpacity>
        </View>

        {/* Username Input */}
        <TextInput
          placeholder={t('login.emailOrPhone')}
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        {/* Password Input */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder={t('login.password')}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={styles.input}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {/* {showPassword ? <EyeOff size={22} color="gray" /> : <Eye size={22} color="gray" />} */}
          </TouchableOpacity>
        </View>

        {error !== '' && <Text style={styles.error}>{error}</Text>}

        {/* Options */}
        <View style={styles.options}>
          <Text>{t('login.rememberMe')}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.link}>{t('login.forgotPassword')}</Text>
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>{t('login.login')}</Text>
        </TouchableOpacity>

        {/* Social logins and others can be added below */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    height:'100%',
    width:'100%',
    // paddingHorizontal:'12',
    backgroundColor: '#fff',
    // paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  formBox: {
  // backgroundColor: 'rgba(255,255,255,0.9)', 
  padding: 24,
  width: '90%',
  borderRadius: 20, 
  borderColor: '#ffffff',
  borderWidth: 2,
  alignSelf: 'center', 
  // marginTop: 20, 
},
  backLink: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabSwitch: {
    flexDirection: 'row',
    marginBottom: 24,
    // backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    borderColor: '#6b21a8',
  },
  activeTab: {
    flex: 1,
    backgroundColor: '#6b21a8',
    paddingVertical: 10,
    alignItems: 'center',
  },
  inactiveTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#6b21a8',
    borderWidth: 1,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#6b21a8',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
    fontSize: 16,
  },
  passwordWrapper: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 12,
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  link: {
    color: '#6b21a8',
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#6b21a8',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});


export default LoginPage;
