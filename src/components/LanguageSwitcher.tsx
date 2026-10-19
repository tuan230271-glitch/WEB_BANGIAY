import React, { useState, useEffect } from 'react';

// 1. Quốc kỳ Việt Nam (Vietnam Flag)
export const VietnamFlag = ({ className = 'w-4 h-2.5 sm:w-4.5 sm:h-3' }: { className?: string }) => (
  <svg
    className={`${className} rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block border border-black/10`}
    viewBox="0 0 30 20"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Cờ Việt Nam"
  >
    <rect width="30" height="20" fill="#DA251D" />
    <polygon
      points="15,4 16.35,8.15 20.71,8.15 17.18,10.71 18.53,14.85 15,12.29 11.47,14.85 12.82,10.71 9.29,8.15 13.65,8.15"
      fill="#FFFF00"
    />
  </svg>
);

// 2. Quốc kỳ Vương Quốc Anh (Union Jack - English Flag)
export const UkFlag = ({ className = 'w-4 h-2.5 sm:w-4.5 sm:h-3' }: { className?: string }) => (
  <svg
    className={`${className} rounded-[2px] shadow-2xs overflow-hidden shrink-0 inline-block border border-black/10`}
    viewBox="0 0 60 30"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="English Flag"
  >
    <clipPath id="uk-flag-clip-header">
      <rect width="60" height="30" rx="2" />
    </clipPath>
    <g clipPath="url(#uk-flag-clip-header)">
      {/* Nền xanh navy */}
      <rect width="60" height="30" fill="#012169" />
      {/* Chữ thập chéo trắng */}
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#FFFFFF" strokeWidth="6" />
      {/* Chữ thập chéo đỏ */}
      <path d="M0 0 L60 30 M60 0 L0 30" stroke="#C8102E" strokeWidth="3.6" />
      {/* Chữ thập chính trắng */}
      <path d="M30 0 v30 M0 15 h60" stroke="#FFFFFF" strokeWidth="10" />
      {/* Chữ thập chính đỏ */}
      <path d="M30 0 v30 M0 15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

export type Language = 'vi' | 'en';

interface LanguageSwitcherProps {
  currentLang?: Language;
  onLanguageChange?: (lang: Language) => void;
  className?: string;
}

export default function LanguageSwitcher({
  currentLang: externalLang,
  onLanguageChange,
  className = ''
}: LanguageSwitcherProps) {
  const [lang, setLang] = useState<Language>(() => {
    if (externalLang) return externalLang;
    try {
      const saved = localStorage.getItem('solestyle_language');
      if (saved === 'en' || saved === 'vi') return saved;
    } catch (e) {}
    return 'vi';
  });

  useEffect(() => {
    if (externalLang && externalLang !== lang) {
      setLang(externalLang);
    }
  }, [externalLang]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'solestyle_language' && (e.newValue === 'vi' || e.newValue === 'en')) {
        setLang(e.newValue);
      }
    };
    const handleCustom = (e: any) => {
      if (e.detail === 'vi' || e.detail === 'en') {
        setLang(e.detail);
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('languageChanged', handleCustom);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('languageChanged', handleCustom);
    };
  }, []);

  const handleChange = (newLang: Language) => {
    if (newLang === lang) return;
    setLang(newLang);
    try {
      localStorage.setItem('solestyle_language', newLang);
    } catch (e) {}
    if (onLanguageChange) onLanguageChange(newLang);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: newLang }));
  };

  return (
    <div
      className={`flex items-center rounded-full bg-neutral-100/90 p-0.5 border border-neutral-200/80 shadow-2xs shrink-0 select-none ${className}`}
      id="header-language-switcher"
      title={lang === 'vi' ? 'Ngôn ngữ: Tiếng Việt' : 'Language: English'}
    >
      <button
        type="button"
        onClick={() => handleChange('vi')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
          lang === 'vi'
            ? 'bg-white text-neutral-900 shadow-2xs font-black'
            : 'text-neutral-500 hover:text-neutral-900'
        }`}
        aria-label="Chuyển sang Tiếng Việt"
      >
        <VietnamFlag />
        <span>VIE</span>
      </button>
      <span className="text-neutral-300 text-[10px] select-none font-light px-0.5">|</span>
      <button
        type="button"
        onClick={() => handleChange('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
          lang === 'en'
            ? 'bg-white text-neutral-900 shadow-2xs font-black'
            : 'text-neutral-500 hover:text-neutral-900'
        }`}
        aria-label="Switch to English"
      >
        <UkFlag />
        <span>ENG</span>
      </button>
    </div>
  );
}
