'use client';

import { useState, type PropsWithChildren } from 'react';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { adminTheme } from './theme';

const createEmotionCache = () =>
  createCache({
    key: 'muirtl',
    stylisPlugins: [prefixer, rtlPlugin],
  });

export function ThemeRegistry({ children }: PropsWithChildren) {
  const [cache] = useState(createEmotionCache);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={adminTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </CacheProvider>
  );
}
