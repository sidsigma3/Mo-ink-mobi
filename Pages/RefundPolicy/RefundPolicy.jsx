import React from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const RefundPolicy = ({ t }) => {
  // Replace t('...') with your translation function or static text
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>{t ? t("refundPolicy.heroTitle") : "Refund Policy"}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{t ? t("refundPolicy.title") : "Our Refund Policy"}</Text>
        <Text style={styles.intro}>{t ? t("refundPolicy.introduction") : "We value your satisfaction. Please read our refund policy below."}</Text>

        {/* Policy Sections */}
        <View style={styles.sections}>
          <Section
            title={t ? t("refundPolicy.section1.title") : "Eligibility for Refunds"}
            content={t ? t("refundPolicy.section1.content") : "Refunds are available under certain conditions..."}
          />
          <Section
            title={t ? t("refundPolicy.section2.title") : "Refund Process"}
            content={t ? t("refundPolicy.section2.content") : "To request a refund, contact our support team..."}
            additionalInfo={t ? t("refundPolicy.section2.additionalInfo") : undefined}
          />
          <Section
            title={t ? t("refundPolicy.section3.title") : "Timeframe for Refunds"}
            content={t ? t("refundPolicy.section3.content") : "Refunds are processed within 7-10 business days..."}
          />
          <Section
            title={t ? t("refundPolicy.section4.title") : "Non-Refundable Items"}
            content={t ? t("refundPolicy.section4.content") : "Some items are not eligible for refunds..."}
          />
          <Section
            title={t ? t("refundPolicy.section5.title") : "Partial Refunds"}
            content={t ? t("refundPolicy.section5.content") : "Partial refunds may be granted in certain cases..."}
          />
          <Section
            title={t ? t("refundPolicy.section6.title") : "Late or Missing Refunds"}
            content={t ? t("refundPolicy.section6.content") : "If you haven’t received a refund yet..."}
          />
          <Section
            title={t ? t("refundPolicy.section7.title") : "Exchanges"}
            content={t ? t("refundPolicy.section7.content") : "We only replace items if they are defective or damaged..."}
          />
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t ? t("refundPolicy.section8.title") : "Contact Us"}</Text>
            <Text style={styles.sectionContent}>{t ? t("refundPolicy.section8.content") : "For more information, contact us at:"}</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@inkndyes.com')}>
              <Text style={styles.email}>{t ? t("refundPolicy.section8.email") : "support@inkndyes.com"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("refundPolicy.lastUpdated") : "Last updated: September 2025"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ title, content, additionalInfo }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
    {additionalInfo ? <Text style={styles.sectionContent}>{additionalInfo}</Text> : null}
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

export default RefundPolicy;