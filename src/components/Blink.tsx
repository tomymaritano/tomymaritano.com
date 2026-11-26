import type { CSSProperties } from 'react';

export type Pose = 'idle' | 'wave' | 'error' | 'ship' | 'sleep' | 'think';

const BASE = [
  '.......YY.......',
  '.......YY.......',
  '.......KK.......',
  '..KKKKKKKKKKKK..',
  '.KKKKKKKKKKKKKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKSSSSSSSSSSKK.',
  '.KKKKKKKKKKKKKK.',
  '..KKKKKKKKKKKK..',
  '....KK....KK....',
  '....KK....KK....',
];

type P = [number, number];
const FACES: Record<Pose, P[]> = {
  idle: [[6, 4], [7, 5], [8, 6], [9, 5], [10, 4], [10, 8], [10, 9], [10, 10]],
  wave: [[8, 4], [7, 5], [8, 6], [8, 9], [7, 10], [8, 11]],
  error: [[6, 7], [6, 8], [7, 7], [7, 8], [8, 7], [8, 8], [10, 7], [10, 8]],
  ship: [[8, 4], [9, 5], [10, 6], [9, 7], [8, 8], [7, 9], [6, 10]],
  sleep: [],
  think: [[8, 4], [8, 5], [8, 7], [8, 8], [8, 10], [8, 11]],
};
const ARM_L: P[] = [[1, 0], [2, 0], [3, 0], [4, 0]];
const ARM_R: P[] = [[1, 15], [2, 15], [3, 15], [4, 15]];
const SCREEN: Record<Pose, string> = { idle: '#74ACDF', wave: '#74ACDF', think: '#74ACDF', error: '#FF6B97', ship: '#F6B40E', sleep: '#2A2F57' };
const LABEL: Record<Pose, string> = {
  idle: 'Blink, idle',
  wave: 'Blink waving',
  error: 'Blink failing loud, red screen and arms up',
  ship: 'Blink shipping, yellow screen with a check',
  sleep: 'Blink asleep',
  think: 'Blink thinking',
};

function sprite(pose: Pose) {
  const g = BASE.map((r) => r.split(''));
  const put = (list: P[], ch: string) => list.forEach(([r, c]) => (g[r][c] = ch));
  put(FACES[pose], 'E');
  if (pose === 'wave') put(ARM_R, 'K');
  if (pose === 'error' || pose === 'ship') {
    put(ARM_L, 'K');
    put(ARM_R, 'K');
  }
  if (pose === 'sleep') {
    put([[8, 4], [8, 5], [8, 6], [8, 9], [8, 10], [8, 11]], 'L');
    put([[0, 12], [0, 13], [0, 14], [1, 13], [2, 12], [2, 13], [2, 14]], 'K');
  }
  return g;
}

export function Blink({
  pose = 'idle',
  cell = 20,
  body = 'var(--fg)',
  glass = false,
  assemble = false,
  decorative = false,
  style,
}: {
  pose?: Pose;
  cell?: number;
  body?: string;
  /** Transparent screen with a Sol face: the blueprint logo version. */
  glass?: boolean;
  /** Pixels pop in diagonally on mount. */
  assemble?: boolean;
  decorative?: boolean;
  style?: CSSProperties;
}) {
  const clear = glass && (pose === 'idle' || pose === 'wave' || pose === 'think');
  const pal: Record<string, string> = {
    '.': 'transparent',
    K: body,
    S: clear ? 'transparent' : SCREEN[pose],
    E: clear ? '#F6B40E' : '#0E1128',
    L: '#74ACDF',
    Y: pose === 'error' ? '#FF6B97' : pose === 'sleep' ? '#5C6185' : '#F6B40E',
  };
  const g = sprite(pose);
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : LABEL[pose]}
      aria-hidden={decorative || undefined}
      style={{ display: 'grid', gridTemplateColumns: `repeat(16, ${cell}px)`, gridAutoRows: `${cell}px`, width: cell * 16, height: cell * 16, ...style }}
    >
      {g.flatMap((row, r) =>
        row.map((ch, c) => (
          <div
            key={`${r}-${c}`}
            style={{
              background: pal[ch] ?? 'transparent',
              animation: assemble && ch !== '.' ? `pbIn .22s ${(r + c) * 28}ms steps(2) both` : undefined,
            }}
          />
        )),
      )}
    </div>
  );
}
