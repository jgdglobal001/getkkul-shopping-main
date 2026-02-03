import koTranslations from "@/locales/ko.json";
import enTranslations from "@/locales/en.json";
import zhTranslations from "@/locales/zh.json";

export type Language = "ko" | "en" | "zh";

/**
 * 서버 컴포넌트에서 사용할 번역 함수를 생성합니다.
 * @param lang 현재 언어 ('ko', 'en', 'zh')
 * @returns 번역 함수 t(key, defaultValue)
 */
export const getT = (lang: string = "ko") => {
    let translations: any = koTranslations;
    if (lang === "en") translations = enTranslations;
    if (lang === "zh") translations = zhTranslations;

    return (key: string, defaultValue: string = ""): string => {
        const keys = key.split(".");
        let value: any = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }

        // 만약 번역이 없는 경우 한국어(ko)에서 다시 찾아봅니다. (폴백)
        if (value === undefined && lang !== "ko") {
            let fallbackValue: any = koTranslations;
            for (const k of keys) {
                if (fallbackValue && typeof fallbackValue === 'object' && k in fallbackValue) {
                    fallbackValue = fallbackValue[k];
                } else {
                    fallbackValue = undefined;
                    break;
                }
            }
            value = fallbackValue;
        }

        return typeof value === 'string' ? value : (defaultValue || key);
    };
};

/**
 * 쿠키에서 현재 언어 설정을 가져옵니다.
 * 서버 컴포넌트에서 사용 가능합니다.
 */
export const getLanguageFromCookie = (cookieStore: any): Language => {
    const lang = cookieStore.get("i18next")?.value;
    if (lang === "en" || lang === "zh") return lang;
    return "ko";
};
