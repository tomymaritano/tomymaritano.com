import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { projects, projectByKey, isDarkBrand } from '@/content/projects';
import { sameRoute, type Room } from '@/routes';
import { easeOutBack, keycap, legend, LIME, INK, PAPER, setKeycapLook, clamp01, type Keycap } from './kit';
import type { Theme } from './themes';

/**
 * The keyboard: layout, which key opens which room, and how keys move (the
 * drop-in intro, spring physics, hover lift, glow). On narrow screens it
 * becomes a 3×4 macropad with only the keys that open something.
 */
export interface Key {
  /** KeyboardEvent.code this key answers to. */
  code: string;
  /** Room the key opens, or null for decoration (and ESC). */
  route: Room | null;
  /** What Blink says when the pointer rests on the key. */
  hint: string | null;
  cap: Keycap;
  /** Position on the board, used for neighbor wobble and Blink's gaze. */
  x: number;
  z: number;
  heavy: boolean;
}

/** A section key as the desk legend prints it, e.g. { key: 'TAB', label: 'experience' }. */
export interface Shortcut { key: string; label: string }

export interface Keyboard {
  group: THREE.Group;
  keys: readonly Key[];
  width: number;
  depth: number;
  /** Section keys, in legend order. */
  shortcuts: readonly Shortcut[];
  byCode(code: string): Key | undefined;
  keyFor(route: Room): Key | undefined;
  press(key: Key): void;
  release(key: Key): void;
  setTheme(theme: Theme): void;
  setRgb(on: boolean): void;
  update(dt: number, time: number, hovered: Key | null, reduceMotion: boolean): void;
}

type Slot = [code: string, legend: string, width: number];

const FULL: Slot[][] = [
  [['Escape', 'ESC', 1], ...'1234567890'.split('').map((d): Slot => [`Digit${d}`, d, 1]), ['Minus', '-', 1], ['Equal', '=', 1], ['Backspace', '⌫', 2]],
  [['Tab', 'TAB', 1.5], ...'QWERTYUIOP'.split('').map((k): Slot => [`Key${k}`, k, 1]), ['BracketLeft', '[', 1], ['BracketRight', ']', 1], ['Backslash', '\\', 1.5]],
  [['CapsLock', 'CAPS', 1.75], ...'ASDFGHJKL'.split('').map((k): Slot => [`Key${k}`, k, 1]), ['Semicolon', ';', 1], ['Quote', "'", 1], ['Enter', 'ENTER', 2.25]],
  [['ShiftLeft', 'SHIFT', 2.25], ...'ZXCVBNM'.split('').map((k): Slot => [`Key${k}`, k, 1]), ['Comma', ',', 1], ['Period', '.', 1], ['Slash', '/', 1], ['ShiftRight', 'SHIFT', 2.75]],
  [['ControlLeft', 'CTRL', 1.25], ['AltLeft', 'OPT', 1.25], ['MetaLeft', 'CMD', 1.25], ['Space', '', 6.25], ['MetaRight', 'CMD', 1.25], ['AltRight', 'OPT', 1.25], ['Fn', 'FN', 1.25], ['ControlRight', 'CTRL', 1.25]],
];

/** Macropad: every project key, then the section keys, three per row. */
const PAD: Slot[][] = (() => {
  const slots: Slot[] = [
    ...projects.map((p): Slot => [`Key${p.key}`, p.key, 1]),
    ['Tab', 'TAB', 1], ['CapsLock', 'CAPS', 1], ['Escape', 'ESC', 1], ['Space', '', 1], ['Enter', 'ENTER', 1],
  ];
  const rows: Slot[][] = [];
  for (let i = 0; i < slots.length; i += 3) rows.push(slots.slice(i, i + 3));
  return rows;
})();

const ROW_TILT = [0.12, 0.06, 0, -0.04, -0.07];

/** Keys that open a section rather than a project, and how they look. */
interface Section { route: Room; label: string; padLabel: string; color: string; ink: string; hint: string; legend?: Shortcut }
const SECTIONS: Record<string, Section> = {
  Enter: { route: { kind: 'contact' }, label: 'CONTACT', padLabel: 'HI', color: LIME, ink: INK, hint: 'Say hi.', legend: { key: 'ENTER', label: 'contact' } },
  Space: { route: { kind: 'about' }, label: 'MAKE IT FAIL LOUD', padLabel: '›_', color: '#1E2027', ink: LIME, hint: 'About him. Well, me.', legend: { key: 'SPACE', label: 'about' } },
  Fn: { route: { kind: 'about' }, label: '›_', padLabel: '›_', color: '', ink: LIME, hint: 'About him. Well, me.' },
  Tab: { route: { kind: 'experience' }, label: 'EXP', padLabel: 'EXP', color: PAPER, ink: INK, hint: 'Nine years of shipping. Tab in.', legend: { key: 'TAB', label: 'experience' } },
  CapsLock: { route: { kind: 'projects' }, label: 'PROJECTS', padLabel: 'WORK', color: PAPER, ink: INK, hint: 'Everything he built, in one room.', legend: { key: 'CAPS', label: 'projects' } },
};

interface KeyState extends Key { slot: Slot; row: number; y: number; v: number; lift: number; pressed: boolean; delay: number; baseColor: () => string }

export function createKeyboard(opts: { compact: boolean; theme: Theme }): Keyboard {
  const { compact } = opts;
  let theme = opts.theme;
  let rgb = false;
  const rows = compact ? PAD : FULL;
  const unit = compact ? 1.7 : 1;
  const width = (compact ? 3 : 15) * unit;
  const depth = rows.length * unit;

  const group = new THREE.Group();
  const kase = new THREE.Mesh(new RoundedBoxGeometry(width + 0.9, 0.7, depth + 0.9, 6, 0.25), new THREE.MeshStandardMaterial({ color: theme.case, roughness: 0.4, metalness: 0.55 }));
  kase.position.y = -0.28;
  kase.castShadow = kase.receiveShadow = true;
  const plate = new THREE.Mesh(new RoundedBoxGeometry(width + 0.2, 0.1, depth + 0.2, 3, 0.05), new THREE.MeshStandardMaterial({ color: '#0B0C10', roughness: 0.9 }));
  plate.position.y = 0.08;
  group.add(kase, plate);

  function look(k: KeyState): { color: string; print: THREE.Texture | null } {
    const [code, text, w] = k.slot;
    const project = code.startsWith('Key') ? projectByKey(code.slice(3)) : undefined;
    if (project) {
      const ink = isDarkBrand(project) ? '#FFFFFF' : project.brand.fg;
      return { color: project.brand.color, print: legend({ glyph: project.glyph, sub: project.short, corner: project.key, ink }) };
    }
    const section = SECTIONS[code];
    if (section) {
      const label = compact ? section.padLabel : section.label;
      const wide = code === 'Space' && !compact;
      return {
        color: section.color || theme.mod,
        print: legend({ glyph: label, ink: section.color ? section.ink : LIME, size: wide ? 74 : label.length > 3 ? 52 : 70, width: wide ? 5.6 : Math.max(1, w * 0.9) }),
      };
    }
    if (code === 'Escape') return { color: theme.mod, print: legend({ glyph: 'ESC', ink: theme.modInk, size: 70 }) };
    return { color: w > 1 ? theme.keyWide : theme.key, print: text ? legend({ text, ink: theme.ink, width: Math.max(1, w * 0.9) }) : null };
  }

  const keys: KeyState[] = [];
  rows.forEach((row, r) => {
    let x = -width / 2;
    const z = (r - (rows.length - 1) / 2) * unit;
    for (const slot of row) {
      const [code, , w] = slot;
      const project = code.startsWith('Key') ? projectByKey(code.slice(3)) : undefined;
      const section = SECTIONS[code];
      const cx = x + (w * unit) / 2;
      const k: KeyState = {
        code, slot, row: r, x: cx, z,
        route: project ? { kind: 'project', slug: project.slug } : section?.route ?? null,
        hint: project ? `${project.name}. ${project.blink}` : section?.hint ?? null,
        heavy: w > 1.5,
        cap: keycap({ width: w * unit - 0.1, depth: unit - 0.1, height: compact ? 0.7 : 0.5, color: '#000' }),
        y: 0, v: 0, lift: 0, pressed: false,
        delay: Math.hypot(cx, z) * 0.045 + r * 0.02,
        baseColor: () => '',
      };
      const l = look(k);
      setKeycapLook(k.cap, l.color, l.print);
      k.baseColor = () => look(k).color;
      k.cap.position.set(cx, 0.4, z);
      k.cap.rotation.x = compact ? 0 : ROW_TILT[r];
      group.add(k.cap);
      keys.push(k);
      x += w * unit;
    }
  });
  const byCode = new Map(keys.map((k) => [k.code, k]));
  const state = (k: Key) => k as KeyState;
  const projectCodes = projects.map((p) => `Key${p.key}`);
  const tmp = new THREE.Color();

  return {
    group, keys, width, depth,
    shortcuts: ['Tab', 'CapsLock', 'Space', 'Enter'].map((c) => SECTIONS[c].legend!),
    byCode: (code) => byCode.get(code),
    keyFor: (route) => keys.find((k) => k.route && sameRoute(k.route, route)),
    press(key) {
      const k = state(key);
      k.pressed = true;
      k.v -= 2.5;
      for (const n of keys) {
        const d = Math.hypot(n.x - k.x, n.z - k.z);
        if (n !== k && d < 1.6) n.v -= 1.1 * (1 - d / 1.6);
      }
    },
    release(key) {
      state(key).pressed = false;
    },
    setTheme(t) {
      theme = t;
      (kase.material as THREE.MeshStandardMaterial).color.set(t.case);
      for (const k of keys) { const l = look(k); setKeycapLook(k.cap, l.color, l.print); }
    },
    setRgb(on) {
      rgb = on;
      if (!on) for (const k of keys) k.cap.userData.body.material.emissive.set(k.baseColor());
    },
    update(dt, time, hovered, reduceMotion) {
      for (const k of keys) {
        k.lift += ((hovered === k ? 1 : 0) - k.lift) * Math.min(1, dt * 14);
        const target = k.lift * 0.14 - (k.pressed ? 0.26 : 0);
        k.v += ((target - k.y) * 520 - k.v * 24) * dt;
        k.y += k.v * dt;
        const drop = reduceMotion ? 0 : (1 - easeOutBack(clamp01((time - k.delay) / 0.7))) * 7;
        k.cap.position.y = 0.4 + drop + k.y;
        const mat = k.cap.userData.body.material;
        let glow = (k.route ? 0.12 : 0.04) * k.lift + (k.pressed ? 0.18 : 0);
        if (rgb && !k.route) {
          tmp.setHSL((((k.x * 0.04 + k.z * 0.03 - time * 0.35) % 1) + 1) % 1, 0.9, 0.5);
          mat.emissive.copy(tmp);
          glow = 0.3;
        }
        mat.emissiveIntensity = glow;
      }
      // Idle: the project keys take turns breathing so first-time visitors see what to press.
      if (!reduceMotion && !rgb && time > 2.5) {
        const k = byCode.get(projectCodes[Math.floor(time / 1.6) % projectCodes.length]);
        const s = Math.sin(((time % 1.6) / 1.6) * Math.PI);
        if (k) { const m = k.cap.userData.body.material; m.emissiveIntensity = Math.max(m.emissiveIntensity, s * 0.12); }
      }
    },
  };
}
