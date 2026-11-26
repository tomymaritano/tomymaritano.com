import Link from 'next/link';
import type { Metadata } from 'next';
import { content } from '@/content';
import { DeviceMockup } from '@/components/DeviceMockup';
import { Showcase } from '@/components/Showcase';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = { title: '/builds', description: 'Products built after hours, each with a spec sheet and an honest status.' };

export default async function BuildsPage() {
  const builds = await content.getBuilds();
  return (
    <>
      <SiteHeader active="builds" />
      <main id="main" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 56, paddingTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 680 }}>
          <span className="label up">SHEET 03 · PRODUCTS ON THE BENCH</span>
          <h1 className="pixel up" style={{ animationDelay: '.1s', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1 }}>/builds</h1>
          <p className="muted up" style={{ animationDelay: '.2s', fontSize: 19, lineHeight: 1.55 }}>
            {builds.length} products built after hours. Some are live, some are still on the drawing board. Each one gets a spec sheet and an honest status.
          </p>
        </div>
        <Showcase builds={builds} />
        <section aria-labelledby="all" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <h2 id="all" className="pixel rv" style={{ fontSize: 26 }}>ALL BUILDS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {builds.map((b) => (
              <article key={b.slug} className="rv" style={{ display: 'flex', minWidth: 0 }}>
                <Link href={`/builds/${b.slug}`} className="lift panel" style={{ flexGrow: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ borderBottom: '1px solid var(--line)' }}>
                    <DeviceMockup device={b.device} title={b.deviceTitle} shot={b.screenshot} scale={0.42} />
                  </div>
                  <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="mono muted" style={{ fontSize: 12 }}>SPEC {String(b.order).padStart(2, '0')}</span>
                      <span className={`chip chip-${b.status.replace(' ', '-')}`}>{b.status}</span>
                    </div>
                    <h3 style={{ fontSize: 22, fontWeight: 700 }}>{b.name}</h3>
                    <span className="muted" style={{ fontSize: 15, lineHeight: 1.5 }}>{b.desc}</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
