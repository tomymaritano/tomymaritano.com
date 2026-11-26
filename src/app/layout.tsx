import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Silkscreen, Space_Grotesk } from 'next/font/google';
import { themeScript } from '@/components/ThemeSwitch';
import '@/styles/globals.css';

const pixel = Silkscreen({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-pixel', display: 'swap' });
const sans = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], variable: '--font-sans', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://tomymaritano.com'),
  title: { default: 'tomymaritano — Make it fail loud', template: '%s · tomymaritano' },
  description: 'Tomás Maritano, engineering lead from Argentina. Postmortems, architecture notes and the small apps I build after hours.',
  authors: [{ name: 'Tomás Maritano', url: 'https://tomymaritano.com' }],
  openGraph: { type: 'website', siteName: 'tomymaritano', locale: 'en_US' },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#0E3A8A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="blueprint" className={`${pixel.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
