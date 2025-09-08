import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ShippingPolicy = ({ t }) => {
  // Replace t('...') with your translation function or static text
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>{t ? t("shippingPolicy.heroTitle") : "Shipping Policy"}</Text>
      </View>

      <View style={styles.contentBox}>
        <Text style={styles.title}>{t ? t("shippingPolicy.title") : "Our Shipping Policy"}</Text>
        <Text style={styles.intro}>{t ? t("shippingPolicy.introduction") : "Please read our shipping policy below."}</Text>

        {/* Policy Sections */}
        <View style={styles.sections}>
          {[...Array(13)].map((_, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={styles.sectionTitle}>
                {t ? t(`shippingPolicy.section${idx + 1}.title`) : `Section ${idx + 1}`}
              </Text>
              <Text style={styles.sectionContent}>
                {t ? t(`shippingPolicy.section${idx + 1}.content`) : `Section ${idx + 1} content goes here.`}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>
            {t ? t("shippingPolicy.lastUpdated") : "Last updated: September 2025"}
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

export default ShippingPolicy;