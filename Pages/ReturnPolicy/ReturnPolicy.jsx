import React from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReturnPolicy = ({ t }) => {
  // Replace t('...') with your translation function or static text
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>{t ? t("returnPolicy.heroTitle") : "Return Policy"}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{t ? t("returnPolicy.title") : "Our Return Policy"}</Text>
        <Text style={styles.intro}>{t ? t("returnPolicy.introduction") : "Please read our return policy below."}</Text>

        {/* Policy Sections */}
        <View style={styles.sections}>
          <Section
            title={t ? t("returnPolicy.section1.title") : "Eligibility for Returns"}
            content={t ? t("returnPolicy.section1.content") : "Returns are available under certain conditions..."}
          />
          <Section
            title={t ? t("returnPolicy.section2.title") : "Return Process"}
            content={t ? t("returnPolicy.section2.content") : "To request a return, contact our support team..."}
            points={[
              t ? t("returnPolicy.section2.point1") : "Item must be unused.",
              t ? t("returnPolicy.section2.point2") : "Return request within 7 days.",
              t ? t("returnPolicy.section2.point3") : "Original packaging required.",
              t ? t("returnPolicy.section2.point4") : "Proof of purchase needed.",
            ]}
          />
          <Section
            title={t ? t("returnPolicy.section3.title") : "Timeframe for Returns"}
            content={t ? t("returnPolicy.section3.content") : "Returns are processed within 7-10 business days..."}
          />
          <Section
            title={t ? t("returnPolicy.section4.title") : "Non-Returnable Items"}
            content={t ? t("returnPolicy.section4.content") : "Some items are not eligible for returns..."}
            points={[
              t ? t("returnPolicy.section4.point1") : "Opened products.",
              t ? t("returnPolicy.section4.point2") : "Custom orders.",
              t ? t("returnPolicy.section4.point3") : "Gift cards.",
            ]}
          />
          <Section
            title={t ? t("returnPolicy.section5.title") : "Partial Returns"}
            content={t ? t("returnPolicy.section5.content") : "Partial returns may be granted in certain cases..."}
          />
          <Section
            title={t ? t("returnPolicy.section6.title") : "Contact Us"}
            content={t ? t("returnPolicy.section6.content") : "For more information, contact us at:"}
            email={t ? t("returnPolicy.section6.email") : "support@inkndyes.com"}
          />
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("returnPolicy.lastUpdated") : "Last updated: September 2025"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ title, content, points, email }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
    {points && points.length > 0 && (
      <View style={styles.pointsList}>
        {points.map((point, idx) => (
          <Text key={idx} style={styles.pointItem}>• {point}</Text>
        ))}
      </View>
    )}
    {email && (
      <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
        <Text style={styles.email}>{email}</Text>
      </TouchableOpacity>
    )}
  </View>
);

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
  contentBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  intro: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  sections: { marginTop: 8 },
  section: { marginBottom: 18 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
  },
  sectionContent: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  pointsList: { marginLeft: 12, marginBottom: 4 },
  pointItem: { fontSize: 15, color: '#555', marginBottom: 2 },
  email: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: 'bold',
    marginTop: 6,
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

export default ReturnPolicy;