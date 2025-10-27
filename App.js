import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View , ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import './Utils/i18n';
import HomePage from './Pages/HomePage/HomePage';
import AuthPage from './Pages/Authenticate/AuthPage';
import ForgotPasswordPage from './Pages/ForgotPassword/ForgotPasswordPage';
import Otp from './Pages/Otp/Otp';
import LandingPage from './Pages/LandingPage/LandingPage';
import { useState , useEffect} from 'react';
import About from './Pages/About/About';
import Blogs from './Pages/Blogs/Blogs';
import ContactPage from './Pages/ContactPage/ContactPage';
import AccountPage from './Pages/AccountPage/AccountPage';
import SettingPage from './Pages/SettingPage/SettingPage';
import OrderPage from './Pages/Order/OrderPage';
import WalletPage from './Pages/Wallet/WalletPage';
import WishlistPage from './Pages/WishlistPage/WishlistPage';
import AddressPage from './Pages/AddressPage/AddressPage';
import Category from './Pages/Category/Category';
import ProductDetailPage from './Pages/ProductDetailPage/ProductDetailPage';
import { AppProvider } from './Utils/AppContext';
import CheckoutPage from './Pages/Checkout/ChekoutPage';
import ReturnPolicy from './Pages/ReturnPolicy/ReturnPolicy';
import RefundPolicy from './Pages/RefundPolicy/RefundPolicy';
import ShippingPolicy from './Pages/ShippingPolicy/ShippingPolicy';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import FAQs from './Pages/FAQs/FAQs';
import TermOfUse from './Pages/TermOfUse/TermOfUse';
import OrderDetails from './Pages/Order/OrderDetails';
import RazorpayWebView from './Components/RazorpayWebView/RazorpayWebView';
import PaymentSuccess from './Pages/PaymentSuccess/PaymentSuccess';
import PaymentFailure from './Pages/PaymentFailure/PaymentFailure';
import SplashScreen from './Pages/OnbordingPage/SplashScreen';
import OnboardingScreen1 from './Pages/OnbordingPage/OnboardingScreen1';
import OnboardingScreen2 from './Pages/OnbordingPage/OnboardingScreen2';
import OnboardingScreen3 from './Pages/OnbordingPage/OnboardingScreen3';
import PhoneNumberScreen from './Pages/Onboard/PhoneNumberScreen';
import OtpScreen from './Pages/Onboard/OtpScreen';
import CreateAccountScreen from './Pages/Onboard/CreateAccountScreen';
import ProfileScreen from './Pages/Onboard/ProfileScreen';
import AccountCreatedScreen from './Pages/Onboard/AccountCreatedScreen'; 

const Stack = createNativeStackNavigator();

export default function App() {

  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAppState = async () => {
      try {
        // Check if onboarding has run
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }

        // Check if user is authenticated
        const authStatus = await AsyncStorage.getItem('isAuthenticated');
        if (authStatus === 'true') {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }

      } catch (err) {
        console.log('Error checking app state:', err);
        setIsFirstLaunch(false);
        setIsAuthenticated(false);
      }
    };

    checkAppState();
  }, []);


  if (isFirstLaunch === null) {
    // App is still checking AsyncStorage
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AppProvider>
      <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
          initialRouteName={
            isFirstLaunch
              ? 'SplashScreen'
              : isAuthenticated
                ? 'Landing'
                : 'Auth'
          }
          screenOptions={{ headerShown: false }}
        >
        <Stack.Screen name="SplashScreen" component={SplashScreen} screenOptions={{ headerShown: false }} />
        <Stack.Screen name="OnboardingScreen1" component={OnboardingScreen1} options={{ gestureEnabled: true  }} />
        <Stack.Screen name="OnboardingScreen2" component={OnboardingScreen2} options={{ gestureEnabled: true  }} />
        <Stack.Screen name="OnboardingScreen3" component={OnboardingScreen3} options={{ gestureEnabled: true  }} />


        <Stack.Screen name="Auth">
          {(props) => (
            <AuthPage
              {...props}
              isAuthenticated={isAuthenticated}
              setAuthStatus={setIsAuthenticated}
            />
          )}
        </Stack.Screen>
       
        <Stack.Screen name="Home" component={HomePage} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
        <Stack.Screen name="Otp" component={Otp} />
        <Stack.Screen name="Landing" component={LandingPage} />
        <Stack.Screen name="About" component={About} />
        <Stack.Screen name="Blogs" component={Blogs} />
        <Stack.Screen name="Contact" component={ContactPage} />
        <Stack.Screen name="Account" component={AccountPage} />
        <Stack.Screen name="Profile" component={SettingPage} />
        <Stack.Screen name="Order" component={OrderPage}/>
        <Stack.Screen name="Wallet" component={WalletPage}/>
        <Stack.Screen name="Wishlist" component={WishlistPage}/>
        <Stack.Screen name="Address" component={AddressPage}/>
        <Stack.Screen name="Category" component={Category}/>
        <Stack.Screen name="ProductDetails" component={ProductDetailPage}/>
        <Stack.Screen name="Cart"  component={CheckoutPage}/>
        <Stack.Screen name="ReturnPolicy"  component={ReturnPolicy}/>
        <Stack.Screen name="RefundPolicy"  component={RefundPolicy}/>
        <Stack.Screen name="ShippingPolicy"  component={ShippingPolicy}/>
        <Stack.Screen name="PrivacyPolicy"  component={PrivacyPolicy}/>
        <Stack.Screen name="Faq"  component={FAQs}/>
        <Stack.Screen name="Terms"  component={TermOfUse}/>
        <Stack.Screen name="OrderDetails"  component={OrderDetails}/>
        <Stack.Screen name="RazorpayCheckoutScreen"  component={RazorpayWebView}/>
        <Stack.Screen name="PaymentSuccess"  component={PaymentSuccess}/>
        <Stack.Screen name="PaymentFail"  component={PaymentFailure}/>
         <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} />
        <Stack.Screen name="OtpScreen" component={OtpScreen} />
        <Stack.Screen name="CreateAccountScreen" component={CreateAccountScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="AccountCreatedScreen" component={AccountCreatedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
