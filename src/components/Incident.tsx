'use client';

import { useState } from 'react';
import { Blink, type Pose } from './Blink';

const DEFS: { label: string; pose: Pose; hot: number }[] = [
  { label: 'DETECT', pose: 'think', hot: 0 },
  { label: 'DIAGNOSE', pose: 'error', hot: 2 },
  { label: 'FIX', pose: 'ship', hot: 1 },
  { label: 'LEARN', pose: 'idle', hot: -1 },
];

const DEFAULT_STAGES = [
  'Something looks off. Blink notices before a user does.',
  'Found it: a dependency failed quietly. Silence is the real bug.',
  'Fix shipped, and now that failure crashes loudly instead.',
  'Drawn, written down, shared. The next team learns faster.',
];

/** Interactive incident figure, usable inside MDX: <Incident stages={[...]} nodes={[...]} /> */
export function Incident({ stages = DEFAULT_STAGES, nodes = ['input', 'service', 'dependency'] }: { stages?: string[]; nodes?: string[] }) {
  const [s, setS] = useState(0);
  const stage = DEFS[s];
  return (
    <figure className="panel rv" style={{ margin: '12px 0', display: 'flex', flexDirection: 'column', gap: 16, padding: 28, fontSize: 16 }}>
      <div role="group" aria-label="Incident stages" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {DEFS.map((d, k) => {
          const on = k === s;
          return (
            <button key={d.label} type="button" aria-pressed={on} onClick={() => setS(k)} className="pixel" style={{ minHeight: 44, padding: '0 14px', border: `1px solid ${on ? 'var(--accent-fill)' : 'var(--line)'}`, background: on ? 'var(--accent-fill)' : 'transparent', color: on ? 'var(--on-accent)' : 'var(--fg)', fontSize: 13, cursor: 'pointer', transition: 'background .3s' }}>
              0{k + 1} {d.label}
            </button>
          );
        })}
        <button type="button" onClick={() => setS((s + 1) % 4)} className="mono accent" style={{ minHeight: 44, padding: '0 14px', border: 'none', background: 'transparent', fontSize: 13, cursor: 'pointer' }}>
          NEXT STAGE →
        </button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 32, padding: '12px 0' }}>
        <Blink pose={stage.pose} cell={8} />
        <div style={{ flex: '1 1 420px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div aria-hidden className="mono" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, fontSize: 14 }}>
            {nodes.map((label, k) => {
              const hot = k === stage.hot;
              const broken = hot && stage.pose === 'error';
              return (
                <span key={label} style={{ display: 'contents' }}>
                  <span style={{ padding: '12px 14px', border: `1px solid ${hot ? (broken ? 'var(--loud)' : 'var(--accent-fill)') : 'var(--line)'}`, color: broken ? 'var(--loud)' : 'var(--fg)', transition: 'border-color .3s, color .3s' }}>
                    {broken ? `${label} ✕` : label}
                  </span>
                  {k < nodes.length - 1 && <span className="muted">→</span>}
                </span>
              );
            })}
          </div>
          <p aria-live="polite" style={{ fontSize: 17, lineHeight: 1.55 }}>{stages[s]}</p>
        </div>
      </div>
      <figcaption className="mono muted" style={{ fontSize: 12 }}>FIG. 01 · AN INCIDENT IN FOUR STAGES · CLICK A STAGE OR PRESS NEXT</figcaption>
    </figure>
  );
}

export function TLDR({ items }: { items: string[] }) {
  return (
    <div style={{ padding: '22px 24px', borderLeft: '3px solid var(--accent-fill)', background: 'var(--panel)', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <span className="pixel accent" style={{ fontSize: 14 }}>TL;DR</span>
      {items.map((t) => (
        <span key={t} style={{ fontSize: 17, lineHeight: 1.5 }}>{t}</span>
      ))}
    </div>
  );
}
