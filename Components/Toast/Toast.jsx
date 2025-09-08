import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // or react-native-vector-icons

const Toast = ({ message, onClose, type = "success" }) => {
  const [visible, setVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current; // slide from right
  const opacityAnim = useRef(new Animated.Value(0)).current; // fade
  const progressAnim = useRef(new Animated.Value(1)).current; // progress bar

  const isSuccess = type === "success";

  useEffect(() => {
    setVisible(true);

    // Slide in
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease)
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      })
    ]).start();

    // Progress bar countdown
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: false
    }).start();

    // Auto close after 3 sec
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        })
      ]).start(() => {
        setVisible(false);
        onClose && onClose();
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          backgroundColor: "#FFFFFF",
          borderColor: isSuccess ? "#0DA40D" : "#DB3232",
          transform: [{ translateX: slideAnim }],
          opacity: opacityAnim
        }
      ]}
    >
      <FontAwesome
        name={isSuccess ? "check-circle" : "minus-circle"}
        size={24}
        color={isSuccess ? "#0DA40D" : "#DB3232"}
        style={{ marginRight: 8 }}
      />
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          fontWeight: "500",
          color: isSuccess ? "#0DA40D" : "#DB3232"
        }}
      >
        {message}
      </Text>
      {/* Progress bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            backgroundColor: isSuccess ? "#0DA40D" : "#DB3232",
            transform: [
              {
                scaleX: progressAnim
              }
            ]
          }
        ]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 2,
    borderRadius: 8,
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    minWidth: 250,
    maxWidth: "90%",
    overflow: "hidden"
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    width: "100%",
    transformOrigin: "left"
  }
});

export default Toast;
