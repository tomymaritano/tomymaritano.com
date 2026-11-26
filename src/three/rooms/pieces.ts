import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import type { Project } from '@/content/projects';
import { LIME, text3d } from '../kit';

/**
 * One signature object per project, keyed by slug: a rate chart for
 * DólarGaucho, a waveform for Dripnex, and so on. Each builder adds its
 * meshes to the room and returns the function that animates them.
 */
type Animate = (time: number, scroll: number) => void;
type Builder = (room: THREE.Group, p: Project) => Animate;

const glowing = (color: string, glow = 0.08) => new THREE.MeshStandardMaterial({ color, roughness: 0.35, emissive: color, emissiveIntensity: glow });

const PIECES: Record<string, Builder> = {
  dolargaucho(room, p) {
    const bars = Array.from({ length: 9 }, (_, i) => {
      const g = new THREE.BoxGeometry(0.55, 1, 0.55);
      g.translate(0, 0.5, 0);
      const b = new THREE.Mesh(g, glowing(i === 8 ? LIME : p.brand.color, i === 8 ? 0.15 : 0.06));
      b.position.set(0.6 + i * 0.95, -5.2, -6.5);
      b.castShadow = true;
      room.add(b);
      return b;
    });
    return (t) => bars.forEach((b, i) => { b.scale.y = 1 + i * 0.75 + Math.sin(t * 1.4 + i * 0.7) * 0.45; });
  },

  dripnex(room, p) {
    const bars = Array.from({ length: 40 }, (_, i) => {
      const b = new THREE.Mesh(new RoundedBoxGeometry(0.16, 1, 0.16, 2, 0.06), glowing(p.brand.color));
      b.position.set(-10 + i * 0.52, -5.0, -3);
      room.add(b);
      return b;
    });
    return (t) => bars.forEach((b, i) => { b.scale.y = 0.2 + Math.abs(Math.sin(t * 3.1 + i * 0.45) * Math.sin(t * 1.3 + i * 0.13)) * 2.6; });
  },

  vela(room, p) {
    const tag = text3d('</>', { size: 1.3, color: p.brand.color, glow: 0.12 });
    tag.position.set(6.6, -4.2, 0.5);
    room.add(tag);
    const lengths = [3.2, 2.1, 4.0, 1.4, 2.8, 3.6];
    const total = lengths.reduce((a, b) => a + b, 0);
    const lines = lengths.map((len, i) => {
      const g = new THREE.BoxGeometry(1, 0.16, 0.1);
      g.translate(0.5, 0, 0);
      const m = new THREE.Mesh(g, glowing(i % 3 === 1 ? LIME : p.brand.color, 0.1));
      m.position.set(1.0 + (i % 2) * 0.5, -3.4 - i * 0.32, 1);
      room.add(m);
      return { m, len };
    });
    const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.3, 0.1), new THREE.MeshBasicMaterial({ color: LIME, toneMapped: false }));
    room.add(cursor);
    return (t) => {
      let budget = Math.min(1, (t * 0.35) % 1.4) * total;
      let last = lines[0].m;
      for (const { m, len } of lines) {
        const s = Math.max(0.001, Math.min(len, budget));
        budget -= len;
        m.scale.x = s;
        if (s > 0.01) last = m;
      }
      cursor.position.set(last.position.x + last.scale.x + 0.12, last.position.y, 1);
      cursor.visible = Math.floor(t * 3) % 2 === 0;
      tag.rotation.y = Math.sin(t * 0.8) * 0.4;
    };
  },

  airtime(room, p) {
    const rings = [0.7, 1.3, 1.9].map((r) => {
      const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.12, 10, 48, Math.PI / 2), glowing(p.brand.color));
      m.rotation.z = Math.PI / 4;
      m.position.set(8.8, -4.2, 0.4);
      room.add(m);
      return m;
    });
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 12), glowing(p.brand.color, 0.2));
    dot.position.set(8.8, -4.2, 0.4);
    room.add(dot);
    return (t) => rings.forEach((m, i) => {
      const phase = (t * 1.2 - i * 0.3) % 1.2;
      m.material.emissiveIntensity = phase > 0 && phase < 0.5 ? 0.35 : 0.04;
    });
  },

  'ambient-mixer'(room, p) {
    const N = 260;
    const drops = new THREE.InstancedMesh(new THREE.BoxGeometry(0.025, 0.55, 0.025), new THREE.MeshBasicMaterial({ color: p.brand.fg, transparent: true, opacity: 0.4 }), N);
    const seeds = Array.from({ length: N }, () => [(Math.random() - 0.5) * 34, Math.random() * 20, -1 - Math.random() * 12, 6 + Math.random() * 6]);
    room.add(drops);
    const knobs = [0, 1, 2].map((i) => {
      const k = new THREE.Group();
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.4, 36), glowing(i === 1 ? p.brand.color : '#2A1810'));
      const mark = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.05, 0.4), new THREE.MeshBasicMaterial({ color: LIME, toneMapped: false }));
      mark.position.set(0, 0.23, -0.22);
      k.add(c, mark);
      k.position.set(7.4 + i * 1.35, -4.4, 1.4);
      k.rotation.x = 0.9;
      room.add(k);
      return k;
    });
    const m4 = new THREE.Matrix4();
    return (t, scroll) => {
      seeds.forEach(([x, y0, z, speed], i) => {
        m4.makeTranslation(x, 8 - scroll - ((y0 + t * speed) % 20), z);
        drops.setMatrixAt(i, m4);
      });
      drops.instanceMatrix.needsUpdate = true;
      knobs.forEach((k, i) => { k.rotation.y = Math.sin(t * 0.6 + i * 2) * 1.2; });
    };
  },

  plumbline(room, p) {
    const pivot = new THREE.Group();
    pivot.position.set(-0.7, 7.6, 1.2);
    const string = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 7.4, 6), new THREE.MeshStandardMaterial({ color: p.brand.fg }));
    string.position.y = -3.7;
    const bob = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.2, 32), glowing(p.brand.color));
    bob.rotation.x = Math.PI;
    bob.position.y = -7.8;
    bob.castShadow = true;
    pivot.add(string, bob);
    room.add(pivot);
    return (t) => { pivot.rotation.z = Math.sin(t * 1.3) * 0.1; };
  },

  minipix(room, p) {
    const palette = [p.brand.color, p.brand.fg, '#3A2A12', LIME];
    const pixels = Array.from({ length: 36 }, (_, i) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), new THREE.MeshStandardMaterial({ color: p.brand.color, roughness: 0.4 }));
      m.position.set(7.2 + (i % 6) * 0.5, -5.0 + Math.floor(i / 6) * 0.5, 0.6);
      room.add(m);
      return m;
    });
    return (t) => pixels.forEach((m, i) => {
      const v = Math.sin(t * 1.6 + (i % 6) * 0.7 + Math.floor(i / 6) * 1.1);
      m.material.color.set(palette[v > 0.6 ? 1 : v > 0 ? 0 : v > -0.7 ? 2 : 3]);
      m.rotation.y = v > 0.9 ? (v - 0.9) * 15 : 0;
    });
  },
};

/** Adds the project's signature piece, if it has one. */
export function addPiece(room: THREE.Group, p: Project): Animate | undefined {
  return PIECES[p.slug]?.(room, p);
}
