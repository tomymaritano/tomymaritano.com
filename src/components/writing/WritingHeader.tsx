import Link from 'next/link';
import { sections, toPath } from '@/routes';

export function WritingHeader() {
  return (
    <header className="w-header">
      <Link href="/" className="w-logo"><span>›_</span> tomymaritano</Link>
      <nav aria-label="Main">
        {sections.map((s) => <Link key={s.label} href={toPath(s.route)}>{s.label}</Link>)}
        <Link href="/writing">Writing</Link>
      </nav>
    </header>
  );
}
