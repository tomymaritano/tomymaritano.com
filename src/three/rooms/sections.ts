import * as THREE from 'three';
import { aiWork, experience, profile, skills } from '@/content/profile';
import { isDarkBrand, projects, PROJECTS_INTRO } from '@/content/projects';
import { blinkModel } from '../blink';
import { INK, keycap, legend, LIME, PAPER, text3d, textPlane, type TextPlane } from '../kit';
import { actionKey, addExits, addFloaters, finishRoom, withMotion, type RoomContext, type RoomView } from './shared';

/** The four rooms that are not a single project: about, experience, the projects index and contact. */

const GREY = '#9A9DA6';
const SOFT = '#B5B7BE';

function place<T extends THREE.Object3D>(room: THREE.Group, o: T, x: number, y: number, z = 0): T {
  o.position.set(x, y, z);
  room.add(o);
  return o;
}

function eyebrow(text: string, color = '#6C6F78') {
  return textPlane(text, { width: 6, px: 26, color, weight: 700, letterSpacing: 3 });
}

export function buildAboutRoom(ctx: RoomContext): RoomView {
  const room = new THREE.Group();
  place(room, eyebrow('SPACE  ·  ABOUT'), -9.5, 4.8);
  ['MAKE IT', 'FAIL', 'LOUD.'].forEach((t, i) => place(room, text3d(t, { size: 2.1, color: i === 2 ? LIME : PAPER, glow: i === 2 ? 0.12 : 0.05 }), -9.5, 2.4 - i * 2.4, -i * 0.6));
  place(room, textPlane(profile.bio, { width: 6.6, px: 32, color: SOFT, lineHeight: 1.5 }), 2.0, 3.6, 0.5);
  const mini = blinkModel().group;
  mini.scale.setScalar(1.6);
  place(room, withMotion(mini, { sway: true }), 7.2, -2.4, -1);
  place(room, textPlane('SCROLL ↓  SKILLS AND HOW I WORK WITH AI', { width: 9, px: 24, color: LIME, weight: 700, letterSpacing: 3 }), -9.5, -4.6);

  place(room, text3d('SKILLS', { size: 1.3, color: PAPER, glow: 0.04 }), -9.5, -9.5);
  skills.forEach(({ group, items }, i) => {
    const x = -9.5 + (i % 3) * 6.6, y = -11.6 - Math.floor(i / 3) * 3.2;
    place(room, textPlane(group.toUpperCase(), { width: 6, px: 26, color: LIME, weight: 700, letterSpacing: 2 }), x, y);
    place(room, textPlane(items, { width: 6, px: 28, color: SOFT, lineHeight: 1.45 }), x, y - 0.45);
  });

  place(room, text3d('HOW I WORK WITH AI', { size: 1.1, color: PAPER, glow: 0.04 }), -9.5, -23.5);
  let y = -25;
  for (const line of aiWork) {
    const t = place(room, textPlane(`—  ${line}`, { width: 18, px: 32, color: SOFT, lineHeight: 1.4 }), -9.5, y);
    y -= t.height + 0.5;
  }
  addExits(room, ctx, y - 2.2, LIME, INK, false);
  addFloaters(room, '✦', LIME, 18, { width: 34, top: 8, height: 40 });
  return finishRoom(room, { bg: '#101116', accent: LIME, greeting: "That's him. I mean, me. Long story.", maxScroll: -y - 1.5 });
}

export function buildExperienceRoom(ctx: RoomContext): RoomView {
  const room = new THREE.Group();
  const first = experience[experience.length - 1].year;
  place(room, eyebrow('TAB  ·  EXPERIENCE'), -9.5, 4.8);
  place(room, text3d('EXPERIENCE', { size: 1.75, color: PAPER, glow: 0.04 }), -9.5, 2.4);
  place(room, text3d(`${first} — NOW`, { size: 1.75, color: LIME, glow: 0.1 }), -9.5, 0.2, -0.4);
  place(room, textPlane('From client websites in Buenos Aires to leading engineering on an AI clinical platform. Copenhagen, Andorra and a few startups in between.', { width: 9, px: 32, color: SOFT, lineHeight: 1.45 }), -9.5, -2.2);
  place(room, eyebrow('SCROLL ↓', LIME), -9.5, -4.6);

  const top = -9;
  let y = top;
  experience.forEach((job, i) => {
    place(room, text3d(job.year, { size: 1.3, color: i === 0 ? LIME : PAPER, glow: i === 0 ? 0.1 : 0.03 }), -9.5, y - 1.1);
    place(room, new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 12), new THREE.MeshBasicMaterial({ color: LIME, toneMapped: false })), -4.1, y - 0.5);
    place(room, text3d(job.role.toUpperCase(), { size: 0.62, color: PAPER, depth: 0.1, glow: 0.03 }), -3.4, y - 0.8);
    let row = y - 1.15;
    const stack = (t: TextPlane, gap: number) => { place(room, t, -3.4, row); row -= t.height + gap; };
    stack(textPlane(`${job.company}   ·   ${job.meta}`, { width: 13, px: 28, color: LIME, weight: 600 }), 0.15);
    if (job.path) stack(textPlane(job.path, { width: 13, px: 26, color: '#8A8D96', weight: 600 }), 0.15);
    stack(textPlane(job.mission, { width: 13, px: 32, color: PAPER, weight: 600, lineHeight: 1.35 }), 0.2);
    stack(textPlane(job.highlights.map((h) => `—  ${h}`).join('\n'), { width: 13, px: 28, color: '#A5A8B0', lineHeight: 1.5 }), 0);
    y = Math.min(y - 4.2, row - 1.6);
  });
  place(room, new THREE.Mesh(new THREE.BoxGeometry(0.05, top - y, 0.05), new THREE.MeshBasicMaterial({ color: '#2A2C33' })), -4.1, (top + y) / 2, -0.05);
  addExits(room, ctx, y - 1.5, PAPER, INK, false);
  addFloaters(room, '✦', LIME, 14, { width: 34, top: 8, height: 60 });
  return finishRoom(room, { bg: '#0B0C10', accent: PAPER, greeting: 'Every job, every year.', maxScroll: -y - 1 });
}

export function buildProjectsRoom(ctx: RoomContext): RoomView {
  const room = new THREE.Group();
  place(room, eyebrow('CAPS  ·  PROJECTS'), -9.5, 5.5);
  const title = place(room, text3d('PROJECTS', { size: 1.1, color: PAPER, glow: 0.04 }), -9.5, 4.0);
  place(room, text3d(`(${String(projects.length).padStart(2, '0')})`, { size: 1.1, color: LIME, glow: 0.1 }), -9.5 + title.userData.width + 0.4, 4.0);
  place(room, textPlane(PROJECTS_INTRO, { width: 8, px: 30, color: GREY }), -9.5, 3.35);

  const perRow = 4;
  projects.forEach((p, i) => {
    const row = Math.floor(i / perRow), col = i % perRow;
    const inRow = Math.min(perRow, projects.length - row * perRow);
    const tile = new THREE.Group();
    const cap = keycap({ width: 2.4, depth: 2.4, height: 0.8, color: p.brand.color, print: legend({ glyph: p.glyph, corner: p.key, ink: isDarkBrand(p) ? '#FFFFFF' : p.brand.fg, size: 140 }) });
    cap.rotation.x = 1.1;
    tile.add(cap);
    const name = textPlane(p.name, { width: 4.6, px: 44, color: PAPER, weight: 800, family: '"Inter Tight"', align: 'center' });
    name.position.y = -1.55;
    const meta = textPlane(`${p.category}  ·  ${p.status}`, { width: 4.6, px: 22, color: '#8A8D96', weight: 600, align: 'center' });
    meta.position.y = -2.2;
    tile.add(name, meta);
    if (p.featured) {
      const badge = textPlane('FEATURED', { width: 2, px: 20, color: LIME, weight: 800, letterSpacing: 3, align: 'center' });
      badge.position.y = 1.75;
      tile.add(badge);
    }
    place(room, withMotion(tile, { float: true, hoverLift: true }), (col - (inRow - 1) / 2) * 5, row === 0 ? 1.2 : -3.3);
    ctx.onClick(tile, () => ctx.open({ kind: 'project', slug: p.slug }));
  });
  addExits(room, ctx, -7.4, PAPER, INK, false);
  return finishRoom(room, { bg: '#0D0E12', accent: PAPER, greeting: 'Everything he built.', maxScroll: 2.5 });
}

export function buildContactRoom(ctx: RoomContext): RoomView {
  const room = new THREE.Group();
  place(room, eyebrow('ENTER  ·  CONTACT', 'rgba(0,0,0,0.55)'), -9.5, 5);
  ["LET'S BUILD", 'SOMETHING', 'LOUD.'].forEach((t, i) => place(room, text3d(t, { size: 1.85, color: INK, glow: 0 }), -9.5, 2.6 - i * 2.2, -i * 0.4));
  const links = [{ label: 'EMAIL', url: `mailto:${profile.email}` }, ...profile.links.map((l) => ({ label: l.label.toUpperCase(), url: l.url }))];
  links.forEach(({ label, url }, i) => {
    const key = actionKey(ctx, { label: label + (url ? ' ↗' : ''), color: INK, ink: url ? LIME : PAPER, width: 3.2 }, () => {
      if (!url) return;
      if (url.startsWith('mailto:')) location.href = url;
      else window.open(url, '_blank', 'noopener');
    });
    place(room, withMotion(key, { float: true }), -6.2 + i * 3.7, -4.6, 1.2);
  });
  const missing = profile.links.filter((l) => !l.url).map((l) => l.label);
  const note = `${profile.email}  ·  ${profile.location}.` + (missing.length ? `  [${missing.join(', ')}] still need their links.` : '');
  place(room, textPlane(note, { width: 11, px: 26, color: 'rgba(0,0,0,0.6)', weight: 600 }), -6.8, -6.3, 1);
  addFloaters(room, '✦', INK, 14, { width: 34, top: 8, height: 18 });
  return finishRoom(room, { bg: LIME, accent: LIME, greeting: 'Say hi. He answers.', maxScroll: 0 });
}
