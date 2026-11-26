import { findProject } from '@/content/projects';

/**
 * Every place you can be in the keyboard site, and its URL. This module owns
 * the mapping both ways; nothing else builds or parses these paths.
 */
export type Route =
  | { kind: 'home' }
  | { kind: 'about' }
  | { kind: 'experience' }
  | { kind: 'projects' }
  | { kind: 'contact' }
  | { kind: 'project'; slug: string };

export type Room = Exclude<Route, { kind: 'home' }>;

const SECTION_PATHS = { about: '/about', experience: '/experience', projects: '/work', contact: '/contact' } as const;

export function toPath(route: Route): string {
  if (route.kind === 'home') return '/';
  if (route.kind === 'project') return `/work/${route.slug}`;
  return SECTION_PATHS[route.kind];
}

/** Returns null for paths that are not part of the keyboard site (e.g. /writing). */
export function fromPath(pathname: string): Route | null {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return { kind: 'home' };
  for (const [kind, p] of Object.entries(SECTION_PATHS)) if (p === path) return { kind } as Route;
  const m = path.match(/^\/work\/([^/]+)$/);
  if (m && findProject(m[1])) return { kind: 'project', slug: m[1] };
  return null;
}

/** The sections, in navigation order, with the name menus print. */
export const sections: { route: Room; label: string }[] = [
  { route: { kind: 'experience' }, label: 'Experience' },
  { route: { kind: 'projects' }, label: 'Projects' },
  { route: { kind: 'about' }, label: 'About' },
  { route: { kind: 'contact' }, label: 'Contact' },
];

export function sameRoute(a: Route, b: Route): boolean {
  return toPath(a) === toPath(b);
}
