import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
// import { FcCheckmark } from "react-icons/fc"; 

const CtaCard = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <ScrollView horizontal contentContainerStyle={styles.container}>
      
      {/* Card 1 */}
      <View style={[styles.card, { backgroundColor: '#d1fae5' }]}>
        <Text style={styles.title}>{t('cta.card1.title')}</Text>
        <View style={styles.list}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Text key={num} style={styles.listItem}>
              ✅ {t(`cta.card1.point${num}`)}
            </Text>
          ))}
        </View>
        <Image
          source={{uri:'../../assets/Images/cta-wool-2.png'}}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Card 2 */}
      <View style={[styles.card, { backgroundColor: '#e9d5ff' }]}>
        <Text style={styles.title}>{t('cta.card2.title')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('KnowMore')}
        >
          <Text style={styles.buttonText}>{t('cta.learnMore')} ➡️</Text>
        </TouchableOpacity>
        <Image
          source={{uri:'../../assets/Images/cta-wool.png'}}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

      {/* Card 3 */}
      <View style={[styles.card, { backgroundColor: '#fef3c7' }]}>
        <Text style={styles.title}>{t('cta.card3.title')}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('KnowMore')}
        >
          <Text style={styles.buttonText}>{t('cta.learnMore')} ➡️</Text>
        </TouchableOpacity>
        <Image
          source={{uri:'../../assets/Images/cta-wool-2.png'}}
          style={styles.cardImage}
          resizeMode="contain"
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    gap: 16,
    flexDirection: 'column',
    paddingVertical: 10,
    width:'100%'
  },
  card: {
    width: '100%',
    height: 230,
    borderRadius: 12,
    padding: 16,
    position: 'relative',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  list: {
    marginTop: 10,
  },
  listItem: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 2,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },
  cardImage: {
    position: 'absolute',
    width: 100,
    height: 100,
    bottom: 0,
    right: 0,
  },
});

export default CtaCard;
