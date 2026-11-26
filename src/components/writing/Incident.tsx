'use client';

import { useState } from 'react';

const STAGES = ['DETECT', 'DIAGNOSE', 'FIX', 'LEARN'] as const;
const DEFAULT_TEXT = [
  'Something looks off. Blink notices before a user does.',
  'Found it: a dependency failed quietly. Silence is the real bug.',
  'Fix shipped, and now that failure crashes loudly instead.',
  'Written down and shared. The next team learns faster.',
];
/** Which node is involved at each stage; -1 for none. */
const HOT = [0, 2, 1, -1];

/** Interactive incident figure for MDX posts: <Incident stages={[...]} nodes={[...]} /> */
export function Incident({ stages = DEFAULT_TEXT, nodes = ['input', 'service', 'dependency'] }: { stages?: string[]; nodes?: string[] }) {
  const [s, setS] = useState(0);
  return (
    <figure className="incident">
      <div role="group" aria-label="Incident stages" className="incident-stages">
        {STAGES.map((label, k) => (
          <button key={label} type="button" aria-pressed={k === s} onClick={() => setS(k)}>0{k + 1} {label}</button>
        ))}
        <button type="button" className="incident-next" onClick={() => setS((s + 1) % STAGES.length)}>Next stage →</button>
      </div>
      <div aria-hidden="true" className="incident-nodes">
        {nodes.map((n, k) => {
          const broken = k === HOT[s] && s === 1;
          return <span key={n} data-hot={k === HOT[s]} data-broken={broken}>{broken ? `${n} ✕` : n}</span>;
        })}
      </div>
      <p aria-live="polite">{stages[s]}</p>
      <figcaption>An incident in four stages. Pick a stage or press next.</figcaption>
    </figure>
  );
}

export function TLDR({ items }: { items: string[] }) {
  return (
    <aside className="tldr">
      <strong>TL;DR</strong>
      {items.map((t) => <span key={t}>{t}</span>)}
    </aside>
  );
}
