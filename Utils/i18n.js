import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../Locales/en.json'; // or wherever your translations live
// import hi from './locales/hi.json'; // example for Hindi

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
    //   hi: { translation: hi },
    },
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
