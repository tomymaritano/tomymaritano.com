/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from 'react';
import type { Device } from '@/content/types';

const SIZES: Record<Device, [number, number]> = {
  browser: [640, 420],
  window: [640, 420],
  ide: [640, 420],
  menubar: [420, 420],
  sliders: [420, 420],
  terminal: [640, 380],
  phone: [260, 520],
};

const bar = (w: string, h = 8, c = 'var(--m-bar)'): CSSProperties => ({ width: w, height: h, background: c });
const Dots = ({ size = 9 }: { size?: number }) => (
  <div style={{ display: 'flex', gap: 6 }}>
    {['var(--loud)', 'var(--accent-fill)', '#A6E3A1'].map((c) => (
      <div key={c} style={{ width: size, height: size, background: c }} />
    ))}
  </div>
);

function Shot({ src }: { src: string }) {
  return <img src={src} alt="" style={{ flexGrow: 1, width: '100%', objectFit: 'cover', objectPosition: 'top' }} />;
}

function Frame({ children, title, center = true }: { children: ReactNode; title: string; center?: boolean }) {
  return (
    <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', border: '2px solid var(--m-frame)', background: 'var(--m-screen)', overflow: 'hidden' }}>
      <div style={{ height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', position: 'relative', background: 'var(--m-chrome)', borderBottom: '2px solid var(--m-frame)', fontSize: 11, padding: '0 12px' }}>
        <div style={{ position: center ? 'absolute' : 'static', left: 12, marginRight: center ? 0 : 10 }}>
          <Dots />
        </div>
        {title}
      </div>
      {children}
    </div>
  );
}

export function DeviceMockup({ device, title, shot, scale = 1 }: { device: Device; title: string; shot?: string; scale?: number }) {
  const [w, h] = SIZES[device];
  const pct = (n: number) => `${n}%`;
  let inner: ReactNode;

  if (device === 'browser') {
    inner = (
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', border: '2px solid var(--m-frame)', background: 'var(--m-screen)', overflow: 'hidden' }}>
        <div style={{ height: 36, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', background: 'var(--m-chrome)', borderBottom: '2px solid var(--m-frame)' }}>
          <Dots size={10} />
          <div style={{ flexGrow: 1, marginLeft: 10, height: 20, border: '1px solid var(--m-bar)', display: 'flex', alignItems: 'center', padding: '0 10px', fontSize: 11 }}>{title}</div>
        </div>
        {shot ? (
          <Shot src={shot} />
        ) : (
          <div style={{ flexGrow: 1, padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={bar('90px', 12)} />
              <div style={{ display: 'flex', gap: 8 }}>{[0, 1, 2].map((i) => <div key={i} style={bar('40px', 10)} />)}</div>
            </div>
            <div style={{ ...bar('70%', 26, 'var(--m-bar-strong)'), marginTop: 12 }} />
            <div style={bar('46%', 12)} />
            <div style={bar('110px', 30, 'var(--accent-fill)')} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10, marginTop: 'auto' }}>
              {[70, 55, 80].map((v) => (
                <div key={v} style={{ height: 92, border: '1px solid var(--m-bar)', padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={bar('50%')} />
                  <div style={bar(pct(v), 18, 'var(--m-bar-strong)')} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  } else if (device === 'window') {
    inner = (
      <Frame title={title}>
        {shot ? (
          <Shot src={shot} />
        ) : (
          <div style={{ flexGrow: 1, display: 'flex' }}>
            <div style={{ width: 150, borderRight: '1px solid var(--m-bar)', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ height: 26, background: 'var(--accent-fill)', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6 }}>
                <div style={{ width: 8, height: 8, background: 'var(--loud)' }} />
                <div style={bar('50px', 6, 'var(--on-accent)')} />
              </div>
              {[80, 60, 70, 50, 75, 55].map((v, i) => <div key={i} style={bar(pct(v))} />)}
            </div>
            <div style={{ flexGrow: 1, padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={bar('55%', 18, 'var(--m-bar-strong)')} />
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 40, margin: '6px 0' }}>
                {Array.from({ length: 40 }, (_, i) => (
                  <div key={i} style={{ width: 5, height: 8 + ((i * 37) % 29) + (i % 5) * 3, background: 'var(--accent-fill)' }} />
                ))}
              </div>
              {[92, 84, 88, 60, 90, 76, 40].map((v, i) => <div key={i} style={bar(pct(v))} />)}
            </div>
          </div>
        )}
      </Frame>
    );
  } else if (device === 'ide') {
    const code: [number, number, number][] = [[0, 18, 40], [0, 30, 20], [16, 14, 50], [16, 22, 34], [32, 12, 44], [32, 26, 18], [16, 10, 30], [0, 8, 0], [0, 20, 36], [16, 16, 48], [16, 30, 22], [32, 14, 30], [16, 8, 0], [0, 8, 0]];
    const tones = ['var(--accent-fill)', '#74ACDF', 'var(--loud)'];
    inner = (
      <Frame title={title}>
        {shot ? (
          <Shot src={shot} />
        ) : (
          <div style={{ flexGrow: 1, display: 'flex' }}>
            <div style={{ width: 120, borderRight: '1px solid var(--m-bar)', padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[[0, 70, 1], [10, 60, 0], [10, 50, 2], [10, 55, 0], [0, 65, 1], [10, 45, 0], [10, 60, 0], [0, 50, 1]].map(([ind, wv, k], i) => (
                <div key={i} style={{ marginLeft: ind, ...bar(pct(wv), 7, k === 2 ? 'var(--accent-fill)' : k === 1 ? 'var(--m-bar-strong)' : 'var(--m-bar)') }} />
              ))}
            </div>
            <div style={{ flexGrow: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {code.map(([ind, a, b], i) => (
                <div key={i} style={{ display: 'flex', gap: 6, marginLeft: ind }}>
                  <div style={bar(pct(a), 7, tones[i % 3])} />
                  <div style={bar(pct(b), 7)} />
                </div>
              ))}
            </div>
            <div style={{ width: 170, borderLeft: '2px solid var(--accent-fill)', padding: 12, display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--m-chrome)' }}>
              <span style={{ fontSize: 10, color: 'var(--accent-text)' }}>AGENT</span>
              <div style={{ alignSelf: 'flex-end', ...bar('80%', 34) }} />
              <div style={{ width: '90%', height: 54, border: '1px solid var(--accent-fill)' }} />
              <div style={{ alignSelf: 'flex-end', ...bar('60%', 22) }} />
              <div style={{ marginTop: 'auto', height: 28, border: '1px solid var(--m-frame)' }} />
            </div>
          </div>
        )}
      </Frame>
    );
  } else if (device === 'menubar' || device === 'sliders') {
    const nets: [number, number, string][] = [[55, 3, 'var(--accent-fill)'], [45, 3, 'var(--m-bar)'], [60, 2, 'var(--m-bar)'], [40, 1, 'var(--m-bar)'], [50, 1, 'var(--loud)']];
    inner = (
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', border: '2px solid var(--m-frame)', background: 'var(--m-desk)', overflow: 'hidden' }}>
        <div style={{ height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12, padding: '0 12px', background: 'var(--m-chrome)', borderBottom: '2px solid var(--m-frame)' }}>
          <div style={bar('14px', 10)} />
          <div style={bar('14px', 10)} />
          <div style={{ width: 22, height: 18, background: 'var(--accent-fill)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={bar('10px', 8, 'var(--on-accent)')} />
          </div>
          <div style={bar('14px', 10)} />
          <div style={bar('40px', 10)} />
        </div>
        <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end', padding: '6px 54px 0 0' }}>
          <div style={{ width: 280, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <div style={{ width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid var(--m-frame)', marginRight: 14 }} />
            <div style={{ width: '100%', border: '2px solid var(--m-frame)', background: 'var(--m-screen)', padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                <span>{title}</span>
                <div style={bar('26px', 14, 'var(--accent-fill)')} />
              </div>
              {shot ? (
                <img src={shot} alt="" style={{ width: '100%', height: 220, objectFit: 'cover' }} />
              ) : device === 'menubar' ? (
                nets.map(([wv, on, tag], i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: '1px solid var(--m-bar)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
                      {[5, 9, 14].map((hh, k) => (
                        <div key={k} style={{ width: 3, height: hh, background: k < on ? 'var(--m-frame)' : 'var(--m-bar)' }} />
                      ))}
                    </div>
                    <div style={bar(pct(wv), 8, 'var(--m-bar-strong)')} />
                    <div style={{ marginLeft: 'auto', ...bar('24px', 8, tag) }} />
                  </div>
                ))
              ) : (
                <>
                  {[72, 40, 88, 25, 56].map((k, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 14, height: 14, border: '1px solid var(--m-frame)' }} />
                      <div style={{ flexGrow: 1, position: 'relative', height: 6, background: 'var(--m-bar)' }}>
                        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: pct(k), background: 'var(--accent-fill)' }} />
                        <div style={{ position: 'absolute', left: pct(k), top: -5, width: 10, height: 16, marginLeft: -5, background: 'var(--m-frame)' }} />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <div style={{ flexGrow: 1, height: 26, background: 'var(--accent-fill)' }} />
                    <div style={{ width: 26, height: 26, border: '1px solid var(--m-frame)' }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (device === 'terminal') {
    const out: [number, string][] = [[62, 'var(--m-bar)'], [48, 'var(--m-bar)'], [70, 'rgba(166,227,161,0.5)'], [36, 'var(--m-bar)'], [54, 'rgba(246,180,14,0.45)'], [44, 'var(--m-bar)']];
    inner = (
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', border: '2px solid var(--m-frame)', background: 'var(--m-term)', overflow: 'hidden' }}>
        <div style={{ height: 30, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, padding: '0 12px', background: 'var(--m-chrome)', borderBottom: '2px solid var(--m-frame)', fontSize: 11 }}>
          <Dots />
          <span>{title}</span>
        </div>
        <div style={{ flexGrow: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--m-term-text)' }}>
          <span><span style={{ color: '#F6B40E' }}>$</span> {title} --help</span>
          {out.map(([wv, c], i) => <div key={i} style={bar(pct(wv), 8, c)} />)}
          <span><span style={{ color: '#A6E3A1' }}>✓</span> done</span>
          <span><span style={{ color: '#F6B40E' }}>$</span> <span className="cursor" style={{ display: 'inline-block', width: 9, height: 15, background: 'var(--m-term-text)', verticalAlign: -2 }} /></span>
        </div>
      </div>
    );
  } else {
    inner = (
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', border: '3px solid var(--m-frame)', borderRadius: 34, background: 'var(--m-screen)', overflow: 'hidden', padding: 12 }}>
        <div style={{ alignSelf: 'center', width: 80, height: 20, borderRadius: 10, background: 'var(--m-frame)' }} />
        {shot ? (
          <img src={shot} alt="" style={{ flexGrow: 1, width: '100%', marginTop: 10, borderRadius: 20, objectFit: 'cover' }} />
        ) : (
          <div style={{ flexGrow: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11 }}>{title}</div>
            <div style={{ height: 90, background: 'var(--accent-fill)', padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={bar('50%', 8, 'var(--on-accent)')} />
              <div style={bar('70%', 24, 'var(--on-accent)')} />
            </div>
            {[50, 40, 55, 35, 45].map((v, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--m-bar)' }}>
                <div style={{ width: 24, height: 24, border: '1px solid var(--m-frame)' }} />
                <div style={bar(pct(v), 8, 'var(--m-bar-strong)')} />
                <div style={{ marginLeft: 'auto', ...bar('30px') }} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const box = (
    <div role="img" aria-label={`${title}, ${device} mockup`} className="mono" style={{ width: w, height: h, display: 'flex', flexDirection: 'column', color: 'var(--muted)', flexShrink: 0 }}>
      {inner}
    </div>
  );

  if (scale === 1) return box;
  // Scaled thumbnails: keep the frame out of layout flow so it never widens its parent.
  return (
    <div aria-hidden style={{ position: 'relative', width: '100%', height: Math.round(Math.max(h, 420) * scale) + 24, overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: '50%', top: 16, transform: `translateX(-50%) scale(${scale})`, transformOrigin: 'top center' }}>{box}</div>
    </div>
  );
}
