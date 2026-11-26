import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { content } from '@/content';
import { Mdx } from '@/components/Mdx';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await content.getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await content.getPost((await params).slug);
  return p ? { title: p.title, description: p.dek, openGraph: { type: 'article', publishedTime: p.date } } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await content.getPost(slug);
  if (!post) notFound();
  const all = await content.getPosts();
  const idx = all.findIndex((p) => p.slug === slug);
  const newer = all[idx - 1];
  const older = all[idx + 1];

  return (
    <>
      <div className="progress" aria-hidden />
      <SiteHeader active="writing" />
      <main id="main" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 48, paddingTop: 40 }}>
        <article style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          <header style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 760 }}>
            <nav aria-label="Breadcrumb" className="mono muted up" style={{ fontSize: 13 }}>
              <Link href="/writing">/writing</Link> / {post.kind.toLowerCase()}
            </nav>
            <span className="label up" style={{ animationDelay: '.08s' }}>
              {post.kind} · <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} MIN READ
            </span>
            <h1 className="up" style={{ animationDelay: '.16s', fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 700, lineHeight: 1.02, letterSpacing: '-0.02em' }}>{post.title}</h1>
            <p className="muted up" style={{ animationDelay: '.24s', fontSize: 21, lineHeight: 1.55 }}>{post.dek}</p>
          </header>
          <div className="prose">
            {post.format === 'mdx' ? <Mdx source={post.body} /> : <div dangerouslySetInnerHTML={{ __html: post.body }} />}
          </div>
        </article>
        <nav aria-label="More posts" className="rv" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {older && (
            <Link href={`/writing/${older.slug}`} className="panel lift" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="mono muted" style={{ fontSize: 12 }}>← OLDER</span>
              <span style={{ fontSize: 19, fontWeight: 500 }}>{older.title}</span>
            </Link>
          )}
          {newer && (
            <Link href={`/writing/${newer.slug}`} className="panel lift" style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'right' }}>
              <span className="mono muted" style={{ fontSize: 12 }}>NEWER →</span>
              <span style={{ fontSize: 19, fontWeight: 500 }}>{newer.title}</span>
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}
