import Link from 'next/link';
import { Blink } from './Blink';

export function SiteFooter() {
  return (
    <footer className="wrap" style={{ marginTop: 72, paddingBottom: 48 }}>
      <div className="panel title-block" style={{ fontSize: 12 }}>
        <div>
          <span>DRAWN BY</span>
          <span>T. MARITANO © {new Date().getFullYear()}</span>
        </div>
        <div>
          <span>BUILT WITH</span>
          <span>Next.js · MDX · no trackers · no WebGL</span>
        </div>
        <div style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Blink pose="sleep" cell={2} decorative />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="muted">EASTER EGG</span>
            <Link href="/this-page-does-not-exist">Visit /404 to watch Blink fail loud</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
