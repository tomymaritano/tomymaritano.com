import Link from 'next/link';
import { content } from '@/content';
import { now } from '@/content/now';
import { Blink } from '@/components/Blink';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { PostRow } from '@/components/PostRow';
import { Showcase } from '@/components/Showcase';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { Story } from '@/components/Story';

export default async function Home() {
  const [posts, builds] = await Promise.all([content.getPosts(), content.getBuilds()]);
  const latest = posts.slice(0, 4);

  return (
    <>
      <SiteHeader />
      <main id="main" style={{ display: 'flex', flexDirection: 'column', gap: 88, paddingTop: 40 }}>
        <Hero />
        <Marquee />
        <Story />

        <div className="wrap rv">
          <div className="panel title-block">
            <div><span>ROLE</span><span>Lead engineer · Psynth</span></div>
            <div><span>PREVIOUSLY</span><span>Wolt · Unicoin · Grandvalira</span></div>
            <div><span>BASED</span><span>Argentina</span></div>
            <div><span>REV</span><span>{new Date().toISOString().slice(0, 7).replace('-', '.')}</span></div>
          </div>
        </div>

        <section id="writing" aria-labelledby="h-writing" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="rv" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h2 id="h-writing" className="pixel" style={{ fontSize: 32 }}>/writing</h2>
            <Link href="/writing" className="mono accent" style={{ fontSize: 13 }}>SHEET 02 / 04 · ALL POSTS →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {latest.map((p) => <PostRow key={p.slug} p={p} />)}
          </div>
        </section>

        <section id="builds" aria-labelledby="h-builds" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="rv" style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <h2 id="h-builds" className="pixel" style={{ fontSize: 32 }}>/builds</h2>
            <Link href="/builds" className="mono accent" style={{ fontSize: 13 }}>SHEET 03 / 04 · ALL {builds.length} BUILDS →</Link>
          </div>
          <div className="rv"><Showcase builds={builds} /></div>
        </section>

        <section id="now" aria-labelledby="h-now" className="wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 32 }}>
          <div className="rv" style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 id="h-now" className="pixel" style={{ fontSize: 32 }}>/now</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 17, lineHeight: 1.5 }}>
              {now.rows.slice(0, 3).map((r, i) => (
                <span key={r.k}><span className="mono accent">0{i + 1} </span>{r.v}</span>
              ))}
            </div>
            <Link href="/now" className="mono accent" style={{ fontSize: 13 }}>SHEET 04 / 04 · FULL STATUS REPORT →</Link>
          </div>
          <div className="rv" style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 14, padding: 28, border: '1px solid var(--accent-text)', background: 'var(--panel)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Blink pose="ship" cell={3} decorative />
              <h2 className="pixel" style={{ fontSize: 22, fontWeight: 400 }}>THE BUILD LOG</h2>
            </div>
            <p className="muted" style={{ fontSize: 16, lineHeight: 1.55 }}>Once a month: what I shipped, what failed loud, what I learned leading a team while building on the side.</p>
            {/* TODO(tomas): wire this form to your newsletter provider (Buttondown, Ghost members, etc.). */}
            <form style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label htmlFor="email" className="mono" style={{ fontSize: 12 }}>EMAIL</label>
                <input id="email" type="email" name="email" required placeholder="you@domain.dev" className="mono" style={{ height: 46, padding: '0 14px', border: '1px solid var(--fg)', background: 'transparent', color: 'var(--fg)', fontSize: 14 }} />
              </div>
              <button type="submit" className="btn btn-primary lift" style={{ height: 46, fontSize: 14 }}>
                <span className="cursor" aria-hidden>▶</span>&nbsp;PRESS START
              </button>
            </form>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
