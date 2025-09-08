import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/Feather'; // For LinkedIn icon
import InstagramIcon from 'react-native-vector-icons/FontAwesome'; // For Instagram icon
// import TopNavigation from '../../Components/TopNavigation/TopNavigation';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import Navbar from '../../Components/Navbar/Navbar';
import Cta from '../../Components/Cta/Cta';
import Footer from '../../Components/Footer/Footer';
import HeroSection from '../../Components/HeroSection/HeroSection';
import BottomNav from '../../Components/BottomNav/BottomNav';

const About = () => {
  const { t } = useTranslation();

  useEffect(() => {
    // You don't need scrollTo for RN unless you want to control scrollView ref
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Navbar Header */}
        <NavbarHeader />
        {/* <Navbar /> */}

        {/* Hero Section */}
        <HeroSection
          productName={t('about.pageTitle')}
          breadcrumbs={[
            { label: t('about.breadcrumb.home'), link: '/home' },
            { label: t('about.breadcrumb.about'), link: '/About' },
          ]}
        />

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.ourStory.title')}</Text>
          <Text style={styles.paragraph}>{t('about.ourStory.paragraph1')}</Text>
          <Text style={styles.paragraph}>{t('about.ourStory.paragraph2')}</Text>
          <Text style={styles.paragraph}>{t('about.ourStory.paragraph3')}</Text>
        </View>

        {/* CEO Section */}
        <View style={styles.ceoContainer}>
          <Image
            source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Avi_CEO.png?updatedAt=1749872370942' }}
            style={styles.ceoImage}
          />
          <View style={styles.socialIcons}>
            <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/in/avinashmohanty/')}>
              <Icon name="linkedin" size={24} color="#0077b5" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('#')}>
              <InstagramIcon name="instagram" size={24} color="#E4405F" />
            </TouchableOpacity>
          </View>
          <Text style={styles.ceoName}>{t('about.ceo.name')}</Text>
          <Text style={styles.ceoTitle}>{t('about.ceo.title')}</Text>
          <Text style={styles.paragraph}>{t('about.ceo.quote1')}</Text>
          <Text style={styles.paragraph}>{t('about.ceo.quote2')}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{t('about.stats.customers.number')}</Text>
            <Text style={styles.statLabel}>{t('about.stats.customers.label')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{t('about.stats.states.number')}</Text>
            <Text style={styles.statLabel}>{t('about.stats.states.label')}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{t('about.stats.satisfaction.number')}</Text>
            <Text style={styles.statLabel}>{t('about.stats.satisfaction.label')}</Text>
          </View>
        </View>

        {/* Mission Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.mission.title')}</Text>
          <Text style={styles.paragraph}>{t('about.mission.description')}</Text>
          <Text style={styles.paragraph}>• {t('about.mission.point1')}</Text>
          <Text style={styles.paragraph}>• {t('about.mission.point2')}</Text>
          <Text style={styles.paragraph}>• {t('about.mission.point3')}</Text>
        </View>

        {/* Future Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('about.future.title')}</Text>
          <Text style={styles.paragraph}>{t('about.future.description')}</Text>
        </View>

        {/* CTA & Footer */}
        <Cta />
        <Footer paddingBottom={60} />
      </ScrollView>

      {/* Fixed Bottom Nav */}
      <BottomNav />
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { paddingBottom: 70 },
  section: { padding: 16, backgroundColor: '#fff' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  paragraph: { fontSize: 16, color: '#555', marginBottom: 8 },
  ceoContainer: { alignItems: 'center', padding: 16 },
  ceoImage: { width: 200, height: 200, borderRadius: 12, marginBottom: 8 },
  socialIcons: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  ceoName: { fontSize: 22, fontWeight: 'bold', color: '#111', marginTop: 8 },
  ceoTitle: { fontSize: 18, color: '#6b21a8', marginBottom: 8 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', padding: 16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ddd' },
  statBox: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#6b21a8' },
  statLabel: { fontSize: 14, color: '#555' },
});
