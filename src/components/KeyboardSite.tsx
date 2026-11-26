'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { fromPath, toPath } from '@/routes';
import type { Experience } from '@/three/experience';

type Mode = 'loading' | 'ready' | 'text';

function webglAvailable() {
  try {
    return !!document.createElement('canvas').getContext('webgl2');
  } catch {
    return false;
  }
}

/**
 * Hosts the 3D keyboard for every page in the (keyboard) group. It lives in
 * the group's layout, so moving between rooms never remounts the scene: the
 * URL changes, this component tells the experience, and the page underneath
 * swaps its text version. Without WebGL, or if the scene fails to start, the
 * text version is the site.
 */
export function KeyboardSite({ children }: { children: React.ReactNode }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const experience = useRef<Experience | null>(null);
  const [mode, setMode] = useState<Mode>('loading');
  const [reading, setReading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!canvas.current || !webglAvailable()) { setMode('text'); return; }
    let cancelled = false;
    import('@/three/experience')
      .then(({ mountExperience }) => mountExperience(canvas.current!, {
        initial: fromPath(location.pathname) ?? { kind: 'home' },
        onNavigate: (route) => router.push(toPath(route), { scroll: false }),
      }))
      .then((exp) => {
        if (cancelled) { exp.dispose(); return; }
        experience.current = exp;
        setMode('ready');
      })
      .catch((err) => {
        console.error('3D keyboard failed to start; showing the text version.', err);
        setMode('text');
      });
    return () => { cancelled = true; experience.current?.dispose(); experience.current = null; };
    // The scene is created once; route changes go through `go` below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { experience.current?.setInteractive(!reading); }, [reading]);

  useEffect(() => {
    const route = fromPath(pathname);
    if (route) experience.current?.go(route);
  }, [pathname]);

  const showText = mode === 'text' || reading;
  return (
    <div className="ks" data-mode={mode}>
      <canvas ref={canvas} className="ks-canvas" aria-hidden="true" />
      {mode === 'loading' && <div className="ks-boot" aria-hidden="true">›_ booting keyboard</div>}
      {mode === 'ready' && (
        <button type="button" className="ks-read" aria-pressed={reading} onClick={() => setReading((r) => !r)}>
          {reading ? 'Back to 3D' : 'Read as text'}
        </button>
      )}
      <main id="main" className={showText ? 'ks-text ks-text-open' : 'ks-text'}>{children}</main>
    </div>
  );
}
