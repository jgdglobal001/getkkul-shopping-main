"use client";
import { useState, useRef, useEffect } from "react";
import { IoChevronDownSharp } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

const languages = [
  { code: "ko", name: "한국어", flag: "🇰🇷", available: true },
  { code: "en", name: "English", flag: "🇺🇸", available: true },
  { code: "zh", name: "中文", flag: "🇨🇳", available: true },
];

const LanguageDropdown = () => {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find current language from i18n or localStorage
  const currentLangCode = i18n.language || "ko";
  const selectedLanguage = languages.find(l => l.code === (currentLangCode.startsWith('zh') ? 'zh' : currentLangCode)) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: (typeof languages)[0]) => {
    if (!language.available) return;
    i18n.changeLanguage(language.code);
    localStorage.setItem('i18nextLng', language.code);
    // Explicitly set cookie for SSR components
    document.cookie = `i18next=${language.code}; path=/; max-age=31536000`;
    setIsOpen(false);
    // Force complete reload to ensure all server and client components sync language
    window.location.reload();
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="headerTopMenu cursor-pointer hover:text-orange-300 transition-colors flex items-center gap-1"
      >
        <span className="hidden sm:inline">{selectedLanguage.flag}</span>
        <span className="hidden md:inline">{selectedLanguage.name}</span>
        <span className="md:hidden">{selectedLanguage.code.toUpperCase()}</span>
        <IoChevronDownSharp
          className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
            }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full right-0 mt-2 w-52 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 z-50 py-2"
          style={{ backdropFilter: "blur(8px)" }}
        >
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageSelect(language)}
              disabled={!language.available}
              className={`w-full px-4 py-2 text-left flex items-center justify-between transition-colors ${language.available
                ? "text-gray-700 hover:bg-gray-50 cursor-pointer"
                : "text-gray-400 cursor-not-allowed bg-gray-50/50"
                }`}
            >
              <div className="flex items-center gap-2 flex-1">
                <span className={language.available ? "" : "opacity-50"}>
                  {language.flag}
                </span>
                <span className="text-sm">{language.name}</span>
                {!language.available && (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    Coming Soon
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {selectedLanguage.code === language.code &&
                  language.available && (
                    <FiCheck className="text-theme-color text-sm" />
                  )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
