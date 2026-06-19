'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, LanguageType } from '@/lib/translations';
import { useLanguageStore } from '@/app/melamarg/stores/languageStore';

interface LanguageContextType {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
  t: (key: keyof typeof translations['en']) => string;
  tPoiName: (poi: any) => string;
  tPoiDesc: (poi: any) => string;
  tEventName: (event: any) => string;
  tEventDesc: (event: any) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const storeLanguage = useLanguageStore((state) => state.language);
  const storeSetLanguage = useLanguageStore((state) => state.setLanguage);

  const [language, setLanguageState] = useState<LanguageType>('en');

  // Load language preference from Zustand store state on client mount (preventing SSR hydration mismatch)
  useEffect(() => {
    setLanguageState(storeLanguage);
  }, [storeLanguage]);

  const setLanguage = useCallback((lang: LanguageType) => {
    storeSetLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mm_language', lang);
    }
  }, [storeSetLanguage]);

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
    if (language === 'bn' && poi.name_bn) return poi.name_bn;
    return poi.name_en || poi.name || '';
  }, [language]);

  // Localized POI description helper
  const tPoiDesc = useCallback((poi: any): string => {
    if (!poi) return '';
    if (language === 'hi' && poi.description_hi) return poi.description_hi;
    if (language === 'or' && poi.description_or) return poi.description_or;
    if (language === 'bn' && poi.description_bn) return poi.description_bn;
    return poi.description_en || poi.description || '';
  }, [language]);

  // Localized Event name helper
  const tEventName = useCallback((event: any): string => {
    if (!event) return '';
    if (language === 'hi' && event.name_hi) return event.name_hi;
    if (language === 'or' && event.name_or) return event.name_or;
    if (language === 'bn' && event.name_bn) return event.name_bn;
    return event.name_en || event.name || '';
  }, [language]);

  // Localized Event description helper
  const tEventDesc = useCallback((event: any): string => {
    if (!event) return '';
    if (language === 'hi' && event.description_hi) return event.description_hi;
    if (language === 'or' && event.description_or) return event.description_or;
    if (language === 'bn' && event.description_bn) return event.description_bn;
    return event.description_en || event.description || '';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tPoiName, tPoiDesc, tEventName, tEventDesc }}>
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
