import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

// Dummy translation function. Replace with your i18n.
const t = (key) => {
  const dict = {
    "banner.main.crafting.title": "Crafting Excellence",
    "banner.main.crafting.desc": "Discover premium yarns for every project.",
    "banner.main.premium.title": "Premium Quality",
    "banner.main.premium.desc": "Only the finest threads for your creations.",
    "banner.main.softness.title": "Unmatched Softness",
    "banner.main.softness.desc": "Feel the difference in every touch.",
    "banner.main.vibrant.title": "Vibrant Colors",
    "banner.main.vibrant.desc": "A spectrum of shades for your imagination.",
    "banner.main.threads.title": "Strong Threads",
    "banner.main.threads.desc": "Durable and reliable for all uses.",
    "banner.side.excellence.title": "Trusted by Artisans",
    "banner.side.excellence.desc": "Our yarns are loved by professionals.",
    "banner.side.quality.title": "Quality Assured",
    "banner.side.quality.desc": "Every batch tested for perfection.",
  };
  return dict[key] || key;
};

// Dummy navigation function. Replace with your navigation.
const navigateToCategory = () => {
  // navigation.navigate('Category');
  alert('Navigate to Category');
};

const ShopButton = ({ onPress }) => (
  <TouchableOpacity style={styles.shopBtn} onPress={onPress}>
    <Text style={styles.shopBtnText}>Shop Now</Text>
  </TouchableOpacity>
);

const mainBannerItems = [
  {
    titleKey: "banner.main.crafting.title",
    descKey: "banner.main.crafting.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Elegant%20Cinematic%20Webnail%20HD%20169.png?updatedAt=1753180559241"
  },
  {
    titleKey: "banner.main.premium.title",
    descKey: "banner.main.premium.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Elegant%20Cinematic%20Wedding%20Thumbnail%20HD%20169.png?updatedAt=1753180559200"
  },
  {
    titleKey: "banner.main.softness.title",
    descKey: "banner.main.softness.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/Elegant%20Cinematic%20Weail%20HD%20169.png?updatedAt=1753180558597"
  },
  {
    titleKey: "banner.main.vibrant.title",
    descKey: "banner.main.vibrant.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/banner4.png?updatedAt=1751355597212"
  },
  {
    titleKey: "banner.main.threads.title",
    descKey: "banner.main.threads.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/banner-1.png?updatedAt=1753180558990"
  }
];

const bannerItems = [
  {
    titleKey: "banner.side.excellence.title",
    descKey: "banner.side.excellence.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/banner-2.png?updatedAt=1753180558990"
  },
  {
    titleKey: "banner.side.quality.title",
    descKey: "banner.side.quality.desc",
    img: "https://ik.imagekit.io/mediadata/Mo%20Ink%20n%20Dyes/banner-3.png?updatedAt=1753180558990"
  }
];

const Banner = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Main Banner Swiper */}
      <View style={styles.mainBannerSection}>
        <Swiper
          autoplay
          autoplayTimeout={2}
          showsPagination
          height={220}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          {mainBannerItems.map((item, idx) => (
            <ImageBackground
              key={idx}
              source={{ uri: item.img }}
              style={styles.bannerImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{t(item.titleKey)}</Text>
                <Text style={styles.bannerDesc}>{t(item.descKey)}</Text>
                <ShopButton onPress={navigateToCategory} />
              </View>
            </ImageBackground>
          ))}
        </Swiper>
      </View>

      {/* Side Banner Swiper */}
      <View style={styles.sideBannerSection}>
        <Swiper
          autoplay
          autoplayTimeout={30}
          showsPagination
          height={180}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          {bannerItems.map((item, idx) => (
            <ImageBackground
              key={idx}
              source={{ uri: item.img }}
              style={styles.sideBannerImage}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.bannerOverlay}>
                <Text style={styles.bannerTitle}>{t(item.titleKey)}</Text>
                <Text style={styles.bannerDesc}>{t(item.descKey)}</Text>
                <ShopButton onPress={navigateToCategory} />
              </View>
            </ImageBackground>
          ))}
        </Swiper>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  mainBannerSection: {
    width: '100%',
    height: 220,
    marginTop: 12,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  bannerImage: {
    width: width - 32,
    height: 220,
    justifyContent: 'flex-end',
    padding: 24,
    borderRadius: 16,
  },
  bannerOverlay: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6D28D9',
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 15,
    color: '#222',
    marginBottom: 12,
  },
  shopBtn: {
    backgroundColor: '#6D28D9',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
  },
  shopBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dot: {
    backgroundColor: '#ddd',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#6D28D9',
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 2,
  },
  sideBannerSection: {
    width: '100%',
    height: 180,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sideBannerImage: {
    width: width - 32,
    height: 180,
    justifyContent: 'flex-end',
    padding: 24,
    borderRadius: 16,
  },
});

export default Banner;