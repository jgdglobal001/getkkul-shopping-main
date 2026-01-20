import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어 리소스 import
import ko from '../locales/ko.json';
import koExtended from '../locales/ko-extended.json';
// TODO: Add English and Chinese translations
import en from '../locales/en.json';
import zh from '../locales/zh.json';

// ko-extended.json 병합
const mergedKo = {
  ...ko,
  ...Object.keys(koExtended).reduce((acc, key) => {
    acc[key] = { ...(ko as any)[key], ...(koExtended as any)[key] };
    return acc;
  }, {} as Record<string, any>)
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ko: {
        translation: mergedKo
      }
    },
    lng: 'ko',
    fallbackLng: 'ko',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;
