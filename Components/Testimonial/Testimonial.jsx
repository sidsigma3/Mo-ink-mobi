import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; // Expo uses this for icons

const testimonials = [
  {
    quote: 'testimonial.1',
    name: 'Ramesh Varma',
    role: 'Procurement Head, Bharat Textiles Pvt. Ltd.',
    date: '2024-07-20',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202592.png?updatedAt=1751099105221',
  },
  {
    quote: 'testimonial.2',
    name: 'Sneha Shah',
    role: 'Technical Lead, Triveni Fabrics',
    date: '2024-07-28',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202593.png?updatedAt=1751099105356',
  },
  {
    quote: 'testimonial.3',
    name: 'Vikram Patel',
    role: 'Director, Indigo Yarn Industries',
    date: '2024-06-15',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202591.png?updatedAt=1751099105224',
  },
  {
    quote: 'testimonial.4',
    name: 'Priya Menon',
    role: 'Sourcing Manager, Lakshmi Cotton Mills',
    date: '2024-08-01',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202597.png?updatedAt=1751099105323',
  },
  {
    quote: 'testimonial.5',
    name: 'Rahul Deshmukh',
    role: 'Owner, Deshmukh Weaving Works',
    date: '2024-07-10',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202594.png?updatedAt=1751099104830',
  },
  {
    quote: 'testimonial.6',
    name: 'Meera Iyer',
    role: 'Co-Founder, EcoTex Solutions',
    date: '2024-08-12',
    avatar:
      'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Ellipse%202596.png?updatedAt=1751099105304',
  },
];

const Testimonial = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.bigTitle}>550+</Text>
        <Text style={styles.subtitle}>{t('testimonial.reviewsTitle')}</Text>

        <View style={styles.avatarGroup}>
          {testimonials.map((t, index) => (
            <Image
              key={index}
              source={{ uri: t.avatar }}
              style={styles.avatarSmall}
            />
          ))}
        </View>

        <Text style={styles.totalUsers}>{t('testimonial.totalUsers')}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Category')}
        >
          <Text style={styles.buttonText}>{t('testimonial.button')}</Text>
        </TouchableOpacity>
      </View>

      {/* Cards */}
      <View style={styles.cardContainer}>
        {testimonials.map((te, i) => (
          <View key={i} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.stars}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <FontAwesome
                    key={index}
                    name="star"
                    size={14}
                    color="#F59C0E"
                    style={styles.star}
                  />
                ))}
              </View>
              <Text style={styles.ratingText}>(5/5)</Text>
              <Text style={styles.dateText}>{te.date}</Text>
            </View>

            <Text style={styles.quote}>“{t(te.quote)}”</Text>

            <View style={styles.profile}>
              <Image source={{ uri: te.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.name}>{te.name}</Text>
                <Text style={styles.role}>{te.role}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  bigTitle: {
    fontSize: 40,
    fontWeight: '800',
    color: '#6b21a8',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
    color: '#111827',
  },
  avatarGroup: {
    flexDirection: 'row',
    marginTop: 12,
    flexWrap: 'wrap',
    gap: 4,
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 2,
    borderWidth: 2,
    borderColor: '#fff',
  },
  totalUsers: {
    marginTop: 12,
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#6b21a8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 4,
  },
  star: {
    marginHorizontal: 1,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  dateText: {
    marginLeft: 'auto',
    fontSize: 12,
    color: '#9ca3af',
  },
  quote: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 12,
    lineHeight: 20,
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 10,
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  role: {
    fontSize: 12,
    color: '#6b7280',
  },
});

export default Testimonial;
