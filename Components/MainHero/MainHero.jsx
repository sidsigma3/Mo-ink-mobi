import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
  ImageBackground
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const screenHeight = Dimensions.get('window').height;

const MainHero = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const isMobile = width < 768; // Tailwind 'sm:' breakpoint ≈ 768px

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1}}>
      <View style={styles.container}>
        {/* Conditional based on screen width */}
        {isMobile ? (
          // 📱 Mobile View
          <View style={styles.mobileWrapper}>
            <Image
              source={{
                uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/MainHero_Mobile_Banner.png?updatedAt=1749534746101',
              }}
              style={styles.mobileImage}
            />

            <View style={styles.overlay} />

            <View style={styles.contentWrapper}>
              <Text style={styles.heading}>{t('heroHeading')}</Text>
              <Text style={styles.subtext}>{t('heroSubtext1')}</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Auth')}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('exploreYarns')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          // 💻 Desktop View (for tablets or larger screens)
          <ImageBackground
            source={{
              uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/MainHero_Banner.png?updatedAt=1745685185559',
            }}
            style={styles.desktopWrapper}
            imageStyle={{ resizeMode: 'cover' }}
          >
            <View style={styles.contentWrapper}>
              <Text style={styles.desktopHeading}>{t('heroHeading')}</Text>
              <Text style={styles.desktopSubtext}>
                {t('heroSubtext1')}{'\n'}
                {t('heroSubtext2')}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Auth')}
                style={styles.button}
              >
                <Text style={styles.buttonText}>{t('exploreYarns')}</Text>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    height:screenHeight
  },
  mobileWrapper: {
    width: '100%',
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,245,234,0.9)',
  },
  contentWrapper: {
    zIndex: 2,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#000',
  },
  subtext: {
    textAlign: 'center',
    color: '#4b5563', // gray-800
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#6b21a8', // purple-800
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#6b21a8',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  desktopWrapper: {
    width: '100%',
    height: 600,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  desktopHeading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginBottom: 12,
  },
  desktopSubtext: {
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 20,
    fontSize: 16,
  },
});


export default MainHero