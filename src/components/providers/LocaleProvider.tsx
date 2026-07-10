'use client';

import { useEffect, type ReactNode } from 'react';
import { useLocaleStore } from '@/lib/i18n/locale.store';

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useLocaleStore((state) => state.locale);
  const hydrateLocale = useLocaleStore((state) => state.hydrateLocale);

  useEffect(() => {
    hydrateLocale();
  }, [hydrateLocale]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  return children;
}
