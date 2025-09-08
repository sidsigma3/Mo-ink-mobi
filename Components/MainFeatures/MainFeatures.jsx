import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const features = [
  {
    img: 'services.png',
    titleKey: 'featuresCard1Title',
    textKey: 'featuresCard1Text',
  },
  {
    img: 'save-the-world.png',
    titleKey: 'featuresCard2Title',
    textKey: 'featuresCard2Text',
  },
  {
    img: 'charity.png',
    titleKey: 'featuresCard3Title',
    textKey: 'featuresCard3Text',
  },
  {
    img: 'delivery-service.png',
    titleKey: 'featuresCard4Title',
    textKey: 'featuresCard4Text',
  },
  {
    img: 'risk-management.png',
    titleKey: 'featuresCard5Title',
    textKey: 'featuresCard5Text',
  },
  {
    img: 'receiving (1).png',
    titleKey: 'featuresCard6Title',
    textKey: 'featuresCard6Text',
  },
];

const MainFeatures = () => {
  const { t } = useTranslation();
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 768;

  return (
    <ScrollView contentContainerStyle={styles.container}>
    
      <View style={styles.header}>
        <Text style={styles.subtitle}>{t('features')}</Text>
        <Text style={styles.title}>{t('featuresHeading')}</Text>
      </View>


      <View style={styles.grid}>
        {features.map((card, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.iconWrapper}>
              <Image
                source={{
                  uri: `https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/${card.img}`,
                }}
                style={styles.icon}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.cardTitle}>{t(card.titleKey)}</Text>
            {!isSmallScreen && (
              <Text style={styles.cardText}>{t(card.textKey)}</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b21a8', // purple-800
    fontWeight: 'bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f3e8ff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
    position: 'relative',
  },
  iconWrapper: {
    backgroundColor: '#f9fafb',
    borderRadius: 50,
    padding: 10,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6b21a8',
    marginBottom: 20,
  },
  icon: {
    width: 50,
    height: 50,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});


export default MainFeatures;
