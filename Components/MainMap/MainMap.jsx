import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const MainMap = () => {
  const { t } = useTranslation();
  const [MapView, setMapView] = useState(null);

  // Dynamically import react-native-maps ONLY on native platforms
  useEffect(() => {
    if (Platform.OS !== 'web') {
      import('react-native-maps').then((module) => {
        setMapView(() => module.default);
      });
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.textWrapper}>
        <Text style={styles.subtitle}>{t('mainMap.subtitle')}</Text>
        <Text style={styles.title}>{t('mainMap.title')}</Text>
        <Text style={styles.description}>{t('mainMap.description')}</Text>
      </View>

      <View style={styles.mapWrapper}>
        {Platform.OS === 'web' ? (
          <Image
            source={{
              uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/MainMap.png?updatedAt=1746636596949',
            }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          MapView && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: 20.5937,
                longitude: 78.9629,
                latitudeDelta: 10,
                longitudeDelta: 10,
              }}
            />
          )
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 48,
    alignItems: 'center',
  },
  textWrapper: {
    alignItems: 'center',
    paddingHorizontal: 16,
    maxWidth: 800,
  },
  subtitle: {
    color: '#6b21a8',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  description: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  mapWrapper: {
    width: '100%',
    marginTop: 40,
    paddingHorizontal: 16,
  },
  image: {
    width: width - 32,
    height: width * 0.6,
    alignSelf: 'center',
  },
  map: {
    width: width - 32,
    height: width * 0.6,
    alignSelf: 'center',
    borderRadius: 12,
  },
});

export default MainMap;
