'use client';

import { useEffect, useState } from 'react';

export type Theme = 'blueprint' | 'pixel' | 'paper';
const THEMES: Theme[] = ['blueprint', 'pixel', 'paper'];

export const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: light)').matches?'paper':'blueprint'}document.documentElement.dataset.theme=t}catch(e){}})();`;

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>('blueprint');

  useEffect(() => {
    const t = document.documentElement.dataset.theme as Theme | undefined;
    if (t && THEMES.includes(t)) setTheme(t);
  }, []);

  const pick = (t: Theme) => {
    setTheme(t);
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem('theme', t);
    } catch {}
  };

  return (
    <div role="group" aria-label="Theme" style={{ display: 'flex', border: '1px solid var(--line)' }}>
      {THEMES.map((t) => {
        const on = t === theme;
        return (
          <button
            key={t}
            type="button"
            aria-pressed={on}
            onClick={() => pick(t)}
            className="pixel"
            style={{ minHeight: 44, padding: '0 12px', border: 'none', fontSize: 12, cursor: 'pointer', background: on ? 'var(--accent-fill)' : 'transparent', color: on ? 'var(--on-accent)' : 'var(--fg)' }}
          >
            {t.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
