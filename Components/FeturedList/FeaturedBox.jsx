import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

const FeaturedBox = ({ productName, number, color, imageUrl , onPress }) => {
  const categoryImages = {
  Cotton: require("../../assets/Images/Yarn3.jpg"),
  Excel: require("../../assets/Images/Yarn2.jpg"),
  "Micro Modal": require("../../assets/Images/Yarn5.jpg"),
  Bamboo: require("../../assets/Images/Yarn4.jpg"),
  "Lenzing Micro Modal": {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn1.png?updatedAt=1754928796191",
  },
  Viscose: {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn7.jpg?updatedAt=1749718954502",
  },
  Tencel: {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn6.jpg?updatedAt=1749718954437",
  },
  Ecovero: {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8.png?updatedAt=1754927536082",
  },
  "Birla Micro Modal": {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarnss.png?updatedAt=1754933798745",
  },
  Livaeco: {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarns.png?updatedAt=1754933780605",
  },
  "Flax Varieties": {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn7%20%20.png?updatedAt=1754927543913",
  },
  "Excel-Linen": {
    uri: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Yarn8.png?updatedAt=1754927906052",
  },
};


  const imageSrc = imageUrl || categoryImages[productName] || '';

  return (
    <View style={{ paddingRight: 8 }}>
      <TouchableOpacity style={styles.mobileBox} onPress={onPress}>
        <ImageBackground
           source={categoryImages[productName] || { uri: imageUrl }}
            resizeMode="cover"
            style={styles.bgImage}
            imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.overlay} />
          <View style={styles.labelWrapper}>
            <Text style={styles.labelText}>{productName}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mobileBox: {
    width: 115,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
  },
  bgImage: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  labelWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#6B21A8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderBottomRightRadius: 8,
  },
  labelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
});

export default FeaturedBox;
