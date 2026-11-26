import Link from 'next/link';
import { Blink } from './Blink';
import { ThemeSwitch } from './ThemeSwitch';

const LINKS = [
  { key: 'writing', label: '/writing', href: '/writing' },
  { key: 'builds', label: '/builds', href: '/builds' },
  { key: 'now', label: '/now', href: '/now' },
];

export function SiteHeader({ active }: { active?: 'writing' | 'builds' | 'now' }) {
  return (
    <header className="wrap" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingTop: 24, paddingBottom: 24 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }} aria-label="tomymaritano, home">
          <Blink pose="idle" cell={2} decorative />
          <span className="pixel" style={{ fontWeight: 700, fontSize: 20 }}>
            tomymaritano
          </span>
        </Link>
        <span className="mono muted" style={{ fontSize: 12 }}>
          <span className="pulse" style={{ color: '#A6E3A1' }}>●</span> NOW: designing Vela
        </span>
      </div>
      <nav aria-label="Main" className="mono" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 22, fontSize: 14 }}>
        {LINKS.map((l) => (
          <Link
            key={l.key}
            href={l.href}
            aria-current={active === l.key ? 'page' : undefined}
            style={{ color: active === l.key ? 'var(--accent-text)' : 'var(--fg)', borderBottom: `2px solid ${active === l.key ? 'var(--accent-text)' : 'transparent'}`, paddingBottom: 2 }}
          >
            {l.label}
          </Link>
        ))}
        <a href="https://github.com/tomymaritano">/github ↗</a>
        <ThemeSwitch />
      </nav>
      <div style={{ flexBasis: '100%', height: 1, background: 'var(--line)' }} />
    </header>
  );
}
