'use client';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { getMessageBundle } from '@/lib/i18n/messages';
import { useLocaleStore } from '@/lib/i18n/locale.store';

export function LanguageSwitcher() {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);
  const copy = getMessageBundle(locale);

  return (
    <ToggleButtonGroup
      value={locale}
      exclusive
      size="small"
      onChange={(_, nextLocale: 'ar' | 'en' | null) => {
        if (nextLocale) {
          setLocale(nextLocale);
        }
      }}
      sx={{
        '& .MuiToggleButton-root': {
          px: 1.25,
          py: 0.75,
          fontWeight: 700,
          borderColor: '#cbd5e1',
          color: '#475569',
        },
        '& .Mui-selected': {
          bgcolor: '#0f172a !important',
          color: '#ffffff !important',
        },
      }}
    >
      <ToggleButton value="ar">{copy.shell.languageArabic}</ToggleButton>
      <ToggleButton value="en">{copy.shell.languageEnglish}</ToggleButton>
    </ToggleButtonGroup>
  );
}
