import * as THREE from 'three';
import { sameRoute, type Room, type Route } from '@/routes';
import { createBlink } from './blink';
import { konamiListener, runCommand } from './commands';
import { createDesk } from './desk';
import { createHud } from './hud';
import { easeInOut, fontsReady, keycap, legend, LIME } from './kit';
import { createKeyboard, type Key, type Keyboard } from './keyboard';
import { buildRoom, type RoomContext, type RoomView } from './rooms';
import { createSound } from './sound';
import { createStage } from './stage';
import { THEMES, type Theme } from './themes';

/**
 * The whole 3D site behind one call. It owns the camera, the transitions
 * between the desk and the rooms, and every input (pointer, wheel, touch,
 * keyboard). The URL is the source of truth: the page calls `go` when the
 * route changes, and the experience reports its own moves through
 * `onNavigate`. Calling `go` with the route it is already on does nothing.
 */
export interface Experience {
  go(route: Route): void;
  /** While false, the scene keeps rendering but ignores pointer and keyboard input. */
  setInteractive(on: boolean): void;
  dispose(): void;
}

export interface ExperienceOptions {
  initial: Route;
  onNavigate(route: Route): void;
}

interface Tween {
  t: number;
  duration: number;
  from: [THREE.Vector3, THREE.Vector3];
  /** Fixed [position, target], or 'follow' to land wherever the resting camera is. */
  to: [THREE.Vector3, THREE.Vector3] | 'follow';
  veil?: [number, number];
  hold?: Key;
  done?: () => void;
}

interface Clickable { root: THREE.Object3D; onClick: () => void; key?: Key }

const isCompact = () => innerWidth < 760 || innerWidth / innerHeight < 0.9;
const v3 = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export async function mountExperience(canvas: HTMLCanvasElement, opts: ExperienceOptions): Promise<Experience> {
  await fontsReady();
  const stage = createStage(canvas);
  const { scene, camera } = stage;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sound = createSound();
  let theme: Theme = THEMES.night;

  // ---------------------------------------------------------------- desk
  const home = new THREE.Group();
  scene.add(home);
  const desk = createDesk(theme);
  const hud = createHud(theme);
  const blink = createBlink();
  home.add(desk.group, hud.group, blink.group);

  const clickables = new Map<THREE.Object3D, Clickable>();
  function onClick(obj: THREE.Object3D, fn: () => void, key?: Key) {
    obj.traverse((o) => { if ((o as THREE.Mesh).isMesh || (o as THREE.Sprite).isSprite) clickables.set(o, { root: obj, onClick: fn, key }); });
  }
  function forget(obj: THREE.Object3D) { obj.traverse((o) => clickables.delete(o)); }

  let compact = isCompact();
  let keyboard: Keyboard = mountKeyboard();
  function mountKeyboard(): Keyboard {
    const kb = createKeyboard({ compact, theme });
    home.add(kb.group);
    for (const k of kb.keys) onClick(k.cap, () => open(k), k);
    hud.layout({ width: kb.width, depth: kb.depth, compact, shortcuts: kb.shortcuts }, desk.surfaceY);
    desk.setCompact(compact);
    if (compact) { blink.group.position.set(0, desk.surfaceY + 0.8, kb.depth / 2 + 2.4); blink.group.scale.setScalar(0.85); blink.setBubbleSide('above'); }
    else { blink.group.position.set(8.9, desk.surfaceY + 0.8, -3.3); blink.group.scale.setScalar(1); blink.setBubbleSide('left'); }
    return kb;
  }
  onClick(blink.group, () => {
    const tips = ['Press / and type help.', 'Try typing: hire', 'Psst. Arrow keys, then B A.', 'theme day, theme retro, theme night.', 'I live in the ›_ key.', 'M mutes me. Rude, but allowed.'];
    blink.say(tips[Math.floor(Math.random() * tips.length)]);
  });

  // ---------------------------------------------------------------- rooms
  const rooms = new Map<string, RoomView>();
  const ctx: RoomContext = { leave: () => navigate({ kind: 'home' }, true), open: (r) => navigate(r, true), onClick: (o, fn) => onClick(o, fn) };
  function roomFor(route: Room): RoomView {
    const id = JSON.stringify(route);
    let view = rooms.get(id);
    if (!view) { view = buildRoom(route, ctx); view.group.visible = false; scene.add(view.group); rooms.set(id, view); }
    return view;
  }

  // A small ESC keycap pinned to the lens, so every room has a way out.
  const pinned = keycap({ width: 0.28, depth: 0.19, height: 0.07, color: '#1E2027', print: legend({ glyph: 'ESC', ink: LIME, size: 92, width: 1.5 }) });
  pinned.rotation.x = Math.PI / 2 - 0.35;
  pinned.visible = false;
  camera.add(pinned);
  onClick(pinned, () => navigate({ kind: 'home' }, true));
  // A quad in front of the lens that fills the screen with the room's color mid-flight.
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ color: '#000', transparent: true, opacity: 0, depthTest: false, depthWrite: false, toneMapped: false }));
  veil.position.z = -0.2;
  veil.renderOrder = 999;
  camera.add(veil);

  // ---------------------------------------------------------------- state
  let route: Route = { kind: 'home' };
  let room: RoomView | null = null;
  let busy = false, rgb = false, interactive = true;
  /** A route requested from outside while a transition was running; applied when it lands. */
  let pending: { route: Route; report: boolean } | null = null;
  let scroll = 0, scrollTarget = 0, mx = 0, my = 0, time = reduceMotion ? 99 : 0;
  let tween: Tween | null = null;
  let hovered: Clickable | null = null;
  const look = new THREE.Vector3();

  function deskCamera(pos: THREE.Vector3, target: THREE.Vector3) {
    const ang = 0.9 + my * 0.035, yaw = mx * 0.1;
    let dist: number;
    if (compact) { target.set(0, 0, -0.4); dist = Math.max(14, 9.2 / (0.611 * camera.aspect)); }
    else { target.set(0.2, 0, -2.6); dist = 21 + Math.max(0, 1.7 - camera.aspect) * 18; }
    pos.set(Math.sin(yaw) * dist * Math.cos(ang) + target.x, Math.sin(ang) * dist, Math.cos(yaw) * dist * Math.cos(ang) + target.z);
  }
  function roomCamera(pos: THREE.Vector3, target: THREE.Vector3) {
    const dist = Math.min(34, 19 * Math.max(1, 1.75 / camera.aspect));
    target.set(mx * 0.6, -scroll, 0);
    pos.set(mx * 2.2, -scroll + 0.6 - my * 1.2, dist);
  }
  function restingCamera(pos: THREE.Vector3, target: THREE.Vector3) {
    if (room) roomCamera(pos, target); else deskCamera(pos, target);
  }
  function pinToCorner() {
    const h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 3;
    pinned.position.set((h * camera.aspect) / 2 - 0.36, h / 2 - 0.26, -3);
  }

  function showRoom(next: Room, view: RoomView) {
    if (room) room.group.visible = false;
    home.visible = false;
    view.group.visible = true;
    view.enter(time);
    room = view;
    route = next;
    stage.setBackground(view.bg, false);
    scroll = scrollTarget = 0;
    pinned.visible = true;
  }
  function showDesk() {
    if (room) room.group.visible = false;
    room = null;
    route = { kind: 'home' };
    home.visible = true;
    pinned.visible = false;
    stage.setBackground(theme.bg, true);
  }
  /** Lands softly in the current room or on the desk, from just in front of `from`. */
  function settle(from: [THREE.Vector3, THREE.Vector3], done?: () => void) {
    tween = { t: 0, duration: 1.0, from, to: 'follow', veil: [1, 0], done: () => {
      busy = false;
      done?.();
      const next = pending;
      pending = null;
      if (next) navigate(next.route, next.report);
    } };
  }

  /** Every move goes through here. Moves asked for mid-flight wait until the camera lands. */
  function navigate(next: Route, report: boolean) {
    if (busy) { pending = { route: next, report }; return; }
    if (sameRoute(route, next)) return;
    if (next.kind === 'home') goHome(report);
    else goRoom(next, report);
  }

  function goRoom(next: Room, report: boolean) {
    const view = roomFor(next);
    if (report) opts.onNavigate(next);
    veil.material.color.set(view.accent);
    if (reduceMotion) { showRoom(next, view); restingCamera(camera.position, look); return; }
    busy = true;
    sound.whoosh();
    const key = room ? null : keyboard.keyFor(next);
    if (key) {
      // Fly over the key, then dive into it.
      const k = key.cap.getWorldPosition(new THREE.Vector3());
      const above: [THREE.Vector3, THREE.Vector3] = [k.clone().add(v3(0, 3.2, 1.6)), k.clone()];
      blink.hop(5.5);
      tween = { t: 0, duration: 0.75, from: [camera.position.clone(), look.clone()], to: above, hold: key, done: () => {
        tween = { t: 0, duration: 0.45, from: above, to: [k.clone().add(v3(0, 0.3, 0.02)), k.clone().add(v3(0, -2, 0))], veil: [0, 1], hold: key, done: arrive };
      } };
    } else {
      tween = { t: 0, duration: 0.4, from: [camera.position.clone(), look.clone()], to: [look.clone().add(v3(0, 0, 2)), look.clone()], veil: [0, 1], done: arrive };
    }
    function arrive() {
      showRoom(next, view);
      const p = new THREE.Vector3(), t = new THREE.Vector3();
      roomCamera(p, t);
      settle([t.clone().add(v3(0, 0, 1.2)), t.clone().add(v3(0, 0, -1))]);
    }
  }

  function goHome(report: boolean) {
    if (!room) return;
    const leaving = route as Room;
    const greeting = room.greeting;
    if (report) opts.onNavigate({ kind: 'home' });
    if (reduceMotion) { showDesk(); deskCamera(camera.position, look); return; }
    busy = true;
    sound.whoosh();
    tween = { t: 0, duration: 0.45, from: [camera.position.clone(), look.clone()], to: [look.clone().add(v3(0, 0, 1.5)), look.clone()], veil: [0, 1], done: () => {
      showDesk();
      const key = keyboard.keyFor(leaving);
      const k = key ? key.cap.getWorldPosition(new THREE.Vector3()) : v3(0, 0, 0);
      settle([k.clone().add(v3(0, 0.4, 0.02)), k.clone().add(v3(0, -2, 0))], () => blink.say(greeting, 1800));
    } };
  }

  function applyTheme(next: Theme) {
    theme = next;
    stage.setBackground(theme.bg, true);
    stage.setAmbient(theme.ambient);
    desk.setTheme(theme);
    hud.setTheme(theme);
    keyboard.setTheme(theme);
  }

  /** A key was clicked or typed. */
  function open(key: Key) {
    if (key.route) navigate(key.route, true);
  }

  // ---------------------------------------------------------------- input
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  function pick(e: PointerEvent): Clickable | null {
    const r = canvas.getBoundingClientRect();
    pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(pointer, camera);
    const visible = [...clickables.keys()].filter((o) => { for (let p: THREE.Object3D | null = o; p; p = p.parent) if (!p.visible) return false; return true; });
    const hit = raycaster.intersectObjects(visible, false)[0];
    return hit ? clickables.get(hit.object) ?? null : null;
  }

  let lastHint = 0, touchY: number | null = null, down: Clickable | null = null;
  function onPointerMove(e: PointerEvent) {
    if (!interactive) return;
    mx = (e.clientX / innerWidth) * 2 - 1;
    my = (e.clientY / innerHeight) * 2 - 1;
    if (e.pointerType === 'touch' && touchY !== null && room) { scrollTarget += (touchY - e.clientY) * 0.04; touchY = e.clientY; }
    const hit = pick(e);
    if (hit?.root !== hovered?.root) {
      hovered = hit;
      const hint = hit?.key?.hint;
      if (hint && !room && performance.now() - lastHint > 600) { blink.say(hint, 2600); lastHint = performance.now(); }
    }
    canvas.style.cursor = hit ? 'pointer' : 'default';
  }
  function onPointerDown(e: PointerEvent) {
    if (!interactive) return;
    if (e.pointerType === 'touch') touchY = e.clientY;
    down = pick(e);
    if (down?.key) { keyboard.press(down.key); sound.press(down.key.heavy); }
  }
  function onPointerUp() {
    touchY = null;
    const target = down;
    down = null;
    if (!target) return;
    if (target.key) { keyboard.release(target.key); sound.release(); }
    target.onClick();
  }
  function onWheel(e: WheelEvent) { if (interactive && room) scrollTarget += e.deltaY * 0.012; }

  const konami = konamiListener();
  function onKeyDown(e: KeyboardEvent) {
    if (!interactive) return;
    if ((e.target as HTMLElement | null)?.closest?.('a, button, input, textarea')) return;
    if (konami(e.code)) { rgb = true; keyboard.setRgb(true); blink.dance(3); blink.say('RGB mode unlocked. You are one of us.'); return; }
    if (room) {
      if (e.code === 'Escape' || e.code === 'Backspace') navigate({ kind: 'home' }, true);
      else if (['ArrowDown', 'Space', 'PageDown'].includes(e.code)) { e.preventDefault(); scrollTarget += 6; }
      else if (['ArrowUp', 'PageUp'].includes(e.code)) { e.preventDefault(); scrollTarget -= 6; }
      return;
    }
    if (hud.prompt.open) {
      e.preventDefault();
      const line = hud.type(e);
      if (line !== null) runCommand(line, {
        say: (t) => blink.say(t),
        open: (r) => navigate(r, true),
        setTheme: (name) => applyTheme(THEMES[name]),
        toggleRgb: () => { rgb = !rgb; keyboard.setRgb(rgb); return rgb; },
        dance: () => blink.dance(2.5),
      });
      return;
    }
    if (e.code === 'Slash') { e.preventDefault(); hud.openPrompt(); blink.say('Type a command. Try help.', 2400); return; }
    if (e.code === 'KeyM') { blink.say(sound.toggleMute() ? 'Muted.' : 'Sound on.', 1200); return; }
    const key = keyboard.byCode(e.code);
    if (!key || e.repeat || e.code.startsWith('Arrow')) return;
    if (key.code === 'Space' || key.code === 'Tab') e.preventDefault();
    keyboard.press(key);
    sound.press(key.heavy);
    open(key);
  }
  function onKeyUp(e: KeyboardEvent) {
    const key = keyboard.byCode(e.code);
    if (key) { keyboard.release(key); sound.release(); }
  }
  function onResize() {
    stage.resize();
    pinToCorner();
    if (isCompact() === compact) return;
    compact = isCompact();
    home.remove(keyboard.group);
    forget(keyboard.group);
    keyboard = mountKeyboard();
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerdown', onPointerDown);
  addEventListener('pointerup', onPointerUp);
  addEventListener('wheel', onWheel, { passive: true });
  addEventListener('keydown', onKeyDown);
  addEventListener('keyup', onKeyUp);
  addEventListener('resize', onResize);
  pinToCorner();

  // ---------------------------------------------------------------- loop
  let last = performance.now(), frameId = 0;
  const restP = new THREE.Vector3(), restT = new THREE.Vector3();
  function frame(now: number) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    hud.update(now);

    if (room) {
      scrollTarget = Math.max(0, Math.min(room.maxScroll, scrollTarget));
      scroll += (scrollTarget - scroll) * Math.min(1, dt * 6);
    }
    restingCamera(restP, restT);
    if (tween) {
      tween.t += dt / tween.duration;
      const e = easeInOut(Math.min(1, tween.t));
      const [toP, toT] = tween.to === 'follow' ? [restP, restT] : tween.to;
      camera.position.lerpVectors(tween.from[0], toP, e);
      look.lerpVectors(tween.from[1], toT, e);
      if (tween.veil) veil.material.opacity = tween.veil[0] + (tween.veil[1] - tween.veil[0]) * e;
      if (tween.hold) keyboard.press(tween.hold);
      if (tween.t >= 1) {
        const finished = tween;
        tween = null;
        if (finished.hold) keyboard.release(finished.hold);
        finished.done?.();
      }
    } else {
      camera.position.lerp(restP, Math.min(1, dt * 4));
      look.lerp(restT, Math.min(1, dt * 4));
    }
    camera.lookAt(look);

    if (room) {
      room.update(time, dt, scroll, hovered?.root ?? null, reduceMotion);
    } else {
      keyboard.update(dt, time, hovered?.key ?? null, reduceMotion);
      const gaze = hovered?.key ? hovered.key.cap.getWorldPosition(new THREE.Vector3()) : null;
      blink.update(dt, time, gaze, camera);
    }
    stage.render(dt);
    frameId = requestAnimationFrame(frame);
  }

  // ---------------------------------------------------------------- start
  stage.setBackground(theme.bg, true);
  deskCamera(camera.position, look);
  if (opts.initial.kind !== 'home') {
    const view = roomFor(opts.initial);
    showRoom(opts.initial, view);
    roomCamera(camera.position, look);
  } else {
    setTimeout(() => blink.say(compact ? "Hi, I'm Blink. Tap a colored key." : "Hi, I'm Blink. Press a colored key, or / for commands."), reduceMotion ? 0 : 1600);
  }
  frameId = requestAnimationFrame(frame);

  return {
    go: (next) => navigate(next, false),
    setInteractive(on) { interactive = on; if (!on) { hovered = null; down = null; canvas.style.cursor = 'default'; } },
    dispose() {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerdown', onPointerDown);
      removeEventListener('pointerup', onPointerUp);
      removeEventListener('wheel', onWheel);
      removeEventListener('keydown', onKeyDown);
      removeEventListener('keyup', onKeyUp);
      removeEventListener('resize', onResize);
      stage.dispose();
    },
  };
}

