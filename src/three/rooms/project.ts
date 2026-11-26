import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { isDarkBrand, STAR_STEPS, type Project } from '@/content/projects';
import { canvasTexture, card, keycap, legend, roundRect, text3d, textPlane, wrapLines } from '../kit';
import { addPiece } from './pieces';
import { addExits, addFloaters, finishRoom, withMotion, type RoomContext, type RoomView } from './shared';

/**
 * A project's room. Everything in it wears the project's brand: hero with a
 * device showing the product, then the case study (situation, task, action,
 * result) on cards you scroll through, then the results.
 */

function screenTexture(p: Project) {
  const wide = p.device === 'window';
  const dark = isDarkBrand(p);
  const c = document.createElement('canvas');
  c.width = wide ? 1280 : 640;
  c.height = wide ? 800 : 1280;
  const g = c.getContext('2d')!;
  g.fillStyle = p.brand.bg;
  g.fillRect(0, 0, c.width, c.height);
  const pad = wide ? 60 : 48;
  let y = wide ? 100 : 90;
  if (wide) ['#FF5F57', '#FEBC2E', '#28C840'].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(40 + i * 34, 34, 11, 0, 7); g.fill(); });
  g.fillStyle = p.brand.color;
  g.beginPath(); g.arc(pad + 34, y + 34, 34, 0, 7); g.fill();
  g.fillStyle = dark ? '#FFFFFF' : p.brand.bg;
  g.font = '800 38px "Inter Tight", Inter, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(p.glyph, pad + 34, y + 36);
  g.textAlign = 'left';
  g.fillStyle = p.brand.fg;
  g.font = '800 40px "Inter Tight", Inter, sans-serif';
  g.fillText(p.name, pad + 90, y + 36);
  y += 120;
  g.font = `800 ${wide ? 54 : 50}px "Inter Tight", Inter, sans-serif`;
  for (const l of wrapLines(g, p.tagline, c.width - pad * 2)) { g.fillText(l, pad, y); y += wide ? 62 : 60; }
  y += 30;
  const rowWidth = c.width - pad * 2;
  const step = Math.min(wide ? 92 : 116, (c.height - y - (wide ? 20 : 230)) / p.screen.length);
  const rowHeight = step - 16;
  p.screen.forEach(([label, value], i) => {
    g.fillStyle = dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)';
    roundRect(g, pad, y, rowWidth, rowHeight, 22); g.fill();
    g.fillStyle = p.brand.fg; g.font = '600 30px Inter, sans-serif';
    g.fillText(label, pad + 28, y + rowHeight / 2);
    g.textAlign = 'right';
    g.fillStyle = i === 1 ? p.brand.color : p.brand.fg;
    g.font = '800 32px "Inter Tight", Inter, sans-serif';
    g.fillText(value, pad + rowWidth - 28, y + rowHeight / 2);
    g.textAlign = 'left';
    y += step;
  });
  if (!wide) {
    g.fillStyle = p.brand.color;
    roundRect(g, pad, c.height - 200, rowWidth, 110, 55); g.fill();
    g.fillStyle = dark ? '#fff' : p.brand.bg;
    g.font = '800 34px Inter, sans-serif'; g.textAlign = 'center';
    g.fillText('[SCREENSHOT]', c.width / 2, c.height - 145);
  }
  return canvasTexture(c);
}

function device(p: Project) {
  const wide = p.device === 'window';
  const w = wide ? 9.2 : 3.9, h = wide ? 5.75 : 7.8;
  const group = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w + 0.3, h + 0.3, 0.32, 6, wide ? 0.2 : 0.55), new THREE.MeshStandardMaterial({ color: isDarkBrand(p) ? '#0A0A10' : '#16161C', roughness: 0.25, metalness: 0.6 }));
  body.castShadow = true;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: screenTexture(p), toneMapped: false }));
  screen.position.z = 0.165;
  group.add(body, screen);
  group.position.set(wide ? 4.4 : 4.8, 0.1, -1);
  group.rotation.set(0.04, -0.32, 0.02);
  return withMotion(group, { float: true });
}

export function buildProjectRoom(p: Project, ctx: RoomContext): RoomView {
  const dark = isDarkBrand(p);
  const ink = dark ? '#FFFFFF' : p.brand.fg;
  const muted = dark ? 'rgba(255,255,255,0.62)' : 'rgba(0,0,0,0.58)';
  const room = new THREE.Group();
  const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z = 0) => { o.position.set(x, y, z); room.add(o); return o; };

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity: dark ? 0.5 : 0.18 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  at(ground, 0, -5.2);

  // Hero
  at(textPlane(`KEY ${p.key}  ·  ${p.category.toUpperCase()}  ·  ${p.status.toUpperCase()}`, { width: 9, px: 26, color: muted, weight: 700, letterSpacing: 2 }), -9.5, 4.6);
  at(text3d(p.name, { size: Math.min(1.7, 9.4 / (p.name.length * 0.9)), color: p.brand.fg, glow: dark ? 0.06 : 0 }), -9.5, 2.5);
  at(textPlane(p.tagline, { width: 8.5, px: 54, color: p.brand.fg, weight: 800, family: '"Inter Tight"', lineHeight: 1.12 }), -9.5, 1.6);
  [p.brand.bg, p.brand.color, p.brand.fg].forEach((color, i) => {
    const chip = new THREE.Mesh(new RoundedBoxGeometry(0.9, 0.9, 0.2, 3, 0.12), new THREE.MeshStandardMaterial({ color, roughness: 0.3 }));
    chip.castShadow = true;
    at(chip, -9 + i * 1.15, -0.6, 0.2);
  });
  at(textPlane(`Everything in this room wears ${p.name}'s brand, not mine.`, { width: 8, px: 24, color: muted }), -9.5, -1.9);
  at(textPlane('SCROLL ↓  THE CASE STUDY', { width: 6, px: 24, color: p.brand.color, weight: 700, letterSpacing: 3 }), -9.5, -3.2);
  room.add(device(p));
  const cap = keycap({ width: 2.6, depth: 2.6, height: 1.1, color: p.brand.color, print: legend({ glyph: p.glyph, corner: p.key, ink, size: 140 }) });
  cap.rotation.set(0.7, -0.4, 0.15);
  cap.scale.setScalar(0.8);
  at(withMotion(cap, { spin: true }), -0.4, -3.9, -1.2);

  // Case study
  at(textPlane(`ROLE  ${p.role.toUpperCase()}     STACK  ${p.stack.toUpperCase()}     STATUS  ${p.status.toUpperCase()}`, { width: 20, px: 24, color: muted, weight: 700, letterSpacing: 2, align: 'center' }), 0, -7.4);
  STAR_STEPS.forEach((step, i) => {
    const odd = i % 2 === 1;
    const c = card({
      eyebrow: `0${i + 1} · ${step.toUpperCase()}`, title: p.star[step].title, body: p.star[step].body,
      bg: odd ? p.brand.color : '#FFFFFF', fg: odd ? ink : '#0A0B0D', accent: odd ? ink : p.brand.color,
    });
    c.rotation.set(0, odd ? -0.12 : 0.12, odd ? 0.02 : -0.02);
    at(withMotion(c, { float: true }), odd ? 1.6 : -1.6, -13 - i * 8);
  });

  // Results
  const resultsY = -45;
  at(textPlane('RESULTS', { width: 6, px: 26, color: muted, weight: 700, letterSpacing: 3, align: 'center' }), 0, resultsY + 3.2);
  p.results.forEach(({ value, label }, i) => {
    at(text3d(value, { size: value.length > 4 ? 1.4 : 1.9, color: p.brand.color, align: 'center', glow: 0.1 }), (i - 1) * 6.5, resultsY);
    at(textPlane(label, { width: 5.5, px: 34, color: dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.72)', weight: 600, align: 'center' }), (i - 1) * 6.5, resultsY - 0.5);
  });

  addExits(room, ctx, resultsY - 4, p.brand.color, ink, true);
  addFloaters(room, p.glyph, p.brand.color, 22, { width: 34, top: 8, height: 55 });
  const piece = addPiece(room, p);
  return finishRoom(room, { bg: p.brand.bg, accent: p.brand.color, greeting: 'Welcome back.', maxScroll: 45, piece });
}
