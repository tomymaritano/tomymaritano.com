import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { LIME } from './kit';

/**
 * Renderer, scene, camera, lights and the post-processing chain. The stage
 * also watches its own frame rate and drops to a cheaper look on slow
 * machines, so callers never think about quality.
 */
export interface Stage {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Fill light; brighter for light desk themes. */
  setAmbient(intensity: number): void;
  /** Solid background; `fog` fades the far edge of the desk into it. */
  setBackground(color: string, fog: boolean): void;
  render(dt: number): void;
  resize(): void;
  dispose(): void;
}

const GRAIN_SHADER = {
  uniforms: { tDiffuse: { value: null }, time: { value: 0 }, amount: { value: 0.045 }, vignette: { value: 0.32 } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float time, amount, vignette; varying vec2 vUv;
    float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    void main(){ vec4 c = texture2D(tDiffuse, vUv); float n = rand(vUv * vec2(1731.0, 977.0) + fract(time)) - 0.5;
      c.rgb += n * amount; float d = distance(vUv, vec2(0.5)); c.rgb *= 1.0 - vignette * smoothstep(0.38, 0.9, d); gl_FragColor = c; }`,
};

export function createStage(canvas: HTMLCanvasElement): Stage {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#08090C');
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.3;

  const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 200);
  scene.add(camera);

  const hemi = new THREE.HemisphereLight('#d4d6ea', '#20222a', 0.35);
  const sun = new THREE.DirectionalLight('#ffffff', 1.5);
  sun.position.set(-6, 14, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 12, bottom: -12, near: 1, far: 50 });
  sun.shadow.bias = -0.0004;
  const rim = new THREE.PointLight(LIME, 7, 24, 2);
  rim.position.set(8, 3, -7);
  scene.add(hemi, sun, rim);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.12, 0.4, 1.1);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grain = new ShaderPass(GRAIN_SHADER);
  composer.addPass(grain);

  // Adaptive quality: measure 120 frames after the intro, then decide once.
  let frames = 0, elapsed = 0, time = 0;
  function settleQuality(dt: number) {
    if (frames >= 120) return;
    if (time < 1.5) return;
    frames++;
    elapsed += dt;
    if (frames === 120 && elapsed / 120 > 1 / 38) {
      bloom.enabled = grain.enabled = false;
      renderer.shadowMap.enabled = false;
      renderer.setPixelRatio(1);
      resize();
    }
  }

  function resize() {
    const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  return {
    scene, camera,
    setAmbient(intensity) { hemi.intensity = intensity; },
    setBackground(color, fog) {
      (scene.background as THREE.Color).set(color);
      scene.fog = fog ? new THREE.Fog(color, 34, 70) : null;
    },
    render(dt) {
      time += dt;
      grain.uniforms.time.value = time;
      settleQuality(dt);
      composer.render(dt);
    },
    resize,
    dispose() {
      composer.dispose();
      pmrem.dispose();
      renderer.dispose();
    },
  };
}
