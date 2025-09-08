import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const BlogBox2 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const truncateWords = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const handlePress = () => {
    navigation.navigate('Blog2'); // Make sure "Blog2" is registered in your navigator
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.9} style={styles.card}>
      <Image
        source={{ uri: 'https://images.pexels.com/photos/4492073/pexels-photo-4492073.jpeg' }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{t('blog.blog2.title')}</Text>
        <Text style={styles.description}>
          {truncateWords(t('blog.blog2.description'), 20)}
        </Text>
        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.readMore}>
            {t('blog.readMore')} <Text style={styles.arrow}>&rarr;</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    elevation: 3,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  description: {
    color: '#555',
    fontSize: 14,
    marginBottom: 10,
  },
  readMore: {
    color: '#6B21A8', // purple-800
    fontWeight: '500',
    fontSize: 14,
  },
  arrow: {
    fontSize: 16,
  },
});

export default BlogBox2;
