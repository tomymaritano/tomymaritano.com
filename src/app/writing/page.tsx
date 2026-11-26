import Link from 'next/link';
import type { Metadata } from 'next';
import { WritingHeader } from '@/components/writing/WritingHeader';
import { writing } from '@/content/writing';

export const metadata: Metadata = { title: 'Writing', description: 'Postmortems, architecture notes and lessons from leading a team.' };

export default async function WritingIndex() {
  const posts = await writing.getPosts();
  return (
    <>
      <WritingHeader />
      <main id="main" className="page">
        <p className="eyebrow">WRITING</p>
        <h1 className="display">Notes from shipping.</h1>
        <p className="lede">Postmortems, architecture notes and lessons from leading a team.</p>
        <ul className="w-list">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/writing/${p.slug}`}>
                <span className="w-meta">{p.kind} · <time dateTime={p.date}>{p.date}</time> · {p.readingMinutes} min</span>
                <span className="w-title">{p.title}</span>
                <span className="w-dek">{p.dek}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
