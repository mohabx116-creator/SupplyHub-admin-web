import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { ThemeRegistry } from '@/components/theme/ThemeRegistry';
import '@/styles/globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SupplyHub Admin | لوحة الإدارة',
  description: 'SupplyHub admin platform for procurement workflows and supplier operations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlexSans.variable} ${ibmPlexSansArabic.variable}`}>
        <ThemeRegistry>
          <LocaleProvider>
            <AuthProvider>{children}</AuthProvider>
          </LocaleProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
