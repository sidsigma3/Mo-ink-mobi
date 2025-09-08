import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PrivacyPolicy = ({ t }) => {
  // Replace t('...') with your translation function or static text
  const breadcrumbs = [
    { label: t ? t("privacyPolicy.breadcrumb.home") : "Home", link: "/home" },
    { label: t ? t("privacyPolicy.breadcrumb.privacyPolicy") : "Privacy Policy", link: "/privacyPolicy" },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>
          {t ? t("privacyPolicy.heroTitle") : "Privacy Policy"}
        </Text>
        <Text style={styles.breadcrumbs}>
          {breadcrumbs.map(b => b.label).join(' > ')}
        </Text>
      </View>

      <View style={styles.contentBox}>
        <View style={styles.introSection}>
          <Text style={styles.mainTitle}>
            {t ? t("privacyPolicy.title") : "Privacy Policy"}
          </Text>
          <Text style={styles.introText}>
            {t ? t("privacyPolicy.introduction") : "Please read our privacy policy below."}
          </Text>
        </View>

        <View style={styles.sections}>
          <PolicySection
            title={t ? t("privacyPolicy.section1.title") : "Section 1"}
            content={t ? t("privacyPolicy.section1.content") : "Section 1 content goes here."}
            points={[
              t ? `${t("privacyPolicy.section1.point1.label")} ${t("privacyPolicy.section1.point1.description")}` : "Point 1",
              t ? `${t("privacyPolicy.section1.point2.label")} ${t("privacyPolicy.section1.point2.description")}` : "Point 2",
              t ? `${t("privacyPolicy.section1.point3.label")} ${t("privacyPolicy.section1.point3.description")}` : "Point 3",
              t ? `${t("privacyPolicy.section1.point4.label")} ${t("privacyPolicy.section1.point4.description")}` : "Point 4",
            ]}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section2.title") : "Section 2"}
            points={[
              t ? t("privacyPolicy.section2.point1") : "Point 1",
              t ? t("privacyPolicy.section2.point2") : "Point 2",
              t ? t("privacyPolicy.section2.point3") : "Point 3",
              t ? t("privacyPolicy.section2.point4") : "Point 4",
              t ? t("privacyPolicy.section2.point5") : "Point 5",
              t ? t("privacyPolicy.section2.point6") : "Point 6",
              t ? t("privacyPolicy.section2.point7") : "Point 7",
            ]}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section3.title") : "Section 3"}
            content={t ? t("privacyPolicy.section3.content") : "Section 3 content goes here."}
            points={[
              t ? t("privacyPolicy.section3.point1") : "Point 1",
              t ? t("privacyPolicy.section3.point2") : "Point 2",
              t ? t("privacyPolicy.section3.point3") : "Point 3",
              t ? t("privacyPolicy.section3.point4") : "Point 4",
              t ? t("privacyPolicy.section3.point5") : "Point 5",
            ]}
            conclusion={t ? t("privacyPolicy.section3.conclusion") : undefined}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section4.title") : "Section 4"}
            content={t ? t("privacyPolicy.section4.content") : "Section 4 content goes here."}
            points={[
              t ? t("privacyPolicy.section4.point1") : "Point 1",
              t ? t("privacyPolicy.section4.point2") : "Point 2",
              t ? t("privacyPolicy.section4.point3") : "Point 3",
              t ? t("privacyPolicy.section4.point4") : "Point 4",
            ]}
            conclusion={t ? t("privacyPolicy.section4.conclusion") : undefined}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section5.title") : "Section 5"}
            content={t ? t("privacyPolicy.section5.content") : "Section 5 content goes here."}
            points={[
              t ? t("privacyPolicy.section5.point1") : "Point 1",
              t ? t("privacyPolicy.section5.point2") : "Point 2",
              t ? t("privacyPolicy.section5.point3") : "Point 3",
              t ? t("privacyPolicy.section5.point4") : "Point 4",
            ]}
            conclusion={t ? t("privacyPolicy.section5.conclusion") : undefined}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section6.title") : "Section 6"}
            content={t ? t("privacyPolicy.section6.content") : "Section 6 content goes here."}
            points={[
              t ? t("privacyPolicy.section6.point1") : "Point 1",
              t ? t("privacyPolicy.section6.point2") : "Point 2",
              t ? t("privacyPolicy.section6.point3") : "Point 3",
              t ? t("privacyPolicy.section6.point4") : "Point 4",
              t ? t("privacyPolicy.section6.point5") : "Point 5",
            ]}
            conclusion={t ? t("privacyPolicy.section6.conclusion") : undefined}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section7.title") : "Section 7"}
            points={[
              t ? t("privacyPolicy.section7.point1") : "Point 1",
              t ? t("privacyPolicy.section7.point2") : "Point 2",
              t ? t("privacyPolicy.section7.point3") : "Point 3",
            ]}
          />
          <PolicySection
            title={t ? t("privacyPolicy.section8.title") : "Section 8"}
            content={t ? t("privacyPolicy.section8.content") : "Section 8 content goes here."}
          />
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("privacyPolicy.lastUpdated") : "Last updated: September 2025"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const PolicySection = ({ title, content, points, conclusion }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {content ? <Text style={styles.sectionContent}>{content}</Text> : null}
    {points && points.length > 0 && (
      <View style={styles.pointsList}>
        {points.map((point, idx) => (
          <Text key={idx} style={styles.pointItem}>• {point}</Text>
        ))}
      </View>
    )}
    {conclusion ? <Text style={styles.sectionContent}>{conclusion}</Text> : null}
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
  pointsList: { marginLeft: 12, marginBottom: 4 },
  pointItem: { fontSize: 15, color: '#555', marginBottom: 2 },
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

export default PrivacyPolicy;