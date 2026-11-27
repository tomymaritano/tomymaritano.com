import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Mdx } from '@/components/writing/Mdx';
import { WritingHeader } from '@/components/writing/WritingHeader';
import { writing } from '@/content/writing';

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await writing.getPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await writing.getPost((await params).slug);
  return p ? { title: p.title, description: p.dek, openGraph: { type: 'article', publishedTime: p.date } } : {};
}

export default async function PostPage({ params }: Props) {
  const post = await writing.getPost((await params).slug);
  if (!post) notFound();
  return (
    <>
      <WritingHeader />
      <main id="main" className="page">
        <article>
          <p className="eyebrow">{post.kind} · <time dateTime={post.date}>{post.date}</time> · {post.readingMinutes} min read</p>
          <h1 className="display">{post.title}</h1>
          <p className="lede">{post.dek}</p>
          <div className="prose">
            {post.format === 'mdx' ? <Mdx source={post.body} /> : <div dangerouslySetInnerHTML={{ __html: post.body }} />}
          </div>
        </article>
        <p><Link href="/writing">← All writing</Link></p>
      </main>
    </>
  );
}
