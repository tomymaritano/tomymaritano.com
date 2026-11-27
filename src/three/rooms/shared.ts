import * as THREE from 'three';
import type { Room } from '@/routes';
import { clamp01, easeOutBack, keycap, legend, INK, PAPER } from '../kit';

/** What a room can ask of the experience that hosts it. */
export interface RoomContext {
  /** Back to the keyboard. */
  leave(): void;
  /** Straight into another room. */
  open(route: Room): void;
  /** Make every mesh in `obj` respond to clicks; hovering lifts it if it is a room child marked `hoverLift`. */
  onClick(obj: THREE.Object3D, fn: () => void): void;
}

export interface RoomView {
  group: THREE.Group;
  bg: string;
  /** Color the screen flashes while you fall into the room. */
  accent: string;
  /** How far down the camera can scroll. */
  maxScroll: number;
  /** What Blink says when you come back from this room. */
  greeting: string;
  /** Restart the build-in animation. */
  enter(time: number): void;
  update(time: number, dt: number, scroll: number, hovered: THREE.Object3D | null, reduceMotion: boolean): void;
}

/** Per-object motion, set on a room's direct children through userData. */
export interface Motion { float?: boolean; spin?: boolean; sway?: boolean; hoverLift?: boolean }

export function withMotion<T extends THREE.Object3D>(obj: T, motion: Motion): T {
  Object.assign(obj.userData, motion);
  return obj;
}

/**
 * Wraps a built room: children pop in one after another on enter, then keep
 * their idle motion. `piece` animates the room's signature object, if any.
 */
export function finishRoom(group: THREE.Group, o: { bg: string; accent: string; greeting: string; maxScroll: number; piece?: (time: number, scroll: number) => void }): RoomView {
  let enteredAt = 0;
  const base = new Map<THREE.Object3D, { scale: THREE.Vector3; y: number; z: number }>();
  for (const c of group.children) base.set(c, { scale: c.scale.clone(), y: c.position.y, z: c.position.z });
  return {
    group, bg: o.bg, accent: o.accent, greeting: o.greeting, maxScroll: o.maxScroll,
    enter(time) { enteredAt = time; },
    update(time, dt, scroll, hovered, reduceMotion) {
      const since = time - enteredAt;
      group.children.forEach((c, i) => {
        const b = base.get(c);
        if (!b) return;
        const p = reduceMotion ? 1 : clamp01((since - Math.min(i, 20) * 0.03) / 0.7);
        c.scale.copy(b.scale).multiplyScalar(Math.max(0.0001, easeOutBack(p)));
        if (reduceMotion) return;
        const m = c.userData as Motion;
        if (m.float) c.position.y = b.y + Math.sin(time * 0.9 + b.y) * 0.12;
        if (m.spin) { c.rotation.y += dt * 0.35; c.rotation.z = 0.15 + Math.sin(time) * 0.06; }
        if (m.sway) c.rotation.y = Math.sin(time * 0.8) * 0.5;
        if (m.hoverLift) c.position.z += ((hovered === c ? b.z + 0.9 : b.z) - c.position.z) * Math.min(1, dt * 10);
        if (c instanceof THREE.Sprite) c.material.rotation = Math.sin(time * 0.5 + b.y) * 0.4;
      });
      if (!reduceMotion) o.piece?.(time, scroll);
    },
  };
}

/** Glyphs drifting in the background of a room. */
export function addFloaters(group: THREE.Group, glyph: string, color: string, count: number, area: { width: number; top: number; height: number }) {
  const map = legend({ glyph, ink: color, size: 150 });
  for (let i = 0; i < count; i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, opacity: 0.3 + Math.random() * 0.35, depthWrite: false }));
    const size = 0.4 + Math.random() * 1.1;
    s.scale.set(size, size, 1);
    s.position.set((Math.random() - 0.5) * area.width, area.top - Math.random() * area.height, -2 - Math.random() * 10);
    group.add(s);
  }
}

/** A wide keycap you press to act; it faces the camera. */
export function actionKey(ctx: RoomContext, o: { label: string; color: string; ink: string; width?: number }, onPress: () => void) {
  const width = o.width ?? 6;
  const key = keycap({ width, depth: 1.3, height: 0.5, color: o.color, print: legend({ glyph: o.label, ink: o.ink, size: width < 4 ? 64 : 96, width }) });
  key.rotation.x = 1.2;
  ctx.onClick(key, onPress);
  return key;
}

/** The exit row at the bottom of a room: back to the keyboard, plus "all projects" inside a project. */
export function addExits(group: THREE.Group, ctx: RoomContext, y: number, color: string, ink: string, withAllProjects: boolean) {
  const back = actionKey(ctx, { label: '← BACK TO THE KEYBOARD', color, ink }, ctx.leave);
  back.position.set(withAllProjects ? -3.4 : 0, y, 0.5);
  group.add(back);
  if (withAllProjects) {
    const all = actionKey(ctx, { label: 'ALL PROJECTS →', color: PAPER, ink: INK }, () => ctx.open({ kind: 'projects' }));
    all.position.set(3.4, y, 0.5);
    group.add(all);
  }
}
