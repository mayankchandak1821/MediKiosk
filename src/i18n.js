import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

// Initialize i18next with i18next-http-backend plugin for dynamic HTTP loading
i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'ta', 'te', 'mr', 'bn'],
    debug: false,
    backend: {
      // Dynamic HTTP Backend loading path from public locales directory or backend API
      loadPath: '/locales/{{lng}}/{{ns}}.json',
      crossDomain: true
    },
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false // React handles XSS escaping automatically
    }
  });

export default i18n;
