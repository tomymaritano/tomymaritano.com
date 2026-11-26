import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { Font, type FontData } from 'three/examples/jsm/loaders/FontLoader.js';
import fontData from './font/inter-tight-900.json';

/**
 * The building blocks every 3D surface is made of: type (flat and extruded),
 * keycaps and cards. Text is drawn to canvases with the page's web fonts, so
 * call `fontsReady()` once before building anything that prints text.
 */

export const LIME = '#D7F25A';
export const VIOLET = '#8B5CFF';
export const INK = '#0A0B0D';
export const PAPER = '#F2F0EA';

const FONT = new Font(fontData as unknown as FontData);
const PIXELS_PER_UNIT = 128;

export async function fontsReady(): Promise<void> {
  const faces = ['900 40px "Inter Tight"', '800 40px "Inter Tight"', '500 40px Inter', '600 40px Inter', '700 40px Inter'];
  const timeout = new Promise<void>((r) => setTimeout(r, 2500));
  // A font that fails to load is not fatal: canvases fall back to system-ui, which is readable, just off-brand.
  await Promise.race([Promise.all(faces.map((f) => document.fonts.load(f))).then(() => undefined), timeout]).catch(() => undefined);
}

export function canvasTexture(c: HTMLCanvasElement): THREE.CanvasTexture {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

export function wrapLines(g: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const out: string[] = [];
  for (const paragraph of text.split('\n')) {
    let line = '';
    for (const word of paragraph.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (g.measureText(next).width > maxWidth && line) { out.push(line); line = word; } else line = next;
    }
    out.push(line);
  }
  return out;
}

export function roundRect(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.roundRect(x, y, w, h, r);
}

export interface TextOptions {
  /** Width in world units; text wraps to it. */
  width?: number;
  px?: number;
  weight?: number;
  family?: string;
  color?: string;
  lineHeight?: number;
  align?: 'left' | 'center';
  letterSpacing?: number;
}

/** Flat text in 3D space. Origin is the top-left corner (top-center when centered). */
export type TextPlane = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> & { height: number };

export function textPlane(text: string, o: TextOptions = {}): TextPlane {
  const width = o.width ?? 6, px = o.px ?? 40, lh = o.lineHeight ?? 1.3;
  const font = `${o.weight ?? 500} ${px}px ${o.family ?? 'Inter'}, system-ui, sans-serif`;
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  c.width = Math.min(4096, Math.round(width * PIXELS_PER_UNIT));
  g.font = font;
  const lines = wrapLines(g, text, c.width - 4);
  c.height = Math.ceil(lines.length * px * lh + px * 0.3);
  g.font = font;
  g.fillStyle = o.color ?? PAPER;
  g.textBaseline = 'top';
  g.textAlign = o.align === 'center' ? 'center' : 'left';
  if (o.letterSpacing) g.letterSpacing = `${o.letterSpacing}px`;
  lines.forEach((l, i) => g.fillText(l, o.align === 'center' ? c.width / 2 : 2, i * px * lh + px * 0.1));
  const height = (c.height / c.width) * width;
  const geo = new THREE.PlaneGeometry(width, height);
  geo.translate(o.align === 'center' ? 0 : width / 2, -height / 2, 0);
  const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: canvasTexture(c), transparent: true, toneMapped: false, depthWrite: false }));
  return Object.assign(mesh, { height });
}

/** Extruded type in Inter Tight Black. Origin is the baseline, left/center/right per `align`. */
export function text3d(str: string, o: { size?: number; depth?: number; color?: string; glow?: number; align?: 'left' | 'center' | 'right' } = {}) {
  const size = o.size ?? 1, depth = o.depth ?? size * 0.28;
  const geo = new TextGeometry(str, { font: FONT, size, depth, curveSegments: 6, bevelEnabled: true, bevelThickness: depth * 0.12, bevelSize: size * 0.01, bevelSegments: 2 });
  geo.computeBoundingBox();
  const bb = geo.boundingBox!, w = bb.max.x - bb.min.x;
  const dx = o.align === 'center' ? -bb.min.x - w / 2 : o.align === 'right' ? -bb.max.x : -bb.min.x;
  geo.translate(dx, 0, -depth / 2);
  const col = new THREE.Color(o.color ?? PAPER);
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, roughness: 0.38, metalness: 0.05, emissive: col, emissiveIntensity: o.glow ?? 0.06 }));
  mesh.castShadow = mesh.receiveShadow = true;
  mesh.userData.width = w;
  return mesh as THREE.Mesh<TextGeometry, THREE.MeshStandardMaterial> & { userData: { width: number } };
}

const legendCache = new Map<string, THREE.CanvasTexture>();

/**
 * The print on top of a keycap. A `glyph` legend is big and centered (with an
 * optional `sub` line and `corner` letter); a `text` legend sits top-left like
 * a regular key.
 */
export function legend(o: { ink: string; glyph?: string; text?: string; sub?: string; corner?: string; size?: number; width?: number }): THREE.CanvasTexture {
  const key = JSON.stringify(o);
  const cached = legendCache.get(key);
  if (cached) return cached;
  const c = document.createElement('canvas');
  const w = Math.round(256 * (o.width ?? 1));
  c.width = w; c.height = 256;
  const g = c.getContext('2d')!;
  g.fillStyle = o.ink;
  g.textBaseline = 'middle';
  if (o.glyph !== undefined) {
    g.textAlign = 'center';
    g.font = `800 ${o.size ?? 118}px "Inter Tight", Inter, sans-serif`;
    g.fillText(o.glyph, w / 2, o.sub ? 112 : 128);
    if (o.sub) { g.font = '800 30px Inter, sans-serif'; g.globalAlpha = 0.85; g.fillText(o.sub, w / 2, 210); }
    if (o.corner) { g.globalAlpha = 0.7; g.textAlign = 'left'; g.font = '700 38px Inter, sans-serif'; g.fillText(o.corner, 30, 44); }
  } else if (o.text) {
    g.textAlign = 'left';
    g.font = `700 ${o.text.length > 2 ? 40 : 64}px Inter, sans-serif`;
    g.fillText(o.text, 34, 58);
  }
  const t = canvasTexture(c);
  legendCache.set(key, t);
  return t;
}

/** Tapered keycap walls, like a real sculpted profile. */
function keycapGeometry(w: number, h: number, d: number) {
  const g = new RoundedBoxGeometry(w, h, d, 4, Math.min(w, d) * 0.14);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const t = (p.getY(i) + h / 2) / h;
    p.setX(i, (p.getX(i) * (w - 2 * 0.07 * t)) / w);
    p.setZ(i, (p.getZ(i) * (d - 2 * 0.1 * t)) / d);
  }
  g.computeVertexNormals();
  return g;
}

export interface Keycap extends THREE.Group {
  userData: { body: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>; print: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> };
}

export function keycap(o: { width?: number; depth?: number; height?: number; color: string; print?: THREE.Texture | null }): Keycap {
  const group = new THREE.Group() as Keycap;
  const w = o.width ?? 0.9, d = o.depth ?? 0.9, h = o.height ?? 0.5;
  const col = new THREE.Color(o.color);
  const body = new THREE.Mesh(keycapGeometry(w, h, d), new THREE.MeshStandardMaterial({ color: col, roughness: 0.34, emissive: col, emissiveIntensity: 0 }));
  body.castShadow = body.receiveShadow = true;
  const print = new THREE.Mesh(
    new THREE.PlaneGeometry(Math.max(w * 0.72, w - 0.2), Math.max(d * 0.7, d - 0.26)),
    new THREE.MeshBasicMaterial({ map: o.print ?? null, transparent: true, toneMapped: false, visible: !!o.print }),
  );
  print.rotation.x = -Math.PI / 2;
  print.position.y = h / 2 + 0.003;
  group.add(body, print);
  group.userData = { body, print };
  return group;
}

export function setKeycapLook(cap: Keycap, color: string, print: THREE.Texture | null) {
  const { body, print: p } = cap.userData;
  body.material.color.set(color);
  body.material.emissive.set(color);
  p.material.map = print;
  p.material.visible = !!print;
  p.material.needsUpdate = true;
}

/** A slab with an eyebrow, a big title and a body that wraps; height grows with the text. */
export function card(o: { eyebrow: string; title: string; body: string; bg: string; fg: string; accent: string; width?: number }) {
  const W = o.width ?? 10, SCALE = 140;
  const m = document.createElement('canvas').getContext('2d')!;
  m.font = '900 100px "Inter Tight", Inter, sans-serif';
  const titleLines = wrapLines(m, o.title.toUpperCase(), W * SCALE - 112);
  m.font = '500 44px Inter, sans-serif';
  const bodyLines = wrapLines(m, o.body, W * SCALE - 112);
  const H = Math.max(3.6, (120 + titleLines.length * 100 + 34 + bodyLines.length * 62 + 70) / SCALE);
  const c = document.createElement('canvas');
  c.width = Math.round(W * SCALE); c.height = Math.round(H * SCALE);
  const g = c.getContext('2d')!;
  g.fillStyle = o.bg; roundRect(g, 0, 0, c.width, c.height, 36); g.fill();
  g.textBaseline = 'top';
  g.fillStyle = o.accent; g.font = '700 34px Inter, sans-serif'; g.fillText(o.eyebrow, 56, 56);
  g.fillStyle = o.fg; g.font = '900 100px "Inter Tight", Inter, sans-serif';
  let y = 112;
  for (const l of titleLines) { g.fillText(l, 56, y); y += 100; }
  g.globalAlpha = 0.8; g.font = '500 44px Inter, sans-serif'; y += 34;
  for (const l of bodyLines) { g.fillText(l, 56, y); y += 62; }
  const slab = new THREE.Group();
  const box = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.18, 4, 0.08), new THREE.MeshStandardMaterial({ color: o.bg, roughness: 0.5 }));
  box.castShadow = true;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: canvasTexture(c), transparent: true, toneMapped: false }));
  face.position.z = 0.091;
  slab.add(box, face);
  return slab;
}

export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const easeOutBack = (x: number) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
