import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { LanguageType } from '@/lib/translations';

interface LanguageState {
  language: LanguageType;
  setLanguage: (lang: LanguageType) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: 'mm_language_store', // LocalStorage key
    }
  )
);
