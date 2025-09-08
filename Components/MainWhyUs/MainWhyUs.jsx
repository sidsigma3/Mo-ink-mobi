import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MainWhyUs = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground
        // source={require('../../assets/images/pattern-bg.png')} // update this to your local asset
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.contentWrapper}>
          {/* Image Section */}
          <View style={styles.imageWrapper}>
            <Image
              source={{
                uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/col-bgimage-1.png?updatedAt=1751860378548',
              }}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Text Section */}
          <View style={styles.textWrapper}>
            <Text style={styles.heading}>{t('whyUs.heading')}</Text>
            <Text style={styles.title}>{t('whyUs.title')}</Text>
            <Text style={styles.description}>{t('whyUs.desc1')}</Text>
            <Text style={styles.description}>{t('whyUs.desc2')}</Text>
            <Text style={styles.description}>{t('whyUs.desc3')}</Text>

            {/* Metrics */}
            <View style={styles.metricsRow}>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>₹ 10 Cr+</Text>
                <Text style={styles.metricLabel}>{t('whyUs.metric1')}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>₹ 1L+</Text>
                <Text style={styles.metricLabel}>{t('whyUs.metric2')}</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricValue}>1.5L+ Kg</Text>
                <Text style={styles.metricLabel}>{t('whyUs.metric3')}</Text>
              </View>
            </View>

            {/* Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('KnowMore')}
              style={styles.button}
            >
              <Text style={styles.buttonText}>{t('whyUs.button')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  background: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#21133a',
  },
  contentWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: width * 0.9,
    height: 300,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  textWrapper: {
    width: '100%',
  },
  heading: {
    color: '#FFEE9A',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFEE9A',
  },
  metricLabel: {
    color: '#fff',
    marginTop: 4,
    textAlign: 'center',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#FFEE9A',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FFEE9A',
    alignItems: 'center',
  },
  buttonText: {
    color: '#21133a',
    fontWeight: 'bold',
  },
});


export default MainWhyUs;
