import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { content } from '@/content';
import { DeviceMockup } from '@/components/DeviceMockup';
import { Mdx } from '@/components/Mdx';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await content.getBuilds()).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await content.getBuild((await params).slug);
  return b ? { title: b.name, description: b.desc } : {};
}

export default async function BuildPage({ params }: Props) {
  const { slug } = await params;
  const b = await content.getBuild(slug);
  if (!b) notFound();
  const others = (await content.getBuilds()).filter((x) => x.slug !== slug);
  const spec = [
    ['STATUS', b.status],
    ['PLATFORM', b.platform],
    ['STACK', b.stack],
    ['STARTED', b.started],
    ['METRIC', b.metric],
  ].filter(([, v]) => v) as [string, string][];
  const hasStory = b.body.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').trim().length > 0;

  return (
    <>
      <SiteHeader active="builds" />
      <main id="main" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 64, paddingTop: 40 }}>
        <section style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 48 }}>
          <div style={{ flex: '1 1 460px', display: 'flex', flexDirection: 'column', gap: 18 }}>
            <nav aria-label="Breadcrumb" className="mono muted up" style={{ fontSize: 13 }}>
              <Link href="/builds">/builds</Link> / {b.slug}
            </nav>
            <div className="up" style={{ animationDelay: '.08s', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className="label">SPEC {String(b.order).padStart(2, '0')} · SHEET 03.{b.order}</span>
              <span className={`chip chip-${b.status.replace(' ', '-')}`}>{b.status}</span>
            </div>
            <h1 className="pixel up" style={{ animationDelay: '.16s', fontSize: 'clamp(44px, 7vw, 80px)', lineHeight: 1 }}>{b.name}</h1>
            <p className="muted up" style={{ animationDelay: '.24s', fontSize: 21, lineHeight: 1.5 }}>{b.desc}</p>
            <div className="up" style={{ animationDelay: '.32s', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              {b.url && <a href={b.url} className="btn btn-primary lift">▶ OPEN {b.url.replace('https://', '').toUpperCase()}</a>}
              {b.repo && <a href={b.repo} className="btn lift mono" style={{ fontSize: 14 }}>SOURCE ↗</a>}
            </div>
          </div>
          <figure className="up" style={{ animationDelay: '.2s', margin: 0, flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <DeviceMockup device={b.device} title={b.deviceTitle} shot={b.screenshot} scale={0.72} />
            <figcaption className="mono muted" style={{ fontSize: 12 }}>FIG. 01 · {b.name.toUpperCase()}</figcaption>
          </figure>
        </section>

        <section className="rv" aria-labelledby="spec" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 id="spec" className="pixel" style={{ fontSize: 26 }}>SPEC SHEET</h2>
          <div className="panel title-block" style={{ fontSize: 14 }}>
            {spec.map(([k, v]) => (
              <div key={k}><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
        </section>

        {hasStory && (
          <section className="rv prose" aria-label="Story">
            <Mdx source={b.body} />
          </section>
        )}

        <section className="rv" aria-labelledby="more" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <h2 id="more" className="pixel" style={{ fontSize: 26 }}>MORE BUILDS</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {others.map((m) => (
              <Link key={m.slug} href={`/builds/${m.slug}`} className="lift panel" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="mono muted" style={{ fontSize: 11 }}>SPEC {String(m.order).padStart(2, '0')} · {m.status}</span>
                <span style={{ fontSize: 19, fontWeight: 700 }}>{m.name}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
