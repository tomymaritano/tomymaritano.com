/** Desk themes, switchable with the `theme` command. Rooms keep their own brands. */
export interface Theme {
  bg: string;
  desk: string;
  case: string;
  key: string;
  /** Wide keys (shift, caps…) are a shade apart. */
  keyWide: string;
  mod: string;
  ink: string;
  modInk: string;
  title: string;
  sub: string;
  lamp: number;
  ambient: number;
}

export const THEMES = {
  night: { bg: '#08090C', desk: '#17140F', case: '#15161B', key: '#1A1B21', keyWide: '#22242B', mod: '#2A2C33', ink: '#8A8D96', modInk: '#F2F0EA', title: '#F2F0EA', sub: '#9A9DA6', lamp: 70, ambient: 0.35 },
  day: { bg: '#E4E0D6', desk: '#B9A88E', case: '#C9C3B8', key: '#EDEAE3', keyWide: '#D8D3C8', mod: '#C8C2B6', ink: '#5A5C63', modInk: '#16171C', title: '#16171C', sub: '#45474E', lamp: 12, ambient: 0.45 },
  retro: { bg: '#15130E', desk: '#3A281B', case: '#BCB4A3', key: '#E9E2CF', keyWide: '#9A9283', mod: '#9A9283', ink: '#4A453C', modInk: '#1E1C18', title: '#E9E2CF', sub: '#A39A86', lamp: 80, ambient: 0.4 },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES;

export function isThemeName(s: string | undefined): s is ThemeName {
  return !!s && s in THEMES;
}
