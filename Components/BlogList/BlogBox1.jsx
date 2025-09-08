import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const BlogBox1 = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const truncateWords = (text, wordLimit) => {
    const words = text.split(' ');
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(' ') + '...'
      : text;
  };

  const handlePress = () => {
    navigation.navigate('Blog1'); // assumes you have a screen named 'Blog1' in your navigator
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.card}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/845263/pexels-photo-845263.jpeg' }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.content}>
          <Text style={styles.title}>
            {t('blog.box1.title')}
          </Text>

          <Text style={styles.description}>
            {truncateWords(t('blog.box1.desc'), 20)}
          </Text>

          <TouchableOpacity onPress={handlePress}>
            <Text style={styles.readMore}>
              {t('blog.readMore')} →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    elevation: 2,
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
    color: '#1f2937', // gray-900
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280', // gray-500
  },
  readMore: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
    color: '#6d28d9', // purple-800
  },
});

export default BlogBox1;
