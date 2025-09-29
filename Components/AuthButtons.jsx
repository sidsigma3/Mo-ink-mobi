import React, { useEffect } from 'react';
import { Button, Alert } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as Facebook from 'expo-facebook';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';

// Google Config
const googleDiscovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};
const googleClientId = "936934880171-7jrdsdglcgpetkueve55qcm1fsq9grl9.apps.googleusercontent.com";

// Facebook Config
const fbAppId = "1199335138639496";

export default function AuthButtons() {
  // Google Sign-In
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: googleClientId,
      redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
      scopes: ['openid', 'profile', 'email'],
      responseType: 'id_token',
    },
    googleDiscovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch(err => console.error(err));
    }
  }, [response]);

  // Facebook Sign-In
  const handleFacebookLogin = async () => {
    try {
      await Facebook.initializeAsync({ appId: fbAppId });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile','email'] });

      if (type === 'success' && token) {
        const credential = FacebookAuthProvider.credential(token);
        signInWithCredential(auth, credential).catch(err => console.error(err));
      } else {
        Alert.alert('Facebook login cancelled');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Facebook login error', err.message);
    }
  };

  return (
    <>
      <Button disabled={!request} title="Sign in with Google" onPress={() => promptAsync()} />
      <Button title="Sign in with Facebook" onPress={handleFacebookLogin} />
    </>
  );
}
