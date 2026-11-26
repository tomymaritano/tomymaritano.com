import * as THREE from 'three';
import { profile } from '@/content/profile';
import { canvasTexture, LIME, text3d, textPlane } from './kit';
import type { Shortcut } from './keyboard';
import type { Theme } from './themes';

/**
 * The words on the desk: the 3D title behind the keyboard, the intro line,
 * and the strip in front of it, which shows the key legend and the clock, or
 * a command prompt while you type a `/` command.
 */
export interface Hud {
  group: THREE.Group;
  setTheme(theme: Theme): void;
  /** Re-lays everything out around a keyboard of this size. */
  layout(board: { width: number; depth: number; compact: boolean; shortcuts: readonly Shortcut[] }, surfaceY: number): void;
  readonly prompt: { open: boolean; text: string };
  openPrompt(): void;
  closePrompt(): void;
  /** Applies one keystroke to the prompt. Returns the submitted line on Enter. */
  type(e: KeyboardEvent): string | null;
  update(nowMs: number): void;
}

const MAX_COMMAND = 40;

export function createHud(initial: Theme): Hud {
  let theme = initial, compact = false;
  let shortcuts: readonly Shortcut[] = [];
  const group = new THREE.Group();

  const title = new THREE.Group();
  const [first, second] = profile.roleLines.map((w) => w.toUpperCase());
  const l1 = text3d(first, { size: 1.0, color: theme.title, glow: 0.04 });
  const l2 = text3d(second, { size: 1.0, color: theme.title, glow: 0.04 });
  const l3 = text3d('PRESS A KEY', { size: 1.0, color: LIME, glow: 0.1 });
  l1.position.y = 3.8; l2.position.y = 2.55; l3.position.y = 1.3;
  title.add(l1, l2, l3);
  title.rotation.x = -0.42;
  group.add(title);

  let intro: THREE.Mesh | null = null;
  function buildIntro() {
    if (intro) { group.remove(intro); intro.geometry.dispose(); }
    intro = textPlane(profile.homeLine, { width: 6.3, px: 32, color: theme.sub, lineHeight: 1.45 });
    intro.rotation.x = -1.0;
    intro.visible = !compact;
    intro.position.set(1.4, 0.75, -3.75);
    group.add(intro);
  }
  buildIntro();

  const stripCanvas = document.createElement('canvas');
  stripCanvas.width = 3072;
  stripCanvas.height = 96;
  const stripTex = canvasTexture(stripCanvas);
  const strip = new THREE.Mesh(new THREE.PlaneGeometry(16, 0.5), new THREE.MeshBasicMaterial({ map: stripTex, transparent: true, toneMapped: false, depthWrite: false }));
  strip.rotation.x = -Math.PI / 2;
  group.add(strip);

  const prompt = { open: false, text: '' };
  let lastDraw = 0;

  function clock() {
    const now = new Date();
    const local = new Date(now.getTime() + (now.getTimezoneOffset() + profile.timezone.offsetMinutes) * 60000);
    return [local.getHours(), local.getMinutes(), local.getSeconds()].map((v) => String(v).padStart(2, '0')).join(':');
  }

  function drawStrip(nowMs: number) {
    const g = stripCanvas.getContext('2d')!;
    g.clearRect(0, 0, 3072, 96);
    g.textBaseline = 'middle';
    g.font = '600 40px Inter, sans-serif';
    g.textAlign = 'right';
    g.fillStyle = theme.ink;
    g.fillText(`${clock()}  ${profile.timezone.label} · ${profile.country.toUpperCase()}`, 3068, 48);
    g.textAlign = 'left';
    if (prompt.open) {
      g.font = '700 48px "Inter Tight", Inter, sans-serif';
      g.fillStyle = LIME;
      g.fillText('›_', 4, 48);
      g.fillStyle = theme.title;
      g.fillText(prompt.text + (Math.floor(nowMs / 500) % 2 ? '█' : ' '), 80, 48);
    } else {
      g.fillStyle = theme.ink;
      const legendText = [...shortcuts.map((s) => `${s.key}  ${s.label}`), '/  commands', 'M  sound'].join('     ');
      g.fillText(compact ? 'TAP A KEY  ·  TAP BLINK' : legendText, 4, 48);
    }
    stripTex.needsUpdate = true;
    lastDraw = nowMs;
  }

  return {
    group,
    prompt,
    setTheme(t) {
      theme = t;
      for (const m of [l1.material, l2.material]) { m.color.set(t.title); m.emissive.set(t.title); m.emissiveIntensity = t.title === '#16171C' ? 0 : 0.04; }
      buildIntro();
      drawStrip(performance.now());
    },
    layout(board, surfaceY) {
      compact = board.compact;
      shortcuts = board.shortcuts;
      const half = board.depth / 2;
      if (intro) intro.visible = !compact;
      if (compact) {
        title.scale.setScalar(0.42);
        title.position.set(-2.75, 0.2, -half - 1.4);
        strip.scale.setScalar(0.4);
        strip.position.set(0, surfaceY + 0.01, half + 0.95);
      } else {
        title.scale.setScalar(1);
        title.position.set(-7.6, 0.2, -4.2);
        strip.scale.setScalar(1);
        strip.position.set(0, surfaceY + 0.01, 3.9);
      }
      drawStrip(performance.now());
    },
    openPrompt() { prompt.open = true; prompt.text = ''; drawStrip(performance.now()); },
    closePrompt() { prompt.open = false; prompt.text = ''; drawStrip(performance.now()); },
    type(e) {
      let submitted: string | null = null;
      if (e.code === 'Escape') { prompt.open = false; prompt.text = ''; }
      else if (e.code === 'Enter') { submitted = prompt.text; prompt.open = false; prompt.text = ''; }
      else if (e.code === 'Backspace') prompt.text = prompt.text.slice(0, -1);
      else if (e.key.length === 1 && prompt.text.length < MAX_COMMAND) prompt.text += e.key;
      drawStrip(performance.now());
      return submitted;
    },
    update(nowMs) {
      if (nowMs - lastDraw > (prompt.open ? 250 : 1000)) drawStrip(nowMs);
    },
  };
}
