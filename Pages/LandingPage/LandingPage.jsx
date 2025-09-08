import { View, StyleSheet , ScrollView , FlatList} from 'react-native';
import NavbarHeader from '../../Components/NavBarHeader/NavbarHeader';
import Navbar from '../../Components/Navbar/Navbar';
import Banner from '../../Components/Banner/Banner';
import MarqueeText from '../../Components/MarqueeText/MarqueeText';
import FeturedList from '../../Components/FeturedList/FeturedList';
import FeaturedBySize from '../../Components/FeturedList/FeaturedBySize';
import ProductList from '../../Components/ProductList/ProductList';
import FeaturesList from '../../Components/FeaturesList/FeturesList';
import CtaCard from '../../Components/Cta/CtaCard';
import Footer from '../../Components/Footer/Footer';
import Cta from '../../Components/Cta/Cta';
// import Inquiries from '../../Components/Inquiries/Inquiries';
import Testimonial from '../../Components/Testimonial/Testimonial';
import BlogList from '../../Components/BlogList/BlogList';
import BottomNav from '../../Components/BottomNav/BottomNav';



export default function LandingPage() {
  return (
    <View style={styles.container}>
      {/* Scrollable Content */}
      <FlatList
        data={[]} 
        renderItem={null}
        keyExtractor={() => 'dummy'}
        contentContainerStyle={styles.contentContainer}
        ListHeaderComponent={
          <>
            <NavbarHeader />
            <Banner />
            <MarqueeText />
            <FeturedList />
            <FeaturedBySize />
            <ProductList />
            <FeaturesList />
            <CtaCard />
            <Testimonial />
            <BlogList />
            {/* <Inquiries /> */}
            <Cta />
            <Footer />
          </>
        }
      />

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <BottomNav />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingBottom: 80, // space for bottom nav
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    elevation: 5, // shadow for Android
    shadowColor: '#000', // shadow for iOS
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});