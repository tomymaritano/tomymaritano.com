import Link from 'next/link';
import { NotFoundBlink } from '@/components/NotFoundBlink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

const LINES = [
  { text: 'GET /[this-path] → 404', loud: true },
  { text: 'Error: route not found', loud: true },
  { text: '  at router (tomymaritano.com)', loud: false },
  { text: '  at you, probably a typo', loud: false },
];

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 56, paddingTop: 48 }}>
        <NotFoundBlink />
        <div style={{ flex: '1 1 460px', display: 'flex', flexDirection: 'column', gap: 22 }}>
          <h1 className="pixel glitch accent" style={{ fontSize: 'clamp(72px, 12vw, 160px)', lineHeight: 0.9 }}>404</h1>
          <p className="pixel" style={{ fontSize: 24, color: 'var(--loud)' }}>THIS PAGE FAILED LOUD.</p>
          <div role="log" className="panel mono" style={{ padding: '18px 20px', fontSize: 14, lineHeight: 1.8, display: 'flex', flexDirection: 'column' }}>
            {LINES.map((l, i) => (
              <span key={l.text} className="up" style={{ animationDelay: `${0.3 + i * 0.3}s`, color: l.loud ? 'var(--loud)' : 'var(--muted)' }}>{l.text}</span>
            ))}
            <span className="up" style={{ animationDelay: '1.6s' }}>$ <span className="cursor">█</span></span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <Link href="/" className="btn btn-primary lift">▶ BACK TO HOME</Link>
            <Link href="/writing" className="btn lift">READ A POSTMORTEM</Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
