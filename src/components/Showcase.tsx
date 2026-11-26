'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { BuildMeta } from '@/content/types';
import { DeviceMockup } from './DeviceMockup';

const INTERVAL = 6000;

export function Showcase({ builds }: { builds: BuildMeta[] }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const hover = useRef(false);
  const n = builds.length;

  const go = (step: number) => {
    setDir(step);
    setI((v) => (v + step + n) % n);
    setTick((t) => t + 1);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) setPaused(true);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      if (!hover.current) go(1);
    }, INTERVAL);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, n, tick]);

  if (n === 0) return null;
  const s = builds[i];
  const num = String(i + 1).padStart(2, '0');
  const total = String(n).padStart(2, '0');

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Product showcase"
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 18 }}
    >
      <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', minHeight: 600 }}>
        <div key={`info-${tick}`} className={tick === 0 ? 'up' : dir < 0 ? 'slide-back' : 'slide-in'} style={{ flex: '1 1 340px', padding: 36, display: 'flex', flexDirection: 'column', gap: 16, borderRight: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="mono muted" style={{ fontSize: 13 }}>SPEC {String(s.order).padStart(2, '0')}</span>
            <span className={`chip chip-${s.status.replace(' ', '-')}`}>{s.status}</span>
          </div>
          <h3 className="pixel" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 1 }}>{s.name}</h3>
          <p className="muted" style={{ fontSize: 18, lineHeight: 1.55 }}>{s.desc}</p>
          <div className="mono" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', border: '1px solid var(--line)', fontSize: 12 }}>
            <div style={{ padding: '10px 12px', borderRight: '1px solid var(--line)', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="muted">PLATFORM</span>
              <span>{s.platform}</span>
            </div>
            <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span className="muted">METRIC</span>
              <span className="accent">{s.metric}</span>
            </div>
          </div>
          <Link href={`/builds/${s.slug}`} className="btn btn-primary" style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: 14 }}>
            ▶ READ THE SPEC
          </Link>
        </div>
        <div style={{ flex: '2 1 640px', minWidth: 0, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', overflow: 'hidden' }}>
          <span className="mono muted" style={{ position: 'absolute', top: 14, left: 18, fontSize: 12 }}>FIG. {num} · {s.device.toUpperCase()}</span>
          <span className="mono accent" style={{ position: 'absolute', top: 14, right: 18, fontSize: 12 }}>{num} / {total}</span>
          <div key={`mock-${tick}`} className={tick === 0 ? 'up' : 'mock-in'} style={{ display: 'flex', maxWidth: '100%', overflow: 'hidden' }}>
            <DeviceMockup device={s.device} title={s.deviceTitle} shot={s.screenshot} />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
        <button type="button" aria-label="Previous product" onClick={() => go(-1)} className="btn" style={{ width: 48, height: 48, padding: 0, justifyContent: 'center', fontSize: 18 }}>←</button>
        <button type="button" aria-label="Next product" onClick={() => go(1)} className="btn btn-primary" style={{ width: 48, height: 48, padding: 0, justifyContent: 'center', fontSize: 18 }}>→</button>
        <button type="button" aria-pressed={paused} onClick={() => setPaused((p) => !p)} className="mono" style={{ minHeight: 48, padding: '0 14px', border: '1px solid var(--line)', background: 'transparent', color: 'var(--fg)', fontSize: 12, cursor: 'pointer' }}>
          {paused ? '▶ PLAY' : '❚❚ PAUSE'}
        </button>
        <div role="tablist" aria-label="Products" style={{ flex: '1 1 480px', display: 'grid', gridTemplateColumns: `repeat(${n}, minmax(0,1fr))`, gap: 6 }}>
          {builds.map((b, k) => {
            const on = k === i;
            return (
              <button
                key={b.slug}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => {
                  setDir(k >= i ? 1 : -1);
                  setI(k);
                  setTick((t) => t + 1);
                }}
                className="mono"
                style={{ minHeight: 48, padding: '6px 8px', border: 'none', borderTop: '3px solid var(--line)', background: on ? 'var(--tab-on)' : 'transparent', color: on ? 'var(--fg)' : 'var(--muted)', fontSize: 11, textAlign: 'left', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
              >
                <span className="muted" style={{ display: 'block' }}>{String(k + 1).padStart(2, '0')}</span>
                {b.name}
                {on && <span key={`bar-${tick}`} aria-hidden className={`slide-bar${paused ? ' paused' : ''}`} style={{ position: 'absolute', left: 0, top: -3, height: 3, width: '100%', background: 'var(--accent-fill)' }} />}
              </button>
            );
          })}
        </div>
      </div>
      <span aria-live="polite" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
        {s.name}, product {i + 1} of {n}
      </span>
    </section>
  );
}
