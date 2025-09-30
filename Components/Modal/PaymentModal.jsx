import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';

import { Fonts } from '../../Utils/Fonts';
const PaymentModal = ({
  isOpen,
  onClose,
  orderDetails,
  balanceDue,
  onPaymentInitiate
}) => {
  const [formData, setFormData] = useState({
    paymentAmount: balanceDue || 0,
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      paymentAmount: balanceDue || 0
    }));
  }, [balanceDue]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.paymentAmount || formData.paymentAmount <= 0) {
      newErrors.paymentAmount = 'Please enter a valid payment amount';
    } else if (formData.paymentAmount > balanceDue) {
      newErrors.paymentAmount = `Amount cannot exceed balance due of ₹${balanceDue}`;
    } else if (formData.paymentAmount < 1) {
      newErrors.paymentAmount = 'Minimum payment amount is ₹1';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Please agree to terms and conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setIsProcessing(true);
    try {
      // Get customer details from local storage
      const customer = JSON.parse(global.localStorage?.getItem('userData') || '{}');
      const paymentData = {
        orderId: orderDetails?.orderId,
        amount: formData.paymentAmount,
        currency: 'INR',
        customerDetails: {
          name: customer.firstName ? `${customer.firstName} ${customer.lastName || ''}`.trim() : 'Customer',
          email: customer.email || '',
          phone: customer.phone || customer.mobileNumber || ''
        },
        orderData: orderDetails
      };
      await onPaymentInitiate(paymentData);
      onClose();
    } catch (error) {
      setErrors({ submit: 'Payment initiation failed. Please try again.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  };

  const quickAmounts = [
    Math.round(balanceDue * 0.25),
    Math.round(balanceDue * 0.5),
    Math.round(balanceDue * 0.75),
    balanceDue
  ].filter((amount, index, arr) => arr.indexOf(amount) === index && amount > 0);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Complete Payment</Text>
            <Text style={styles.headerSubtitle}>Order #{orderDetails?.orderId}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose} disabled={isProcessing}>
              <Text style={styles.closeBtnText}>×</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{ maxHeight: 400 }}>
            <View style={styles.formSection}>
              <Text style={styles.label}>Payment Amount</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputPrefix}>₹</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.paymentAmount ? styles.inputError : null
                  ]}
                  value={String(formData.paymentAmount)}
                  onChangeText={val => handleInputChange('paymentAmount', parseFloat(val) || 0)}
                  keyboardType="numeric"
                  placeholder="0.00"
                  min={1}
                  max={balanceDue}
                  editable={!isProcessing}
                />
              </View>
              {quickAmounts.length > 1 && (
                <View style={styles.quickRow}>
                  {quickAmounts.map((amount) => (
                    <TouchableOpacity
                      key={amount}
                      style={styles.quickBtn}
                      onPress={() => handleInputChange('paymentAmount', amount)}
                      disabled={isProcessing}
                    >
                      <Text style={styles.quickBtnText}>{formatAmount(amount)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.paymentAmount && (
                <Text style={styles.errorText}>{errors.paymentAmount}</Text>
              )}
            </View>
            <View style={styles.termsRow}>
              <TouchableOpacity
                style={styles.checkbox}
                onPress={() => handleInputChange('agreeTerms', !formData.agreeTerms)}
                disabled={isProcessing}
              >
                <View style={[
                  styles.checkboxBox,
                  formData.agreeTerms ? styles.checkboxChecked : null,
                  errors.agreeTerms ? styles.checkboxError : null
                ]}>
                  {formData.agreeTerms && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>
                  I agree to the Terms & Conditions and Privacy Policy
                </Text>
              </TouchableOpacity>
              {errors.agreeTerms && (
                <Text style={styles.errorText}>{errors.agreeTerms}</Text>
              )}
            </View>
            {errors.submit && (
              <Text style={styles.errorText}>{errors.submit}</Text>
            )}
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment Amount</Text>
                <Text style={styles.summaryValue}>{formatAmount(formData.paymentAmount)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Gateway Charges</Text>
                <Text style={[styles.summaryValue, { color: '#22C55E' }]}>Free</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Amount</Text>
                <Text style={styles.summaryValue}>{formatAmount(formData.paymentAmount)}</Text>
              </View>
            </View>
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={onClose}
                disabled={isProcessing}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.payBtn,
                  (!formData.agreeTerms || isProcessing) ? styles.payBtnDisabled : null
                ]}
                onPress={handleSubmit}
                disabled={isProcessing || !formData.agreeTerms}
              >
                {isProcessing ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.payBtnText}>Pay {formatAmount(formData.paymentAmount)}</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  
  overlay: {
    
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  
  },
  modal: {
    
    backgroundColor: '#fff',
    borderRadius: 18,
    width: '100%',
    maxWidth: 400,
    paddingBottom: 12,
    elevation: 8,
    overflow: 'hidden',
  
  },
  header: {
    
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: 20, fontWeight: 'bold', color: '#222'
  },
  headerSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: 14, color: '#888', marginTop: 2
  },
  closeBtn: {
    
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
  
  },
  closeBtnText: {
    fontFamily: Fonts.bold,
    fontSize: 22, color: '#888', fontWeight: 'bold'
  },
  formSection: {
     padding: 16 
  },
  label: {
    fontFamily: Fonts.bold,
    fontSize: 15, fontWeight: 'bold', color: '#222', marginBottom: 8
  },
  inputRow: {
     flexDirection: 'row', alignItems: 'center', marginBottom: 8 
  },
  inputPrefix: {
    fontFamily: Fonts.regular,
    fontSize: 18, color: '#888', marginRight: 4
  },
  input: {
    fontFamily: Fonts.bold,
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#eee',
    color: '#222',
  },
  inputError: {
     borderColor: '#DC2626' 
  },
  quickRow: {
     flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 
  },
  quickBtn: {
    
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#eee',
  
  },
  quickBtnText: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold', color: '#6D28D9', fontSize: 15
  },
  termsRow: {
     paddingHorizontal: 16, marginBottom: 8 
  },
  checkbox: {
     flexDirection: 'row', alignItems: 'center', marginBottom: 4 
  },
  checkboxBox: {
    
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  checkboxChecked: {
     borderColor: '#6D28D9', backgroundColor: '#EDE9FE' 
  },
  checkboxError: {
     borderColor: '#DC2626' 
  },
  checkboxTick: {
    fontFamily: Fonts.bold,
    fontSize: 16, color: '#6D28D9', fontWeight: 'bold'
  },
  checkboxLabel: {
    fontFamily: Fonts.regular,
    fontSize: 14, color: '#222', flex: 1
  },
  errorText: {
    fontFamily: Fonts.regular,
    color: '#DC2626', fontSize: 13, marginTop: 2, marginBottom: 2
  },
  summaryBox: {
    
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    padding: 12,
    margin: 16,
    marginTop: 8,
  
  },
  summaryTitle: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 8
  },
  summaryRow: {
     flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 
  },
  summaryLabel: {
    fontFamily: Fonts.regular,
    color: '#555', fontSize: 14
  },
  summaryValue: {
    fontFamily: Fonts.bold,
    fontWeight: 'bold', color: '#222', fontSize: 15
  },
  actionRow: {
     flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginTop: 8 
  },
  cancelBtn: {
    
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#eee',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
  
  },
  cancelBtnText: {
    fontFamily: Fonts.bold,
    color: '#222', fontWeight: 'bold', fontSize: 16
  },
  payBtn: {
    
    flex: 1,
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  
  },
  payBtnDisabled: {
     backgroundColor: '#ccc' 
  },
  payBtnText: {
    fontFamily: Fonts.bold,
    color: '#fff', fontWeight: 'bold', fontSize: 16
  },

});

export default PaymentModal;