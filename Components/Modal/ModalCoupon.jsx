import React, { useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import LottieView from 'lottie-react-native';

const ModalCoupon = ({ isOpen, onClose, savings, discount, discountCode }) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

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
              {/* Lottie Confetti Animation */}
              <View style={styles.animationContainer}>
                <LottieView
                  source={{ uri: 'https://lottie.host/4e7e7f7d-1e2a-4b8e-8e8e-4g1w6wzj.json' }}
                  autoPlay
                  loop={false}
                  style={{ width: 240, height: 240 }}
                />
              </View>
              {/* Coupon Info */}
              <Text style={styles.discountText}>₹{Math.round(discount)}/-</Text>
              <Text style={styles.savingsText}>Saved with this coupon</Text>
              <Text style={styles.codeText}>
                <Text style={styles.bold}>{discountCode || "Your coupon is applied!"}</Text>
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
    overflow: 'hidden',
  },
  animationContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
    zIndex: 2,
  },
  discountText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
    zIndex: 2,
  },
  savingsText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 4,
    zIndex: 2,
  },
  codeText: {
    fontSize: 20,
    color: '#555',
    textAlign: 'center',
    marginBottom: 8,
    zIndex: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
});

export default ModalCoupon;