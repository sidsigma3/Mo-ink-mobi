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

const steps = [
  {
    titleKey: 'mainProcess.step1.title',
    descriptionKey: 'mainProcess.step1.description',
    image: require('../../assets/Images/step1.png'),
  },
  {
    titleKey: 'mainProcess.step2.title',
    descriptionKey: 'mainProcess.step2.description',
    image: require('../../assets/Images/Step2.png'),
  },
  {
    titleKey: 'mainProcess.step3.title',
    descriptionKey: 'mainProcess.step3.description',
    image: require('../../assets/Images/Step3.png'),
  },
  {
    titleKey: 'mainProcess.step4.title',
    descriptionKey: 'mainProcess.step4.description',
    image: require('../../assets/Images/Step4.png'),
  },
  {
    titleKey: 'mainProcess.step5.title',
    descriptionKey: 'mainProcess.step5.description',
    image: require('../../assets/Images/step5.png'),
  },
  {
    titleKey: 'mainProcess.step6.title',
    descriptionKey: 'mainProcess.step6.description',
    image: require('../../assets/Images/step6.png'),
  },
];

export default function MainProcess() {
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.subtitle}>{t('mainProcess.subtitle')}</Text>
        <Text style={styles.title}>{t('mainProcess.title')}</Text>
        <Text style={styles.description}>{t('mainProcess.description')}</Text>
      </View>

      {/* Steps Grid */}
      <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
        {steps.map((step, index) => (
          <View key={index} style={styles.card}>
            <Image source={step.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.cardTitle}>{t(step.titleKey)}</Text>
            <Text style={styles.cardDescription}>{t(step.descriptionKey)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
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
    color: '#111827',
    textAlign: 'center',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 500,
  },
  grid: {
    flexDirection: 'column',
    gap: 16,
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  image: {
    height: 80,
    width: 80,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});
