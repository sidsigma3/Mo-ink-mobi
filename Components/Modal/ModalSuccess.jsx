import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import LottieView from 'lottie-react-native';

const ModalSuccess = ({ isOpen, onClose }) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              <View style={styles.animationContainer}>
                <LottieView
                  source={{ uri: 'https://lottie.host/dea25119-82ca-47b6-8861-adf3a0c37bf1/0ExcGCznnl.json' }}
                  autoPlay
                  loop
                  style={{ width: 240, height: 240 }}
                />
              </View>
              <Text style={styles.title}>Order Placed Successfully</Text>
              <Text style={styles.subtitle}>
                Our confirmation details will be sent shortly. Sit back and relax while we prepare your order!
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    elevation: 8,
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default ModalSuccess;