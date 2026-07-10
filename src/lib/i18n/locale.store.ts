'use client';

import { create } from 'zustand';
import { defaultLocale, type Locale, isLocale } from './messages';

type LocaleStore = {
  locale: Locale;
  hydrated: boolean;
  setLocale: (locale: Locale) => void;
  hydrateLocale: () => void;
  toggleLocale: () => void;
};

const storageKey = 'supplyhub-admin-locale';

export const useLocaleStore = create<LocaleStore>((set, get) => ({
  locale: defaultLocale,
  hydrated: false,
  setLocale: (locale) => {
    set({ locale });
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(storageKey, locale);
    }
  },
  hydrateLocale: () => {
    if (get().hydrated || typeof window === 'undefined') {
      set({ hydrated: true });
      return;
    }

    const storedLocale = window.localStorage.getItem(storageKey);
    const nextLocale = isLocale(storedLocale) ? storedLocale : defaultLocale;
    if (!storedLocale) {
      window.localStorage.setItem(storageKey, nextLocale);
    }
    set({
      locale: nextLocale,
      hydrated: true,
    });
  },
  toggleLocale: () => {
    const nextLocale = get().locale === 'ar' ? 'en' : 'ar';
    get().setLocale(nextLocale);
  },
}));
