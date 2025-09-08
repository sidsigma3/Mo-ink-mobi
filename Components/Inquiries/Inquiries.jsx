import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
  Platform,
  Dimensions
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

const Inquiries = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '', company: '', interest: '', email: '',
    designation: '', phoneNumber: '', location: '', message: ''
  });
  const [loading, setLoading] = useState(false);
  const [MapView, setMapView] = useState(null);
  const [Marker, setMarker] = useState(null);

  const locationCoords = {
    latitude: 20.28791285719732,
    longitude: 85.80958984305737,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
  if (Platform.OS !== 'web') {
    import('react-native-maps').then((module) => {
      const Map = module.default;
      const { Marker } = module;
      setMapView(() => Map);
      setMarker(() => Marker);
    });
  }
}, []);


  const sendEmail = async () => {
    const { name, company, interest, email, designation, phoneNumber, location, message } = formData;
    if (!name || !company || !interest || !email || !designation || !phoneNumber || !location || !message) {
      Alert.alert(t('inquiries.validation'));
      return;
    }

    try {
      setLoading(true);
      setTimeout(() => {
        Alert.alert(t('inquiries.success'));
        setFormData({
          name: '', company: '', interest: '', email: '',
          designation: '', phoneNumber: '', location: '', message: ''
        });
        setLoading(false);
      }, 2000);
    } catch (err) {
      Alert.alert(t('inquiries.error'));
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {t('inquiries.title')} <Text style={styles.highlight}>{t('inquiries.highlight')}</Text>
      </Text>

      <View style={styles.inputGroup}>
        {/* Input Fields */}
        {['name', 'company', 'interest', 'email', 'designation', 'phoneNumber', 'location', 'message'].map((field) => (
          <TextInput
            key={field}
            placeholder={t(`inquiries.${field}`)}
            style={[styles.input, field === 'message' && styles.textArea]}
            keyboardType={field === 'email' ? 'email-address' : field === 'phoneNumber' ? 'phone-pad' : 'default'}
            multiline={field === 'message'}
            numberOfLines={field === 'message' ? 4 : 1}
            value={formData[field]}
            onChangeText={(text) => setFormData({ ...formData, [field]: text })}
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={sendEmail} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? t('inquiries.sending') : t('inquiries.send')}</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Info */}
      <View style={styles.contactRow}>
        <Feather name="phone-call" size={28} color="purple" />
        <View style={styles.contactText}>
          <Text style={styles.label}>{t('inquiries.phoneLabel')}</Text>
          <Text style={styles.value} onPress={() => Linking.openURL('tel:7406944477')}>74069 44477</Text>
        </View>
      </View>

      <View style={styles.contactRow}>
        <MaterialCommunityIcons name="whatsapp" size={28} color="green" />
        <View style={styles.contactText}>
          <Text style={styles.label}>WhatsApp</Text>
          <Text style={styles.value} onPress={() => Linking.openURL('https://wa.me/917406944477')}>74069 44477</Text>
        </View>
      </View>

      <View style={styles.contactRow}>
        <MaterialCommunityIcons name="email-outline" size={28} color="black" />
        <View style={styles.contactText}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value} onPress={() => Linking.openURL('mailto:support@inkndyes.com')}>support@inkndyes.com</Text>
        </View>
      </View>

      {/* Map or fallback image */}
      <View style={styles.mapContainer}>
        {Platform.OS === 'web' ? (
          <Image
            source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/MainMap.png?updatedAt=1746636596949' }}
            style={styles.mapImage}
            resizeMode="contain"
          />
        ) : (
          MapView && Marker && (
            <MapView style={styles.map} initialRegion={locationCoords}>
              <Marker coordinate={locationCoords} title={t('inquiries.mapPopup')} />
            </MapView>
          )
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center' },
  highlight: { color: 'purple' },
  inputGroup: { marginTop: 16 },
  input: { borderColor: '#ccc', borderWidth: 1, padding: 10, borderRadius: 6, marginBottom: 12 },
  textArea: { height: 100 },
  button: { backgroundColor: 'purple', padding: 12, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: 'white', fontWeight: '600' },
  contactRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  contactText: { marginLeft: 12 },
  label: { fontWeight: 'bold', fontSize: 14 },
  value: { color: 'purple', fontWeight: '500', fontSize: 14 },
  mapContainer: { height: 200, marginTop: 20, borderRadius: 12, overflow: 'hidden' },
  map: { flex: 1 },
  mapImage: { width: width - 32, height: 200, borderRadius: 12 },
});

export default Inquiries;
