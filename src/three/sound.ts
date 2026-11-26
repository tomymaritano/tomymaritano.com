/**
 * Synthesized keyboard sounds. Nothing is loaded: every click is a short
 * burst of filtered noise. The audio context starts on first use, which the
 * browser only allows after a user gesture; before that, sounds are skipped.
 */
export interface Sound {
  /** Key going down. `heavy` for long keys (space, enter). */
  press(heavy?: boolean): void;
  /** Key coming back up. */
  release(): void;
  /** Camera flying into or out of a room. */
  whoosh(): void;
  toggleMute(): boolean;
}

export function createSound(): Sound {
  let ctx: AudioContext | null = null;
  let muted = false;

  function play(build: (a: AudioContext, t: number) => void) {
    if (muted) return;
    try {
      ctx ??= new AudioContext();
      build(ctx, ctx.currentTime);
    } catch {
      // Audio is decoration: a blocked or missing AudioContext must never break input.
    }
  }

  function noise(a: AudioContext, seconds: number, envelope: (x: number) => number) {
    const buf = a.createBuffer(1, Math.ceil(a.sampleRate * seconds), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * envelope(i / d.length);
    const src = a.createBufferSource();
    src.buffer = buf;
    return src;
  }

  return {
    press(heavy = false) {
      play((a, t) => {
        const src = noise(a, 0.06, (x) => Math.pow(1 - x, 7));
        const bp = a.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = (heavy ? 700 : 1100) + Math.random() * 250;
        bp.Q.value = 1.1;
        const g = a.createGain();
        g.gain.value = heavy ? 1.1 : 0.8;
        src.connect(bp).connect(g).connect(a.destination);
        src.start(t);
        const o = a.createOscillator(), og = a.createGain();
        o.frequency.setValueAtTime(heavy ? 95 : 140, t);
        o.frequency.exponentialRampToValueAtTime(40, t + 0.08);
        og.gain.setValueAtTime(0.35, t);
        og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        o.connect(og).connect(a.destination);
        o.start(t);
        o.stop(t + 0.12);
      });
    },
    release() {
      play((a, t) => {
        const src = noise(a, 0.025, (x) => Math.pow(1 - x, 9));
        const hp = a.createBiquadFilter();
        hp.type = 'highpass';
        hp.frequency.value = 3800;
        const g = a.createGain();
        g.gain.value = 0.35;
        src.connect(hp).connect(g).connect(a.destination);
        src.start(t);
      });
    },
    whoosh() {
      play((a, t) => {
        const src = noise(a, 0.9, (x) => Math.sin(Math.PI * x) * 0.5);
        const lp = a.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.setValueAtTime(300, t);
        lp.frequency.exponentialRampToValueAtTime(2600, t + 0.6);
        const g = a.createGain();
        g.gain.value = 0.3;
        src.connect(lp).connect(g).connect(a.destination);
        src.start(t);
      });
    },
    toggleMute() {
      muted = !muted;
      return muted;
    },
  };
}
