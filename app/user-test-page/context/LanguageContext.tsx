'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LanguageType } from '@/lib/translations';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof typeof translations['en']) => string;
  tPoiName: (poi: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<LanguageType>('en');

  // Load language preference from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('mm_language') as LanguageType;
      if (savedLang && (savedLang === 'en' || savedLang === 'hi' || savedLang === 'or' || savedLang === 'bn')) {
        setLanguageState(savedLang);
      }
    }
  }, []);

  const setLanguage = useCallback((lang: LanguageType) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_language', lang);
    }
  }, []);

  // Translation helper function
  const t = useCallback((key: keyof typeof translations['en']): string => {
    const activeDict = translations[language] || translations['en'];
    // Fallback to English if translation is missing in selected language
    return (activeDict as any)[key] || (translations['en'] as any)[key] || String(key);
  }, [language]);

  // Localized POI name helper
  const tPoiName = useCallback((poi: any): string => {
    if (!poi) return '';
    if (language === 'hi' && poi.name_hi) return poi.name_hi;
    if (language === 'or' && poi.name_or) return poi.name_or;
    // Bengali fallback using en for now unless provided, or fallback
    return poi.name_en || poi.name || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tPoiName }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
