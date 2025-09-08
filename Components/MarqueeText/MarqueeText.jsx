import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

const MarqueeText = () => {
  const { t } = useTranslation();

  const textKeys = [
    "marquee.engineered",
    "marquee.precision",
    "marquee.softTouch",
    "marquee.builtToWeave"
  ];

  const colors = ['#7C3AED', '#FBBF24', '#EF4444', '#10B981']; // Replace with your desired hex colors
  const windowWidth = Dimensions.get('window').width;
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loopAnimation = () => {
      Animated.sequence([
        Animated.timing(scrollX, {
          toValue: -windowWidth,
          duration: 8000,
          useNativeDriver: true
        }),
        Animated.timing(scrollX, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true
        })
      ]).start(() => loopAnimation());
    };

    loopAnimation();
  }, [scrollX, windowWidth]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.marqueeContainer, { transform: [{ translateX: scrollX }] }]}>
        {[...Array(2)].map((_, loopIndex) =>
          textKeys.map((key, index) => (
            <View key={`${loopIndex}-${index}`} style={styles.item}>
              <Text style={[styles.star, { color: colors[index % colors.length] }]}>★</Text>
              <Text style={styles.text}>{t(key)}</Text>
            </View>
          ))
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: '#fff',
    paddingVertical: 12
  },
  marqueeContainer: {
    flexDirection: 'row'
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16
  },
  star: {
    fontSize: 20,
    marginRight: 8
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111'
  }
});

export default MarqueeText;
