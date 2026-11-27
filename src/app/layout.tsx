import type { Metadata, Viewport } from 'next';
import '@fontsource/inter-tight/800.css';
import '@fontsource/inter-tight/900.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import './globals.css';
import { profile } from '@/content/profile';

export const metadata: Metadata = {
  metadataBase: new URL(profile.site),
  title: { default: `${profile.name} · ${profile.role}`, template: `%s · ${profile.name}` },
  description: profile.bio,
  openGraph: { type: 'website', siteName: profile.name, url: profile.site },
};

export const viewport: Viewport = { themeColor: '#08090C', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
