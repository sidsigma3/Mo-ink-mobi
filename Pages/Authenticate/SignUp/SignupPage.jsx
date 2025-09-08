import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Platform
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const SignupPage = ({ togglePage }) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [toasts, setToasts] = useState([]);
  const [isVerifying, setIsVerifying] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsappNumber: '',
    email: '',
    password: '',
    gstNumber: '',
    company: '',
    gstVerified: null,
    hasGst: false,
  });

  const showToast = (message) => Alert.alert(t('error'), message);

  useEffect(() => {
    const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    const validateGST = async () => {
      setIsVerifying(true);
      try {
        const response = await fetch("https://api.bulkpe.in/client/verifyGstin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer YOUR_API_KEY",
          },
          body: JSON.stringify({
            gstin: formData.gstNumber,
            reference: `REF-${Date.now()}`,
          }),
        });

        const data = await response.json();

        if (data.statusCode === 200) {
          setFormData((prev) => ({
            ...prev,
            gstVerified: true,
            company: data.data?.lgnm || "",
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            gstVerified: false,
          }));
        }
      } catch (err) {
        setFormData((prev) => ({
          ...prev,
          gstVerified: false,
        }));
      } finally {
        setIsVerifying(false);
      }
    };

    if (formData.gstNumber.length === 15) {
      if (GST_REGEX.test(formData.gstNumber.toUpperCase())) {
        validateGST();
      } else {
        setFormData((prev) => ({
          ...prev,
          gstVerified: false,
          company: "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        gstVerified: null,
        company: "",
      }));
    }
  }, [formData.gstNumber]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGstCheckbox = () => {
    setFormData((prev) => ({
      ...prev,
      hasGst: !prev.hasGst,
      gstNumber: !prev.hasGst ? "" : prev.gstNumber,
    }));
  };

  const handleSubmit = async () => {
    const requiredFields = [
      formData.firstName,
      formData.lastName,
      formData.phoneNumber,
      formData.email,
      formData.password,
      formData.company,
    ];

    if (requiredFields.some((field) => !field || field.trim() === "")) {
      showToast("Please fill in all required fields.");
      return;
    }

    // Simulate navigation
    navigation.navigate("Otp", { customerData: formData });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{ uri: 'https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/dddepth-198.jpg' }}
        style={styles.backgroundImage}
        blurRadius={3}
      />

      <View style={styles.logoContainer}>
        <Image source={{uri:'../../../assets/Images/logo.png'}} style={styles.logo} />
      </View>

      <View style={styles.formBox}>
        <Text style={styles.title}>{t('signup.welcomeTitle')}</Text>

        <View style={styles.tabSwitch}>
          <TouchableOpacity style={styles.inactiveTab} onPress={togglePage}>
            <Text style={styles.inactiveTabText}>{t('signup.login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.activeTabText}>{t('signup.register')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder={t('signup.firstName')}
            value={formData.firstName}
            onChangeText={(text) => handleChange('firstName', text)}
            style={styles.input}
          />
          <TextInput
            placeholder={t('signup.lastName')}
            value={formData.lastName}
            onChangeText={(text) => handleChange('lastName', text)}
            style={styles.input}
          />
        </View>

        <TextInput
          placeholder={t('signup.email')}
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          style={styles.input}
        />

        <TextInput
          placeholder={t('signup.gstNumber')}
          value={formData.gstNumber}
          onChangeText={(text) => handleChange('gstNumber', text)}
          editable={formData.hasGst}
          style={styles.input}
          maxLength={15}
        />

        <View style={styles.row}>
          <TextInput
            placeholder={t('signup.phoneNumber')}
            value={formData.phoneNumber}
            onChangeText={(text) => handleChange('phoneNumber', text)}
            style={styles.input}
          />
          <TextInput
            placeholder={t('signup.whatsappNumber')}
            value={formData.whatsappNumber}
            onChangeText={(text) => handleChange('whatsappNumber', text)}
            style={styles.input}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            placeholder={t('signup.password')}
            value={formData.password}
            onChangeText={(text) => handleChange('password', text)}
            secureTextEntry
            style={styles.input}
          />
          <TextInput
            placeholder={t('signup.company')}
            value={formData.company}
            onChangeText={(text) => handleChange('company', text)}
            style={styles.input}
          />
        </View>

        <View style={styles.checkboxRow}>
          <TouchableOpacity onPress={handleGstCheckbox}>
            <Text>{formData.hasGst ? '☑️' : '⬜️'} {t('signup.noGst')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>{t('signup.getOtp')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default SignupPage;

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    height:'100%',
    width:'100%',
    backgroundColor: '#fff',
    // padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  logoContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    left: 20,
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  formBox: {
  // backgroundColor: 'rgba(255,255,255,0.9)', 
  padding: 24,
  width: '90%',
  borderRadius: 20, 
  borderColor: '#ffffff',
  borderWidth: 2,
  alignSelf: 'center', 
  // marginTop: 20, 
},
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabSwitch: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
  },
  activeTab: {
    flex: 1,
    backgroundColor: '#6b21a8',
    paddingVertical: 10,
    alignItems: 'center',
  },
  inactiveTab: {
    flex: 1,
    borderColor: '#6b21a8',
    borderWidth: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  inactiveTabText: {
    color: '#6b21a8',
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#6b21a8',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    flexGrow:1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  checkboxRow: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#6b21a8',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
