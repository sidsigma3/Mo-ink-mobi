import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 

const HeroSection = ({ productName, breadcrumbs = [] }) => {
  return (
    <ImageBackground
      source={require('../../assets/Images/cta-bg.png')} // ✅ Correct way for local image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Product Name */}
        <Text style={styles.title}>{productName}</Text>

        {/* Breadcrumbs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.breadcrumbContainer}>
            {breadcrumbs.map((breadcrumb, index) => (
              <View key={index} style={styles.breadcrumbItem}>
                <TouchableOpacity onPress={() => console.log('Go to', breadcrumb.link)}>
                  <Text style={styles.breadcrumbText}>{breadcrumb.label}</Text>
                </TouchableOpacity>

                {index < breadcrumbs.length - 1 && (
                  <Icon name="chevron-right" size={16} color="#fff" style={styles.icon} />
                )}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  background: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbText: {
    fontSize: 14,
    color: '#fff',
  },
  icon: {
    marginHorizontal: 4,
  },
});
