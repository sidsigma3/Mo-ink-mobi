import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

const BlogBox4 = () => {
  const { t } = useTranslation();

  function truncateWords(text, wordLimit) {
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  }

  const handlePress = () => {
    Linking.openURL('https://your-website.com/Blog4'); // Replace with your actual route
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image
        source={{ uri: "https://images.pexels.com/photos/1122844/pexels-photo-1122844.jpeg" }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{t("blog.blog4.title")}</Text>

        <Text style={styles.description}>
          {truncateWords(t("blog.blog4.description"), 20)}
        </Text>

        <TouchableOpacity onPress={handlePress}>
          <Text style={styles.readMore}>
            {t("blog.readMore")} →
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 6,
  },
  description: {
    color: '#6b7280',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  readMore: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6D28D9',
  },
});

export default BlogBox4;
