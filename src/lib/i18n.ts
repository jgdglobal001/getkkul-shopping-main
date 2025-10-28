import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 한국어 리소스 import
import ko from '../locales/ko.json';
import koExtended from '../locales/ko-extended.json';
// TODO: Add English and Chinese translations
// import en from '../locales/en.json';
// import enExtended from '../locales/en-extended.json';
// import zhCn from '../locales/zh-cn.json';

// ko-extended.json 병합
const mergedKo = {
  ...ko,
  ...Object.keys(koExtended).reduce((acc, key) => {
    acc[key] = { ...ko[key], ...koExtended[key] };
    return acc;
  }, {} as Record<string, any>)
};

const resources = {
  ko: {
    translation: mergedKo
  }
  // TODO: Add more languages
  // en: {
  //   translation: mergedEn
  // },
  // 'zh-CN': {
  //   translation: mergedZhCn
  // }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    lng: 'ko', // 기본 언어를 한국어로 설정
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React는 기본적으로 XSS 보호
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
    
    react: {
      useSuspense: false,
    }
  });

export default i18n;
