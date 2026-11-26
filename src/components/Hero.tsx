'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Blink, type Pose } from './Blink';

const POSES: Pose[] = ['wave', 'idle', 'think', 'ship', 'error', 'sleep'];
const STATUS: Record<Pose, string> = { wave: 'HELLO', idle: 'OK', think: 'THINKING', ship: 'SHIPPED', error: 'FAILED LOUD', sleep: 'OFFLINE' };

export function Hero() {
  const [i, setI] = useState(0);
  const [found, setFound] = useState<Set<Pose>>(new Set(['wave']));
  const [glass, setGlass] = useState(true);
  const pose = POSES[i % POSES.length];

  useEffect(() => {
    const read = () => setGlass((document.documentElement.dataset.theme ?? 'blueprint') === 'blueprint');
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  const poke = () => {
    const next = i + 1;
    setI(next);
    setFound((f) => new Set(f).add(POSES[next % POSES.length]));
  };

  const count = found.size;

  return (
    <section id="top" aria-labelledby="h1" className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 48 }}>
      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 22 }}>
        <span className="label up">SHEET 01 / 04 · FIG. 01 · THE ENGINEER · PORTFOLIO {new Date().getFullYear()}</span>
        <h1 id="h1" className="pixel" style={{ fontWeight: 700, fontSize: 'clamp(44px, 7vw, 88px)', lineHeight: 1.02, textShadow: 'var(--shadow)' }}>
          <span className="mask"><span style={{ animationDelay: '.1s' }}>Make it</span></span>
          <span className="mask">
            <span style={{ animationDelay: '.25s' }}>
              fail <span style={{ color: pose === 'error' ? 'var(--loud)' : 'var(--fg)', transition: 'color .2s' }}>loud.</span>
              <span className="cursor" aria-hidden style={{ display: 'inline-block', width: '0.5em', height: '0.8em', marginLeft: '0.12em', background: 'var(--accent-fill)', verticalAlign: '-0.04em' }} />
            </span>
          </span>
        </h1>
        <p className="up muted" style={{ animationDelay: '.45s', fontSize: 20, lineHeight: 1.55, maxWidth: 560 }}>
          I&apos;m Tomás, an engineering lead from Argentina. By day I run an 8-person team at Psynth. By night I build small apps and draw how systems break.
        </p>
        <div className="up" style={{ animationDelay: '.6s', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <Link href="/writing" className="btn btn-primary lift">▶ READ THE LOG</Link>
          <Link href="#builds" className="btn lift">SEE BUILDS</Link>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div aria-hidden className="mono accent" style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <span>|</span><div className="dx" style={{ flexGrow: 1, height: 1, background: 'var(--accent-text)' }} /><span>16 PX</span><div className="dx" style={{ flexGrow: 1, height: 1, background: 'var(--accent-text)' }} /><span>|</span>
          </div>
          <button type="button" onClick={poke} aria-label="Poke Blink to change its state" style={{ padding: 0, border: 'none', background: 'transparent', outline: '1px dashed var(--accent-text)', cursor: 'pointer', display: 'flex' }}>
            <div className="bob" style={{ display: 'flex' }}>
              <div key={i} className={i === 0 ? undefined : i % 2 ? 'jumpA' : 'jumpB'} style={{ display: 'flex' }}>
                <Blink pose={pose} cell={20} glass={glass} assemble={i === 0} decorative />
              </div>
            </div>
          </button>
          <span aria-live="polite" className="mono muted" style={{ fontSize: 12 }}>
            FIG. 02 · BLINK · STATUS: <span className="accent">{STATUS[pose]}</span> · CLICK TO POKE
          </span>
          <div className="mono muted" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
            <span>STATES FOUND {count}/6</span>
            <div aria-hidden style={{ display: 'flex', gap: 3 }}>
              {POSES.map((p) => (
                <div key={p} style={{ width: 14, height: 10, background: found.has(p) ? 'var(--accent-fill)' : 'var(--line)', transition: 'background .3s' }} />
              ))}
            </div>
            {count === 6 && <span className="accent">ACHIEVEMENT: SEEN IT ALL</span>}
          </div>
        </div>
        <div aria-hidden className="mono accent" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontSize: 12, paddingTop: 26, height: 320 }}>
          <span>—</span><div className="dy" style={{ flexGrow: 1, width: 1, background: 'var(--accent-text)' }} /><span>16</span><div className="dy" style={{ flexGrow: 1, width: 1, background: 'var(--accent-text)' }} /><span>—</span>
        </div>
      </div>
    </section>
  );
}
