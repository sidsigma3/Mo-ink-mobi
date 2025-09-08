import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const MainCone = () => {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>

      <View style={[styles.container, isLargeScreen && styles.containerLarge]}>

        {/* Left Column: Yarn in Cone */}
        <View style={[styles.column, isLargeScreen && styles.reverseColumn]}>
          <Image
            source={{uri:'../../assets/Images/Yarn_Cone.png'}}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textBlock}>
            <Text style={styles.subtitle}>{t('textile.cone.subtitle')}</Text>
            <Text style={styles.title}>{t('textile.cone.title')}</Text>
            <Text style={styles.description}>{t('textile.cone.description')}</Text>
          </View>
        </View>

        {/* Right Column: Yarn in Hank */}
        <View style={styles.column}>
          <Image
            source={{uri:'../../assets/Images/Yarn_Hank.png'}}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textBlock}>
            <Text style={styles.subtitle}>{t('textile.hank.subtitle')}</Text>
            <Text style={styles.title}>{t('textile.hank.title')}</Text>
            <Text style={styles.description}>{t('textile.hank.description')}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#FFFBED',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  container: {
    flexDirection: 'column',
    gap: 30,
  },
  containerLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    gap: 16,
  },
  reverseColumn: {
    flexDirection: 'column-reverse',
  },
  textBlock: {
    paddingHorizontal: 10,
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
    fontSize: 26,
    fontWeight: '600',
    color: '#000',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    color: '#4B5563',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
});

export default MainCone;
