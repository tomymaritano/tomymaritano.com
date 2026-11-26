'use client';

import { useState } from 'react';
import { Blink } from './Blink';

const HINTS = ['POKE BLINK 3 TIMES TO TRY A FIX.', 'RETRYING... (1/3)', 'RETRYING... (2/3)', 'PATCHED. STILL A 404, BUT BLINK FEELS BETTER.'];

export function NotFoundBlink() {
  const [p, setP] = useState(0);
  const fixed = p >= 3;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'flex-start' }}>
      <button type="button" aria-label="Poke the broken Blink" onClick={() => setP((v) => v + 1)} style={{ padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex' }}>
        <div key={p} className={p > 0 && !fixed ? 'shake' : undefined} style={{ display: 'flex' }}>
          <Blink pose={fixed ? 'ship' : 'error'} cell={18} assemble={p === 0} decorative />
        </div>
      </button>
      <span aria-live="polite" className="mono muted" style={{ fontSize: 12 }}>{HINTS[Math.min(p, 3)]}</span>
    </div>
  );
}
