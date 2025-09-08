import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Footer() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo & Tagline */}
      <View style={styles.logoContainer}>
        <Image
          source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/image%202.png?updatedAt=1746846159615' }}
          style={styles.logo}
        />
        <Text style={styles.tagline}>{t('footer.tagline')}</Text>

        {/* Social Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/yourpage')}>
            <FontAwesome name="facebook" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/yourpage')}>
            <FontAwesome name="instagram" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/yourpage')}>
            <FontAwesome name="twitter" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.linkedin.com/company/inkndyes')}>
            <FontAwesome name="linkedin" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.columns}>
        <View style={styles.column}>
          <Text style={styles.colTitle}>{t('footer.helpfulLinks')}</Text>
          {['contact', 'faq', 'terms'].map((key) => (
            <TouchableOpacity key={key} onPress={() => navigation.navigate(capitalize(key))}>
              <Text style={styles.link}>{t(`footer.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.colTitle}>{t('footer.policy')}</Text>
          {['return', 'refund', 'shipping', 'privacy'].map((key) => (
            <TouchableOpacity key={key} onPress={() => navigation.navigate(capitalize(key + 'Policy'))}>
              <Text style={styles.link}>{t(`footer.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    
      {/* <View style={styles.downloadSection}>
        <Text style={styles.colTitle}>{t('footer.downloadApp')}</Text>
        <Text style={styles.text}>{t('footer.bestExperience')}</Text>
        <View style={styles.downloadRow}>
          <Image source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/playstore.png' }} style={styles.storeImg} />
          <Image source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/appstore.png' }} style={styles.storeImg} />
        </View>
      </View>

   
      <View style={styles.assuranceSection}>
        <Text style={styles.colTitle}>{t('footer.assuranceTitle')}</Text>
        {['original', 'return', 'secure'].map((key) => (
          <View key={key} style={styles.assuranceRow}>
            <Image
              source={{ uri: getAssuranceIconUri(key) }}
              style={styles.assuranceImg}
            />
            <View>
              <Text style={styles.assuranceTitle}>{t(`footer.${key}`)}</Text>
              <Text style={styles.assuranceText}>{t(`footer.${key}Text`)}</Text>
            </View>
          </View>
        ))} 
      </View> */}

      {/* Bottom Text */}
      <Text style={styles.footerText}>{t('footer.madeWithLove')}</Text>
      <Text style={styles.subText}>{t('footer.copyright')}</Text>
    </ScrollView>
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getAssuranceIconUri(key) {
  const map = {
    original: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/original-icon.png',
    return: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/return-icon.png',
    secure: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/secure-icon.png',
  };
  return map[key];
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 80, height: 80, marginBottom: 8 },
  tagline: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  socialRow: { flexDirection: 'row', marginTop: 12, justifyContent: 'center', gap: 16 },
  columns: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24 },
  column: { flex: 1, marginHorizontal: 8 },
  colTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  link: { fontSize: 14, color: '#374151', marginBottom: 6 },
  downloadSection: { alignItems: 'center', marginTop: 24 },
  text: { fontSize: 14, color: '#6b7280', marginVertical: 8, textAlign: 'center' },
  downloadRow: { flexDirection: 'row', gap: 16 },
  storeImg: { width: 100, height: 32, marginHorizontal: 8 },
  assuranceSection: { marginTop: 24 },
  assuranceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 12 },
  assuranceImg: { width: 40, height: 40, marginRight: 12 },
  assuranceTitle: { fontSize: 14, fontWeight: '600' },
  assuranceText: { fontSize: 12, color: '#6b7280' },
  footerText: { fontSize: 14, color: '#374151', marginTop: 24, textAlign: 'center' },
  subText: { fontSize: 12, color: '#9ca3af', textAlign: 'center', marginTop: 4 },
});
