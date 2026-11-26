'use client';

import { useState } from 'react';
import type { PostKind, PostMeta } from '@/content/types';
import { Blink } from './Blink';
import { PostRow } from './PostRow';

const KINDS: ('ALL' | PostKind)[] = ['ALL', 'POSTMORTEM', 'ARCHITECTURE', 'LEADING TEAMS', 'BUILD LOG'];

export function WritingIndex({ posts }: { posts: PostMeta[] }) {
  const [kind, setKind] = useState<'ALL' | PostKind>('ALL');
  const shown = posts.filter((p) => kind === 'ALL' || p.kind === kind);
  const years = [...new Set(shown.map((p) => p.date.slice(0, 4)))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      <div role="group" aria-label="Filter by kind" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {KINDS.map((k) => {
          const on = k === kind;
          const count = posts.filter((p) => k === 'ALL' || p.kind === k).length;
          return (
            <button key={k} type="button" aria-pressed={on} onClick={() => setKind(k)} className="mono" style={{ minHeight: 44, padding: '0 14px', border: `1px solid ${on ? 'var(--accent-fill)' : 'var(--line)'}`, background: on ? 'var(--accent-fill)' : 'transparent', color: on ? 'var(--on-accent)' : 'var(--fg)', fontSize: 13, cursor: 'pointer' }}>
              {k} · {count}
            </button>
          );
        })}
      </div>
      {years.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, padding: 28, border: '1px dashed var(--line)' }}>
          <Blink pose="sleep" cell={4} decorative />
          <span className="mono muted" style={{ fontSize: 14 }}>NOTHING HERE YET. BLINK IS ON IT.</span>
        </div>
      ) : (
        years.map((y) => (
          <div key={y} style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
            <h2 className="pixel accent" style={{ width: 120, fontSize: 24 }}>{y}</h2>
            <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column' }}>
              {shown.filter((p) => p.date.startsWith(y)).map((p) => (
                <PostRow key={p.slug} p={p} showYear={false} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
