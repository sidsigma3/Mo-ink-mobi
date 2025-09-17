import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ModalConfirmReplaceCart = ({ isOpen, onCancel, onConfirm }) => {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          <TouchableOpacity style={styles.closeBtn} onPress={onCancel}>
            <Text style={styles.closeBtnText}>&times;</Text>
          </TouchableOpacity>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>!</Text>
          </View>
          <Text style={styles.title}>Replace Existing Cart?</Text>
          <Text style={styles.message}>
            Your cart already has some items. Do you want to replace them with items from this order?
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.btnOutline} onPress={onCancel}>
              <Text style={styles.btnOutlineText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnPrimary} onPress={onConfirm}>
              <Text style={styles.btnPrimaryText}>Yes, Replace Items</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    elevation: 8,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    elevation: 2,
  },
  closeBtnText: {
    fontSize: 22,
    color: "#888",
    fontWeight: "bold",
  },
  iconCircle: {
    backgroundColor: "#EDE9FE",
    borderRadius: 32,
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  iconText: {
    color: "#6D28D9",
    fontSize: 28,
    fontWeight: "bold",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#6D28D9",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#222",
    marginBottom: 18,
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  btnOutline: {
    borderWidth: 2,
    borderColor: "#6D28D9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: "#fff",
    marginRight: 8,
  },
  btnOutlineText: {
    color: "#6D28D9",
    fontWeight: "bold",
    fontSize: 16,
  },
  btnPrimary: {
    backgroundColor: "#6D28D9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ModalConfirmReplaceCart;