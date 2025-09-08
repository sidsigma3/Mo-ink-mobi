import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQs = ({ t }) => {
  const breadcrumbs = [
    { label: t ? t("faqs.breadcrumb.home") : "Home", link: "/home" },
    { label: t ? t("faqs.breadcrumb.faqs") : "FAQs", link: "/FAQs" },
  ];

  const faqData = [
    {
      question: t ? t("faqs.question1") : "What is your return policy?",
      answer: t ? t("faqs.answer1") : "You can return products within 7 days of delivery if they meet our return conditions.",
    },
    {
      question: t ? t("faqs.question2") : "How do I track my order?",
      answer: t ? t("faqs.answer2") : "Log in to your account and go to 'My Orders' to track your shipment.",
    },
    {
      question: t ? t("faqs.question3") : "Do you offer international shipping?",
      answer: t ? t("faqs.answer3") : "Currently, we only ship within India.",
    },
    {
      question: t ? t("faqs.question4") : "How can I contact support?",
      answer: t ? t("faqs.answer4") : "Email us at support@inkndyes.com or call our helpline.",
    },
    {
      question: t ? t("faqs.question5") : "Can I change my shipping address after placing an order?",
      answer: t ? t("faqs.answer5") : "Contact support as soon as possible to request an address change.",
    },
    {
      question: t ? t("faqs.question6") : "What payment methods do you accept?",
      answer: t ? t("faqs.answer6") : "We accept credit/debit cards, UPI, and net banking.",
    },
    {
      question: t ? t("faqs.question7") : "How do I apply a coupon?",
      answer: t ? t("faqs.answer7") : "Enter your coupon code at checkout to avail discounts.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-question" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>{t ? t("faqs.pageTitle") : "FAQs"}</Text>
        <Text style={styles.breadcrumbs}>
          {breadcrumbs.map(b => b.label).join(' > ')}
        </Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.mainTitle}>{t ? t("faqs.mainTitle") : "Frequently Asked Questions"}</Text>
        <Text style={styles.introText}>
          {t ? t("faqs.introduction") : "Find answers to common questions below."}
        </Text>

        <View style={styles.faqSection}>
          {faqData.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleFAQ(index)}
                activeOpacity={0.7}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <Icon
                  name={openIndex === index ? "chevron-up" : "chevron-down"}
                  size={22}
                  color="#6B21A8"
                />
              </TouchableOpacity>
              {openIndex === index && (
                <View style={styles.faqAnswerBox}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("faqs.lastUpdated") : "Last updated: September 2025"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
  },
  iconCircle: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 50,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B21A8',
    marginBottom: 8,
    textAlign: 'center',
  },
  breadcrumbs: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    textAlign: 'center',
  },
  contentBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  introText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  faqSection: { marginTop: 8 },
  faqItem: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  faqQuestionText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    flex: 1,
    marginRight: 10,
  },
  faqAnswerBox: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    padding: 14,
    backgroundColor: '#fff',
  },
  faqAnswer: {
    fontSize: 15,
    color: '#555',
  },
  lastUpdated: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 24,
    paddingTop: 12,
    alignItems: 'center',
  },
  lastUpdatedText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
});

export default FAQs;