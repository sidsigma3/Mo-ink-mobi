import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Base + random palette
const basePalette = [
  "#f0e2cf", "#6c4a3c", "#c48a84", "#8b456f", "#d287a6", "#7e3743",
  "#b6716f", "#a5525d", "#e4b5a5", "#50363c"
];
const generateRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
const palette = [...basePalette, ...Array.from({ length: 50 }, generateRandomColor)];

const MainColors = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Auto-scroll effect
  useEffect(() => {
    let direction = 1;
    const interval = setInterval(() => {
      scrollRef.current?.scrollTo({
        x: scrollX._value + direction * 2,
        animated: true,
      });
      scrollX.setValue(scrollX._value + direction * 2);

      // Reset if we hit bounds (naive check)
      if (scrollX._value > 3000 || scrollX._value < 0) direction *= -1;
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.subtitle}>{t('mainColors.subtitle')}</Text>
        <Text style={styles.title}>
          {t('mainColors.title')}
          <Text style={styles.gradientText}> {t('mainColors.highlight')}</Text>
        </Text>
        <Text style={styles.description}>{t('mainColors.description')}</Text>
      </View>

      <ScrollView
        horizontal
        ref={scrollRef}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {palette.map((hex, index) => (
          <View key={index} style={styles.colorWrapper}>
            <View style={[styles.colorBox, { backgroundColor: hex }]}>
              <View style={styles.innerCircle} />
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ColorPalette')}
      >
        <Text style={styles.buttonText}>{t('mainColors.button')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  subtitle: {
    color: '#6b21a8',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 14,
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gradientText: {
    color: '#f59e0b',
  },
  description: {
    color: '#4b5563',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    maxWidth: 300,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 20,
  },
  colorWrapper: {
    width: 60,
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorBox: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: '70%',
    height: '70%',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#fff',
  },
  button: {
    backgroundColor: '#6b21a8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MainColors;
