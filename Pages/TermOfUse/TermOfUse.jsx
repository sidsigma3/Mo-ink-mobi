import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TermOfUse = ({ t }) => {
  // Replace t('...') with your translation function or static text
  const breadcrumbs = [
    { label: t ? t("termsOfUse.breadcrumb.home") : "Home", link: "/home" },
    { label: t ? t("termsOfUse.breadcrumb.terms") : "Terms of Use", link: "/termsofuse" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>
          {t ? t("termsOfUse.pageTitle") : "Terms of Use"}
        </Text>
        <Text style={styles.breadcrumbs}>
          {breadcrumbs.map(b => b.label).join(' > ')}
        </Text>
      </View>

      <View style={styles.contentBox}>
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>
            {t ? t("termsOfUse.mainTitle") : "Terms and Conditions"}
          </Text>
          <Text style={styles.introText}>
            {t ? t("termsOfUse.introduction") : "Please read our terms of use below."}
          </Text>
        </View>

        <View style={styles.sections}>
          <Section
            title={t ? t("termsOfUse.section1.title") : "Section 1"}
            content={t ? t("termsOfUse.section1.content") : "Section 1 content goes here."}
          />
          <Section
            title={t ? t("termsOfUse.section2.title") : "Section 2"}
            content={t ? t("termsOfUse.section2.content") : "Section 2 content goes here."}
          />
          <Section
            title={t ? t("termsOfUse.section3.title") : "Section 3"}
            content={t ? t("termsOfUse.section3.content") : "Section 3 content goes here."}
          />
          <Section
            title={t ? t("termsOfUse.section4.title") : "Section 4"}
            content={t ? t("termsOfUse.section4.content") : "Section 4 content goes here."}
          />
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("termsOfUse.lastUpdated") : "Last updated: September 2025"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const Section = ({ title, content }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.sectionContent}>{content}</Text>
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
  introSection: {
    marginBottom: 24,
    alignItems: 'center',
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

export default TermOfUse;