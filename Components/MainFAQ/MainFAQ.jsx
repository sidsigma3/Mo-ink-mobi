import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';

// Enable layout animation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MainFAQ = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    { question: t('mainFAQ.q1'), answer: t('mainFAQ.a1') },
    { question: t('mainFAQ.q2'), answer: t('mainFAQ.a2') },
    { question: t('mainFAQ.q3'), answer: t('mainFAQ.a3') },
    { question: t('mainFAQ.q4'), answer: t('mainFAQ.a4') },
  ];

  const toggleFAQ = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Left Section - FAQs */}
      <View style={styles.faqSection}>
        {faqs.map((faq, index) => {
          const isOpen = index === activeIndex;
          return (
            <View
              key={index}
              style={[styles.card, isOpen ? styles.cardOpen : styles.cardClosed]}
            >
              <TouchableOpacity onPress={() => toggleFAQ(index)} style={styles.cardHeader}>
                <View style={[styles.toggleIcon, isOpen ? styles.iconOpen : styles.iconClosed]}>
                  <Text style={styles.iconText}>{isOpen ? '−' : '+'}</Text>
                </View>
                <Text style={styles.questionText}>{faq.question}</Text>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.answerWrapper}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* Right Section - Text + Image */}
      <View style={styles.infoSection}>
        <Text style={styles.subtitle}>{t('mainFAQ.subtitle')}</Text>
        <Text style={styles.title}>{t('mainFAQ.title')}</Text>
        <Text style={styles.description}>{t('mainFAQ.description')}</Text>

        <View style={styles.pointsAndImage}>
          {/* Points */}
          <View style={styles.pointsList}>
            <Text style={styles.pointItem}>✔ {t('mainFAQ.point1')}</Text>
            <Text style={styles.pointItem}>✔ {t('mainFAQ.point2')}</Text>
            <Text style={styles.pointItem}>✔ {t('mainFAQ.point3')}</Text>
          </View>

          {/* Image */}
          <Image
            source={{uri:'../../assets/Images/FAQYarn.jpg'}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  faqSection: {
    marginBottom: 30,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  cardOpen: {
    backgroundColor: '#6b21a8',
  },
  cardClosed: {
    backgroundColor: '#f3e8ff',
    borderWidth: 1,
    borderColor: '#d8b4fe',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
  },
  iconOpen: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  iconClosed: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    flexShrink: 1,
  },
  answerWrapper: {
    marginTop: 10,
  },
  answerText: {
    fontSize: 14,
    color: '#f3f4f6',
    lineHeight: 20,
  },
  infoSection: {
    marginTop: 20,
  },
  subtitle: {
    color: '#6b21a8',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#4b5563',
    fontSize: 15,
    marginBottom: 16,
  },
  pointsAndImage: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  pointsList: {
    flex: 1,
    gap: 8,
  },
  pointItem: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 100,
    overflow: 'hidden',
  },
});

export default MainFAQ;
