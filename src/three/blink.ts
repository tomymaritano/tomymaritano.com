import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { canvasTexture, LIME, roundRect, text3d, VIOLET, wrapLines, INK, PAPER } from './kit';

/** Blink's body: a tiny violet terminal with a `›_` face. Static; used on the desk and as decoration. */
export function blinkModel() {
  const body = new THREE.Group();
  const shell = new THREE.Mesh(new RoundedBoxGeometry(1.5, 1.2, 1.0, 5, 0.24), new THREE.MeshStandardMaterial({ color: VIOLET, roughness: 0.3, emissive: VIOLET, emissiveIntensity: 0.05 }));
  shell.castShadow = true;
  const screen = new THREE.Mesh(new RoundedBoxGeometry(1.18, 0.86, 0.08, 3, 0.1), new THREE.MeshStandardMaterial({ color: '#0B0C10', roughness: 0.15, metalness: 0.2 }));
  screen.position.z = 0.48;
  const eye = text3d('›', { size: 0.46, color: LIME, depth: 0.04, glow: 0.5 });
  eye.position.set(-0.38, -0.16, 0.54);
  const cursor = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.07, 0.04), new THREE.MeshBasicMaterial({ color: LIME, toneMapped: false }));
  cursor.position.set(0.14, -0.2, 0.54);
  const legMat = new THREE.MeshStandardMaterial({ color: '#2A2C33', roughness: 0.5 });
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.4, 8), legMat);
  antenna.position.set(0.42, 0.78, 0);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10), new THREE.MeshBasicMaterial({ color: LIME, toneMapped: false }));
  tip.position.set(0.42, 1.0, 0);
  body.add(shell, screen, eye, cursor, antenna, tip);
  body.position.y = 0.06;

  const feet = new THREE.Group();
  const footGeo = new RoundedBoxGeometry(0.32, 0.2, 0.46, 2, 0.06);
  for (const x of [-0.4, 0.4]) {
    const f = new THREE.Mesh(footGeo, legMat);
    f.position.set(x, -0.7, 0.05);
    f.castShadow = true;
    feet.add(f);
  }
  const group = new THREE.Group();
  group.add(body, feet);
  return { group, body, eye, cursor };
}

/** The mascot on the desk: blinks, looks at what you point at, hops, and talks in a bubble. */
export interface Blink {
  group: THREE.Group;
  say(text: string, ms?: number): void;
  hop(strength?: number): void;
  dance(seconds: number): void;
  /** `gaze`: world point to look at, or null to face the camera. */
  update(dt: number, time: number, gaze: THREE.Vector3 | null, camera: THREE.Camera): void;
  /** Where the bubble sits relative to Blink; left of him on the desk, above him on the macropad. */
  setBubbleSide(side: 'left' | 'above'): void;
}

export function createBlink(): Blink {
  const { group, body, eye, cursor } = blinkModel();
  const bubbleCanvas = document.createElement('canvas');
  bubbleCanvas.width = 1024;
  bubbleCanvas.height = 300;
  const bubbleTex = canvasTexture(bubbleCanvas);
  const bubble = new THREE.Sprite(new THREE.SpriteMaterial({ map: bubbleTex, transparent: true, depthTest: false, toneMapped: false, opacity: 0 }));
  bubble.renderOrder = 50;
  bubble.scale.set(4.2, (4.2 * 300) / 1024, 1);
  group.add(bubble);

  let bubbleUntil = 0, bubbleX = -1.4;
  let y = 0, vy = 0, yaw = 0, nextBlink = 2, danceLeft = 0;

  function draw(text: string) {
    const g = bubbleCanvas.getContext('2d')!;
    g.clearRect(0, 0, 1024, 300);
    g.font = '700 46px Inter, sans-serif';
    const lines = wrapLines(g, text, 880).slice(0, 3);
    const h = lines.length * 58 + 60;
    const w = Math.min(1000, Math.max(...lines.map((l) => g.measureText(l).width)) + 80);
    g.fillStyle = PAPER;
    roundRect(g, (1024 - w) / 2, 10, w, h, 34);
    g.fill();
    g.beginPath(); g.moveTo(492, h + 8); g.lineTo(532, h + 8); g.lineTo(512, h + 40); g.fill();
    g.fillStyle = INK;
    g.textBaseline = 'top';
    g.textAlign = 'center';
    lines.forEach((l, i) => g.fillText(l, 512, 40 + i * 58));
    bubbleTex.needsUpdate = true;
  }

  const api: Blink = {
    group,
    say(text, ms = 3600) {
      draw(text);
      bubbleUntil = performance.now() + ms;
      api.hop(2.5);
    },
    hop(strength = 4.5) {
      if (y <= 0.001) vy = strength;
    },
    dance(seconds) {
      danceLeft = seconds;
    },
    setBubbleSide(side) {
      bubbleX = side === 'left' ? -1.4 : 0;
    },
    update(dt, time, gaze, camera) {
      vy -= 18 * dt;
      y = Math.max(0, y + vy * dt);
      if (y === 0) vy = 0;
      if (danceLeft > 0) { danceLeft -= dt; api.hop(4); }

      const p = group.getWorldPosition(new THREE.Vector3());
      const target = gaze ?? camera.position;
      const want = Math.max(-1.3, Math.min(1.3, Math.atan2(target.x - p.x, target.z - p.z)));
      yaw += (want - yaw) * Math.min(1, dt * 6);
      body.position.y = 0.06 + y + Math.sin(time * 2.2) * 0.03;
      body.rotation.y = yaw;
      body.rotation.z = danceLeft > 0 ? Math.sin(time * 14) * 0.2 : 0;

      nextBlink -= dt;
      eye.scale.y = nextBlink < 0.12 ? 0.15 : 1;
      if (nextBlink < 0) nextBlink = 2 + Math.random() * 3;
      cursor.visible = Math.floor(time * 2) % 2 === 0;

      const m = bubble.material;
      m.opacity += ((performance.now() < bubbleUntil ? 1 : 0) - m.opacity) * Math.min(1, dt * 10);
      bubble.position.set(bubbleX, 2.25 + y, 0);
    },
  };
  return api;
}
