import type { Metadata } from 'next';
import { now } from '@/content/now';
import { Blink } from '@/components/Blink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: '/now', description: 'What I am focused on this month.' };

export default function NowPage() {
  return (
    <>
      <SiteHeader active="now" />
      <main id="main" className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 56, paddingTop: 40 }}>
        <div style={{ flex: '1 1 560px', display: 'flex', flexDirection: 'column', gap: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span className="label up">SHEET 04 · STATUS REPORT</span>
            <h1 className="pixel up" style={{ animationDelay: '.08s', fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1 }}>/now</h1>
            <p className="muted up" style={{ animationDelay: '.16s', fontSize: 19, lineHeight: 1.55 }}>What I&apos;m focused on this month. If you&apos;re reading this, it&apos;s probably still true.</p>
            <span className="mono muted up" style={{ animationDelay: '.2s', fontSize: 13 }}>
              <span className="pulse" style={{ color: '#A6E3A1' }}>●</span> LAST UPDATED · {now.updated.toUpperCase()} · {now.place.toUpperCase()}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
            {now.rows.map((r, i) => (
              <div key={r.k} className="row up" style={{ animationDelay: `${0.28 + i * 0.1}s`, display: 'flex', flexWrap: 'wrap', gap: '8px 24px', padding: '22px 0', borderBottom: '1px solid var(--line)' }}>
                <span className="pixel accent" style={{ width: 140, fontSize: 15 }}>{r.k}</span>
                <span style={{ flex: '1 1 360px', fontSize: 19, lineHeight: 1.5 }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
        <aside style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, paddingTop: 24 }}>
          <div className="bob"><Blink pose="think" cell={14} assemble decorative /></div>
          <span className="mono muted" style={{ fontSize: 12 }}>FIG. 01 · BLINK, THINKING ABOUT VELA</span>
        </aside>
      </main>
      <SiteFooter />
    </>
  );
}
