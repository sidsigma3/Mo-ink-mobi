import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'; 

const HeroSection = ({ productName, breadcrumbs = [] }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/cta_bg.png')}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Product Name */}
          <Text style={styles.title}>{productName}</Text>

          {/* Breadcrumbs */}
          <View style={styles.breadcrumbWrapper}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.breadcrumbScrollContainer}
            >
              <View style={styles.breadcrumbContainer}>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity 
                      onPress={() => console.log('Go to', breadcrumb.link)}
                      style={styles.breadcrumbButton}
                    >
                      <Text style={styles.breadcrumbText}>{breadcrumb.label}</Text>
                    </TouchableOpacity>

                    {index < breadcrumbs.length - 1 && (
                      <Icon 
                        name="chevron-right" 
                        size={14} 
                        color="rgba(255, 255, 255, 0.8)" 
                        style={styles.icon} 
                      />
                    )}
                  </React.Fragment>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 22,
    overflow: 'hidden',
    // Add shadow for better visual appeal
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  background: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
    // Add text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  breadcrumbWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  breadcrumbScrollContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '100%',
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  breadcrumbButton: {
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  breadcrumbText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '400',
    textAlign: 'center',
    // Add text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  icon: {
    marginHorizontal: 8,
    marginTop: 1, // Slight adjustment for better vertical alignment
  },
});