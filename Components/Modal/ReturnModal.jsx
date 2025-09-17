import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert } from "react-native";
import Toast from '../Toast/Toast'; // You must implement/adapt this for RN

const ReturnModal = ({ visible, onClose, onConfirm, weight }) => {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");
  const [returnWeight, setReturnWeight] = useState("");
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "error") => {
    setToasts([{ message, type }]);
    setTimeout(() => setToasts([]), 3000);
  };

  const handleWeightChange = (value) => {
    // Allow empty string to let user fully clear input
    setReturnWeight(value === "" ? "" : Number(value));
  };

  const isSubmitDisabled =
    !reason || returnWeight <= 0 || returnWeight > weight;

  const handleConfirm = () => {
    if (!reason) {
      showToast("Please select a reason.", "error");
      return;
    }
    onConfirm({ reason, comment, returnWeight });
    setReason("");
    setComment("");
    setReturnWeight("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Return Request</Text>
          <Text style={styles.desc}>
            Are you sure you want to request a return? Please select a reason below:
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Reason for return:</Text>
            <View style={styles.radioRow}>
              <TouchableOpacity
                style={styles.radioBtn}
                onPress={() => setReason("Color Mismatch")}
              >
                <View style={[
                  styles.radioCircle,
                  reason === "Color Mismatch" && styles.radioSelected
                ]}>
                  {reason === "Color Mismatch" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Color Mismatch</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioBtn}
                onPress={() => setReason("Quality Issue")}
              >
                <View style={[
                  styles.radioCircle,
                  reason === "Quality Issue" && styles.radioSelected
                ]}>
                  {reason === "Quality Issue" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioLabel}>Quality Issue</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Return Weight (kg):</Text>
            <TextInput
              style={styles.input}
              value={returnWeight === "" ? "" : String(returnWeight)}
              onChangeText={handleWeightChange}
              placeholder="Enter weight..."
              keyboardType="numeric"
              min={1}
              max={weight}
              editable={true}
            />
            {returnWeight !== "" && returnWeight <= 0 && (
              <Text style={styles.errorText}>
                Return weight must be greater than 0
              </Text>
            )}
            {returnWeight !== "" && returnWeight > weight && (
              <Text style={styles.errorText}>
                Return weight cannot exceed {weight} kg
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Comment (optional):</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              value={comment}
              onChangeText={setComment}
              placeholder="Write a comment..."
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                isSubmitDisabled ? styles.confirmBtnDisabled : null
              ]}
              onPress={handleConfirm}
              disabled={isSubmitDisabled}
            >
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Toast Notification */}
        <View style={styles.toastContainer}>
          {toasts.map((toast, idx) => (
            <Toast
              key={idx}
              message={toast.message}
              type={toast.type}
              onClose={() => setToasts([])}
            />
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 350,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 8,
    textAlign: "center",
  },
  desc: {
    fontSize: 15,
    color: "#222",
    marginBottom: 12,
    textAlign: "center",
  },
  section: { marginBottom: 14 },
  label: { fontWeight: "bold", color: "#222", marginBottom: 6 },
  radioRow: { flexDirection: "row", gap: 18 },
  radioBtn: { flexDirection: "row", alignItems: "center", marginRight: 18 },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#6D28D9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radioSelected: { borderColor: "#6D28D9" },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#6D28D9",
  },
  radioLabel: { fontSize: 15, color: "#222" },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#222",
    fontSize: 15,
    marginTop: 2,
  },
  errorText: { color: "#DC2626", fontSize: 13, marginTop: 2 },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 10,
  },
  cancelBtn: {
    backgroundColor: "#eee",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
  },
  cancelBtnText: { color: "#222", fontWeight: "bold", fontSize: 16 },
  confirmBtn: {
    backgroundColor: "#6D28D9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  confirmBtnDisabled: { backgroundColor: "#ccc" },
  confirmBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  toastContainer: {
    position: "absolute",
    top: 30,
    right: 0,
    left: 0,
    alignItems: "center",
    zIndex: 99,
  },
});

export default ReturnModal;