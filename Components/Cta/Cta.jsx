import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Image, KeyboardAvoidingView, Platform } from 'react-native';
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.container}>
      <Image source={{ uri: '../../assets/Images/cta-bg.png' }} style={styles.bgImage} />

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
            style={styles.input}
            keyboardType="email-address"
          />
          <TouchableOpacity onPress={handleSubscribe} style={styles.button}>
            <Text style={styles.buttonText}>{t('cta.subscribe')}</Text>
          </TouchableOpacity>
        </View>
      </View>

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
    </KeyboardAvoidingView>
  );
};

export default Cta;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: '#000',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    opacity: 0.25,
  },
  overlay: {
    backgroundColor: 'transparent',
    padding: 20,
    borderRadius: 12,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#6B21A8',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  popupText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#6B21A8',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
