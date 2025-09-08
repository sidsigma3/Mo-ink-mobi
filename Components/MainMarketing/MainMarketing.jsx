import React from 'react';
import { View, Image, StyleSheet, Dimensions, Platform } from 'react-native';

const MainMarketing = () => {
  return (
    <View style={styles.section}>
      <View style={styles.imageWrapper}>
        <Image
          source={{uri:'../../assets/Images/MainMarketing.png'}} // adjust path if needed
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    width: '100%',
    backgroundColor: '#FFFBED',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    paddingVertical: 48, // ~my-12
  },
  imageWrapper: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  image: {
    width: '100%',
    height: Platform.OS === 'web' ? 400 : Dimensions.get('window').width * 0.6,
  },
});

export default MainMarketing;
