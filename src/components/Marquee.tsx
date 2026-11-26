const WORDS = ['BUILD', 'SHIP', 'BREAK', 'FAIL LOUD', 'FIX', 'DRAW IT', 'REPEAT', '◆'];

export function Marquee() {
  const items = [...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className="marquee-wrap" aria-hidden style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: 'var(--panel)', overflow: 'hidden', padding: '18px 0' }}>
      <div className="marquee pixel" style={{ fontSize: 28 }}>
        {items.map((w, i) => (
          <span key={i} style={{ whiteSpace: 'nowrap', color: w === 'FAIL LOUD' ? 'var(--loud)' : w === '◆' ? 'var(--accent-text)' : 'var(--fg)' }}>
            {w}
          </span>
        ))}
      </div>
    </div>
  );
}
