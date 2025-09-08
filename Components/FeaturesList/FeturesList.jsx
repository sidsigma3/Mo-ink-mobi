import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  FontAwesome as Icon,
  FontAwesome5,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

const FeaturesList = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: <Icon name="star" size={24} color="#9333ea" />,
      title: t('features.quality.title'),
      description: t('features.quality.description'),
    },
    {
      icon: <Icon name="tags" size={24} color="#9333ea" />,
      title: t('features.pricing.title'),
      description: t('features.pricing.description'),
    },
    {
      icon: <Icon name="truck" size={24} color="#9333ea" />,
      title: t('features.logistics.title'),
      description: t('features.logistics.description'),
    },
    {
      icon: <FontAwesome5 name="yarn" size={24} color="#9333ea" />,
      title: t('features.yarn.title'),
      description: t('features.yarn.description'),
    },
    {
      icon: <Icon name="credit-card" size={24} color="#9333ea" />,
      title: t('features.credit.title'),
      description: t('features.credit.description'),
    },
    {
      icon: <MaterialCommunityIcons name="ear-hearing" size={24} color="#9333ea" />,
      title: t('features.assist.title'),
      description: t('features.assist.description'),
    },
  ];

  const renderFeature = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.iconBox}>{item.icon}</View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{t('features.heading')}</Text>
      <FlatList
        data={features}
        renderItem={renderFeature}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 24,
  },
  grid: {
    justifyContent: 'center',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff7ed',
    padding: 16,
    borderRadius: 16,
    borderColor: '#e9d5ff',
    borderWidth: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  iconBox: {
    width: 64,
    height: 64,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6b7280',
  },
});

export default FeaturesList;
