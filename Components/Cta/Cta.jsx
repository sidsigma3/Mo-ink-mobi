import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import { FontAwesome } from '@expo/vector-icons';

const Cta = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleSubscribe = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: t('cta.validation'),
      });
      return;
    }

    console.log('Subscribing with:', email);
    setShowPopup(true);
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/Images/cta-bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined} 
          style={styles.keyboardContainer}
        >
          <View style={styles.overlay}>
            <Text style={styles.heading}>{t('cta.heading')}</Text>
            <Text style={styles.subheading}>{t('cta.subheading')}</Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <FontAwesome name="paper-plane-o" size={18} color="#666" style={styles.icon} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t('cta.emailPlaceholder')}
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity onPress={handleSubscribe} style={styles.button}>
                <Text style={styles.buttonText}>{t('cta.subscribe')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* Success Modal */}
      <Modal transparent visible={showPopup} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popup}>
            <Text style={styles.popupTitle}>{t('cta.thankYouTitle')}</Text>
            <Text style={styles.popupText}>{t('cta.thankYouSubtext')}</Text>
            <TouchableOpacity onPress={() => setShowPopup(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>{t('cta.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
};

export default Cta;

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
  },
  background: {
    minHeight: 200,
    justifyContent: 'center',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    padding: 20,
    margin: 16,
    borderRadius: 12,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    // Add text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.7)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheading: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    // Add text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  icon: {
    marginRight: 12,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 2,
  },
  button: {
    backgroundColor: '#6B21A8',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    marginLeft: 8,
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 16,
    width: '85%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  popupText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 21,
  },
  closeButton: {
    backgroundColor: '#6B21A8',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    shadowColor: '#6B21A8',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});