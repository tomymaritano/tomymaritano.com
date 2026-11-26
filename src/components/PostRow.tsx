import Link from 'next/link';
import type { PostMeta } from '@/content/types';

export function PostRow({ p, showYear = true }: { p: PostMeta; showYear?: boolean }) {
  return (
    <article className="rv" style={{ borderBottom: '1px solid var(--line)' }}>
      <Link href={`/writing/${p.slug}`} className="row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px', padding: '18px 0' }}>
        <span className="mono muted" style={{ fontSize: 14, minWidth: 96 }}>{showYear ? p.date.slice(0, 7) : p.date.slice(5)}</span>
        <span className="mono accent" style={{ fontSize: 12, minWidth: 120 }}>{p.kind}</span>
        <span style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h3 style={{ fontSize: 19, fontWeight: 500 }}>{p.title}</h3>
          <span className="muted" style={{ fontSize: 15 }}>{p.dek}</span>
        </span>
        <span className="mono muted" style={{ fontSize: 12 }}>{p.readingMinutes} MIN</span>
        <span className="row-arrow pixel accent" aria-hidden>READ →</span>
      </Link>
    </article>
  );
}
