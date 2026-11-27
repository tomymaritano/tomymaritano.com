import * as THREE from 'three';
import { canvasTexture, LIME } from './kit';
import type { Theme } from './themes';

/** The props around the keyboard: wooden desk, a lamp with a warm spot, a mug. */
export interface Desk {
  group: THREE.Group;
  /** Height of the desk surface; everything stands on it. */
  surfaceY: number;
  setTheme(theme: Theme): void;
  /** On narrow screens the lamp and mug would crowd the macropad. */
  setCompact(compact: boolean): void;
}

const SURFACE_Y = -0.63;

function woodTexture(base: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 1024;
  const g = c.getContext('2d')!;
  const col = new THREE.Color(base);
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * 1024;
    g.strokeStyle = `#${col.clone().offsetHSL(0, 0, (Math.random() - 0.5) * 0.08).getHexString()}`;
    g.globalAlpha = 0.5;
    g.lineWidth = 1 + Math.random() * 3;
    g.beginPath();
    g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x * 0.004 + i) * 6);
    g.stroke();
  }
  const t = canvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 2);
  return t;
}

function buildLamp() {
  const lamp = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: '#1C1D22', roughness: 0.3, metalness: 0.8 });
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1.1, 0.2, 40), metal);
  base.position.y = 0.1;
  const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 5, 12), metal);
  arm1.position.set(0.6, 2.5, 0);
  arm1.rotation.z = -0.25;
  const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 4, 12), metal);
  arm2.position.set(2.6, 5, 0.4);
  arm2.rotation.z = -1.25;
  const head = new THREE.Mesh(new THREE.ConeGeometry(0.85, 1.3, 40, 1, true), new THREE.MeshStandardMaterial({ color: '#1C1D22', roughness: 0.3, metalness: 0.8, side: THREE.DoubleSide }));
  head.position.set(4.4, 4.6, 0.6);
  head.rotation.z = 0.6;
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 12), new THREE.MeshBasicMaterial({ color: '#FFE7B8', toneMapped: false }));
  bulb.position.set(4.6, 4.2, 0.6);
  for (const m of [base, arm1, arm2, head]) m.castShadow = true;
  lamp.add(base, arm1, arm2, head, bulb);
  lamp.position.set(-14.2, SURFACE_Y, -6.5);
  return lamp;
}

function buildMug() {
  const mug = new THREE.Group();
  const ceramic = new THREE.MeshStandardMaterial({ color: '#1E2027', roughness: 0.25 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.56, 1.3, 40), ceramic);
  body.position.y = 0.65;
  body.castShadow = true;
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.625, 0.62, 0.18, 40), new THREE.MeshStandardMaterial({ color: LIME, roughness: 0.3, emissive: LIME, emissiveIntensity: 0.03 }));
  band.position.y = 0.95;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.08, 12, 30), ceramic);
  handle.position.set(0.68, 0.68, 0);
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.54, 32), new THREE.MeshStandardMaterial({ color: '#2A160B', roughness: 0.15 }));
  coffee.rotation.x = -Math.PI / 2;
  coffee.position.y = 1.2;
  mug.add(body, band, handle, coffee);
  mug.position.set(-11, SURFACE_Y, 2.8);
  return mug;
}

export function createDesk(theme: Theme): Desk {
  const group = new THREE.Group();
  const top = new THREE.Mesh(new THREE.PlaneGeometry(90, 60), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.62, map: woodTexture(theme.desk) }));
  top.rotation.x = -Math.PI / 2;
  top.position.y = SURFACE_Y;
  top.receiveShadow = true;

  const lamp = buildLamp();
  const spot = new THREE.SpotLight('#FFD39A', theme.lamp, 34, 0.62, 0.55, 1.6);
  spot.position.set(-9.6, 3.9, -5.9);
  spot.target.position.set(-1.5, 0, 0.5);
  spot.castShadow = true;
  spot.shadow.mapSize.set(1024, 1024);
  spot.shadow.bias = -0.0006;
  const mug = buildMug();
  group.add(top, lamp, spot, spot.target, mug);

  return {
    group,
    surfaceY: SURFACE_Y,
    setTheme(t) {
      const mat = top.material as THREE.MeshStandardMaterial;
      mat.map?.dispose();
      mat.map = woodTexture(t.desk);
      mat.needsUpdate = true;
      spot.intensity = t.lamp;
    },
    setCompact(compact) {
      lamp.visible = mug.visible = !compact;
    },
  };
}
