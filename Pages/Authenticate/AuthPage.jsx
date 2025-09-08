import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoginPage from './Login/LoginPage';
import SignupPage from './SignUp/SignupPage';

const AuthPage = ({ setAuthStatus }) => {
  const [isLogin, setIsLogin] = useState(true);

  const togglePage = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        {isLogin ? (
          <LoginPage togglePage={togglePage} setAuthStatus={setAuthStatus} />
        ) : (
          <SignupPage togglePage={togglePage} />
        )}
      </View>
    </View>
  );
};

export default AuthPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // light gray background
    justifyContent: 'center',
    alignItems: 'center',
    // paddingHorizontal: 20,
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    // padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
});
