import { Blink, type Pose } from './Blink';

const ACTS: { n: string; tag: string; pose: Pose; title: string; text: string }[] = [
  { n: '01', tag: 'BUILD', pose: 'idle', title: 'Build it', text: 'I build small tools I actually want to use, after hours, one grid cell at a time.' },
  { n: '02', tag: 'SHIP', pose: 'ship', title: 'Ship it', text: 'They go out in public, early, with a status label and a real number attached.' },
  { n: '03', tag: 'BREAK', pose: 'error', title: 'Watch it break', text: 'Things break. A good system makes the failure loud instead of letting it hide.' },
  { n: '04', tag: 'DRAW', pose: 'think', title: 'Draw what happened', text: 'Then I draw the system and write the postmortem, so the next team learns faster.' },
];

export function Story() {
  return (
    <section aria-labelledby="story" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
      <div className="rv" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="label">HOW I WORK · A SYSTEM IN FOUR ACTS</span>
        <h2 id="story" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Build it. Ship it. Watch it break.
          <br />
          Draw what happened.
        </h2>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 28, paddingLeft: 40 }}>
        <div aria-hidden style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 2, background: 'var(--line)' }} />
        <div aria-hidden className="story-line" style={{ position: 'absolute', left: 10, top: 0, bottom: 0, width: 2, background: 'var(--accent-fill)' }} />
        {ACTS.map((a) => {
          const loud = a.pose === 'error';
          return (
            <article key={a.n} className="act panel" style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 28, padding: 28, borderColor: loud ? 'var(--loud)' : 'var(--line)' }}>
              <div aria-hidden style={{ position: 'absolute', left: -36, top: 36, width: 14, height: 14, background: loud ? 'var(--loud)' : 'var(--accent-fill)' }} />
              <span aria-hidden className="pixel" style={{ fontSize: 72, lineHeight: 1, color: 'transparent', WebkitTextStroke: '1px var(--accent-text)' }}>{a.n}</span>
              <Blink pose={a.pose} cell={6} decorative />
              <div style={{ flex: '1 1 320px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="mono" style={{ fontSize: 12, color: loud ? 'var(--loud)' : 'var(--accent-text)' }}>ACT {a.n} · {a.tag}</span>
                <h3 className="pixel" style={{ fontSize: 28 }}>{a.title}</h3>
                <p className="muted" style={{ fontSize: 17, lineHeight: 1.55 }}>{a.text}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
