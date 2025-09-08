import React from 'react';
import { ScrollView, View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReturnInfo = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.heroSection}>
        <View style={styles.iconCircle}>
          <Icon name="shield-outline" size={45} color="#6B21A8" />
        </View>
        <Text style={styles.heroTitle}>Returns & Replacements</Text>
        <Text style={styles.heroSubtitle}>
          At Ink n Dyes, we strive to deliver the best quality yarns and dyeing services. However, if something doesn’t meet your expectations, we’re here to make it right.
        </Text>
      </View>

      <View style={styles.contentBox}>
        <SectionTitle title="Return Eligibility" />
        <Text style={styles.sectionContent}>You may request a return or replacement if:</Text>
        <BulletList items={[
          "You received a damaged or defective product",
          "The product does not match your order (wrong type, size, or color)",
          "There are inconsistencies in dyeing (verified through our quality assurance process)"
        ]} />

        <SectionTitle title="Return Conditions:" />
        <BulletList items={[
          "Returns must be requested within 7 days of delivery",
          "Products must be unused, in their original packaging",
          "Custom-dyed or specially processed items may not be eligible unless defective"
        ]} />

        <SectionTitle title="How to Request a Return:" />
        <NumberedList items={[
          "Log in to your Ink n Dyes account",
          "Go to \"My Orders\" and select the relevant order",
          "Click \"Request Return/Replacement\" and provide details with supporting photos",
          "Our team will review your request and arrange for pickup if approved"
        ]} />

        <SectionTitle title="Refunds & Replacements:" />
        <BulletList items={[
          "Approved returns will be processed within 5–7 business days",
          "Refunds are issued to the original payment method or as store credit",
          "Replacements are shipped free of cost after inspection and approval"
        ]} />

        <SectionTitle title="Non-Returnable Items:" />
        <BulletList items={[
          "Yarn already used or cut",
          "Custom-dyed batches unless quality issues are found",
          "Items returned without prior approval"
        ]} />

        <SectionTitle title="Need Help?" />
        <View style={styles.helpBox}>
          <Text style={styles.helpText}>
            <Text style={styles.bold}>Phone/WhatsApp:</Text> [Your Support Number]
          </Text>
          <Text style={styles.helpText}>
            <Text style={styles.bold}>Email:</Text>{' '}
            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@inkndyes.com')}>
              <Text style={styles.email}>support@inkndyes.com</Text>
            </TouchableOpacity>
          </Text>
        </View>

        <View style={styles.lastUpdated}>
          <Text style={styles.lastUpdatedText}>Last updated: April 2025</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const BulletList = ({ items }) => (
  <View style={styles.list}>
    {items.map((item, idx) => (
      <Text key={idx} style={styles.listItem}>• {item}</Text>
    ))}
  </View>
);

const NumberedList = ({ items }) => (
  <View style={styles.list}>
    {items.map((item, idx) => (
      <Text key={idx} style={styles.listItem}>{idx + 1}. {item}</Text>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
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
  heroSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  contentBox: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 6,
    marginTop: 18,
  },
  sectionContent: {
    fontSize: 15,
    color: '#555',
    marginBottom: 8,
  },
  list: { marginLeft: 12, marginBottom: 8 },
  listItem: { fontSize: 15, color: '#555', marginBottom: 4 },
  helpBox: { marginTop: 8, marginBottom: 8 },
  helpText: { fontSize: 15, color: '#555', marginBottom: 4 },
  bold: { fontWeight: 'bold', color: '#222' },
  email: { color: '#2563EB', fontWeight: 'bold' },
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

export default ReturnInfo;