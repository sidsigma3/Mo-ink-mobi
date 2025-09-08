import React from 'react';
import { View, StyleSheet , ScrollView , FlatList} from 'react-native';
import MainHeader from '../../Components/MainHeader/MainHeader';
import MainHero from '../../Components/MainHero/MainHero';
import MainFeatures from '../../Components/MainFeatures/MainFeatures';
import MainWhyUs from '../../Components/MainWhyUs/MainWhyUs';
import MainBestsellers from '../../Components/MainBestSeller/MainBestSellers';
import MainColors from '../../Components/MainColors/MainColors';
import MainCone from '../../Components/MainCone/MainCone';
import MainProcess from '../../Components/MainProcess/MainProcess';
import MainMarketing from '../../Components/MainMarketing/MainMarketing';
// import MainMap from '../../Components/MainMap/MainMap';
import MainFAQ from '../../Components/MainFAQ/MainFAQ';
import MainParallax from '../../Components/MainParallax/MainParallax';
import FeaturesList from '../../Components/FeaturesList/FeturesList';
import MainNews from '../../Components/MainNews/MainNews';
import Testimonial from '../../Components/Testimonial/Testimonial';
// import Inquiries from '../../Components/Inquiries/Inquiries';
import Cta from '../../Components/Cta/Cta';
import Footer from '../../Components/Footer/Footer';

export default function HomePage() {
  return (
     <FlatList
      data={[]} 
      renderItem={null}
      keyExtractor={() => 'dummy'}
      ListHeaderComponent={
        <>
          <View style={{ zIndex: 1000 }}>
          <MainHeader />
          </View>
          <MainHero />
          <MainFeatures />
          <MainWhyUs />
          <MainBestsellers />
          <MainColors />
          <MainCone />
          <MainProcess />
          <MainMarketing />
          {/* <MainMap /> */}
          <MainFAQ />
          <MainParallax />
          <FeaturesList />
          <MainNews />
          <Testimonial />
          {/* <Inquiries /> */}
          <Cta />
          <Footer />
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 40,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
});