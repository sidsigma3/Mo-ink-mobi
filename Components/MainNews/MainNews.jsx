import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const MainNews = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const points = [
    {
      title: t('mainNews.points.trends.title'),
      text: t('mainNews.points.trends.text'),
    },
    {
      title: t('mainNews.points.launches.title'),
      text: t('mainNews.points.launches.text'),
    },
    {
      title: t('mainNews.points.success.title'),
      text: t('mainNews.points.success.text'),
    },
    {
      title: t('mainNews.points.tips.title'),
      text: t('mainNews.points.tips.text'),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>

        {/* Left Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Screenshot%202025-06-14%20115658.png?updatedAt=1749882502369',
            }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Right Text */}
        <View style={styles.textContainer}>
          <Text style={styles.subtitle}>{t('mainNews.subtitle')}</Text>
          <Text style={styles.title}>{t('mainNews.title')}</Text>
          <Text style={styles.description}>{t('mainNews.description')}</Text>

          {points.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <Text style={styles.bullet}>✔</Text>
              <Text style={styles.pointText}>
                <Text style={styles.pointTitle}>{item.title}: </Text>
                {item.text}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('News')}
          >
            <Text style={styles.buttonText}>{t('mainNews.button')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBED',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  innerContainer: {
    flexDirection: 'column',
    gap: 30,
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#ffe382',
  },
  textContainer: {
    marginTop: 20,
  },
  subtitle: {
    color: '#6b21a8',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  bullet: {
    color: '#6b21a8',
    fontSize: 18,
  },
  pointText: {
    fontSize: 16,
    color: '#1f2937',
    flex: 1,
  },
  pointTitle: {
    fontWeight: 'bold',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#6b21a8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#6b21a8',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#FFEE9A',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default MainNews;
