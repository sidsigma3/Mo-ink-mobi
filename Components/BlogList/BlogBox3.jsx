import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const BlogBox3 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const truncateWords = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const goToBlog = () => {
    navigation.navigate('Blog3'); // Make sure 'Blog3' is defined in your navigation stack
  };

  return (
    <TouchableOpacity onPress={goToBlog} activeOpacity={0.9} style={styles.container}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/14115141/pexels-photo-14115141.jpeg' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>
          {t('blog.blog3.title')}
        </Text>
        <Text style={styles.description}>
          {truncateWords(t('blog.blog3.description'), 20)}
        </Text>
        <TouchableOpacity onPress={goToBlog} style={styles.readMore}>
          <Text style={styles.readMoreText}>
            {t('blog.readMore')} →
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb', // Tailwind's gray-100
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827', // Tailwind's gray-900
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#6b7280', // Tailwind's gray-500
    marginBottom: 12,
  },
  readMore: {
    alignSelf: 'flex-start',
  },
  readMoreText: {
    color: '#6D28D9', // Tailwind's purple-800
    fontSize: 14,
    fontWeight: '500',
  },
});

export default BlogBox3;
