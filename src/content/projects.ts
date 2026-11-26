/**
 * Every project shown on the site. This file is the only place a project's
 * facts live: the 3D rooms, the projects index, the text layer and the
 * sitemap all read from here. Text in [brackets] is a placeholder still
 * waiting for the real fact.
 */

export interface ProjectBrand {
  /** Accent: the keycap, highlights, charts. */
  color: string;
  /** Room background. */
  bg: string;
  /** Text color on `bg`. */
  fg: string;
}

export interface StarStep {
  title: string;
  body: string;
}

export interface Project {
  slug: string;
  name: string;
  /** Keyboard key that opens the project's room (A–Z). */
  key: string;
  glyph: string;
  /** Short label printed on the keycap. */
  short: string;
  brand: ProjectBrand;
  category: string;
  status: string;
  role: string;
  stack: string;
  tagline: string;
  /** How the room shows the product. */
  device: 'phone' | 'window';
  /** Rows drawn on the device screen: [label, value]. */
  screen: [string, string][];
  /** What Blink says when you hover the key. */
  blink: string;
  featured?: boolean;
  links?: { label: string; url: string }[];
  star: { situation: StarStep; task: StarStep; action: StarStep; result: StarStep };
  results: { value: string; label: string }[];
}

export const projects: Project[] = [
  {
    slug: 'dolargaucho', name: 'DólarGaucho', key: 'G', glyph: '$', short: 'GAUCHO',
    brand: { color: '#7B5CFF', bg: '#141033', fg: '#FFFFFF' },
    category: 'Fintech · Web · Mobile', status: 'Live', role: 'Creator · full stack', stack: 'Next.js · NestJS · Expo · PostgreSQL',
    tagline: 'Every Argentine dollar rate, one glance.', device: 'phone', featured: true,
    screen: [['Oficial', '$ —'], ['Blue', '$ —'], ['MEP', '$ —'], ['CCL', '$ —'], ['Cripto', '$ —']],
    blink: 'The one that is live. Go on.',
    links: [{ label: 'dolargaucho.com', url: 'https://dolargaucho.com' }],
    star: {
      situation: { title: 'Too many dollars', body: 'Argentina runs on more than one dollar: oficial, blue, MEP, CCL, cripto. [What was wrong with how people checked them.]' },
      task: { title: 'One glance', body: 'A financial information product for Argentina: a public site, a web app, an admin panel and a companion mobile app.' },
      action: { title: 'One monorepo', body: 'Next.js web and admin, a NestJS/Fastify API and shared packages in a pnpm/Turborepo monorepo on Railway. PostgreSQL with Drizzle, fed by scheduled ingestion from BCRA, FRED and DolarAPI. Expo apps with passkeys, notifications and widgets. Gemini explains the numbers.' },
      result: { title: 'Live', body: 'Running at dolargaucho.com, with regression tests, typechecks and database-backed checks on every push. [Users and usage numbers.]' },
    },
    results: [{ value: 'LIVE', label: 'dolargaucho.com' }, { value: '3+', label: 'Public data sources' }, { value: '2', label: 'Native apps: iOS, Android' }],
  },
  {
    slug: 'dripnex', name: 'Dripnex', key: 'D', glyph: '∿', short: 'DRIPNEX',
    brand: { color: '#FF4FA3', bg: '#FFF1F7', fg: '#2A0A1A' },
    category: 'Desktop · AI · Open source', status: 'Released', role: 'Creator · product engineer', stack: 'Electron · React · Cloudflare Workers',
    tagline: 'Local-first notes with AI, synced and end-to-end encrypted.', device: 'window', featured: true,
    screen: [['Standup notes', '[—]'], ['Design review', '[—]'], ['Reading list', '[—]'], ['Ideas', '[—]']],
    blink: 'Notes, synced, encrypted, with AI. Pick a model.',
    links: [{ label: 'github.com/dripnex/app', url: 'https://github.com/dripnex/app' }],
    star: {
      situation: { title: 'Notes get lost', body: '[What broke in how you took notes before Dripnex. Two or three sentences.]' },
      task: { title: 'Local first', body: 'A notes app that stays local-first, syncs everywhere, and lets any AI model work with your notes.' },
      action: { title: 'One AI layer', body: 'Electron, React, CodeMirror 6 and SQLite on the desktop. Sync with conflict handling and end-to-end encryption on Hono, Cloudflare Workers and Turso. One AI layer across OpenAI, Anthropic, Grok and Ollama, plus MCP and embedding search.' },
      result: { title: 'Released', body: 'Shipped for macOS, Windows and Linux, with automated releases and end-to-end tests. Open source at github.com/dripnex/app. [Users or stars.]' },
    },
    results: [{ value: '3', label: 'Desktop platforms' }, { value: '4', label: 'AI providers' }, { value: 'E2E', label: 'Encrypted sync' }],
  },
  {
    slug: 'vela', name: 'Vela', key: 'V', glyph: '▲', short: 'VELA',
    brand: { color: '#8B5CFF', bg: '#0F0F14', fg: '#ECEAF5' },
    category: 'AI · IDE · Design system', status: 'In design', role: 'Solo · product, design', stack: '[Stack]',
    tagline: 'An AI-first IDE where the agent is part of the interface.', device: 'window',
    screen: [['app/page.tsx', 'M'], ['lib/agent.ts', 'A'], ['ui/Button.tsx', 'M'], ['README.md', '']],
    blink: 'An IDE. Yes, another one. A good one.',
    star: {
      situation: { title: 'AI as an overlay', body: 'In most editors the AI is a panel bolted on top of the old interface. [Your take on why that falls short.]' },
      task: { title: 'Agent first', body: 'Design an IDE where the agent is a fixed part of the interface, not a popup.' },
      action: { title: 'Cut to focus', body: 'Its own design system and brand book. Dropped the kids edition to focus on the agentic product.' },
      result: { title: 'In design', body: '[What exists today: screens, prototype, what comes next.]' },
    },
    results: [{ value: '1', label: 'Design system' }, { value: '[N]', label: '[Screens designed]' }, { value: '[—]', label: '[Next milestone]' }],
  },
  {
    slug: 'airtime', name: 'Airtime', key: 'W', glyph: '◠', short: 'AIRTIME',
    brand: { color: '#3D7BFF', bg: '#EAF1FF', fg: '#0A1A3A' },
    category: 'macOS · Swift · Menu bar', status: 'Built', role: 'Creator', stack: 'Swift · SwiftUI · CoreWLAN · WidgetKit',
    tagline: 'Live Wi-Fi, and which AI apps are filling your uplink.', device: 'window',
    screen: [['Wi-Fi', '[— dBm]'], ['[AI app]', '↑ [—]'], ['[AI app]', '↑ [—]'], ['[AI app]', '↑ [—]']],
    blink: 'Who is eating the uplink? This knows.',
    links: [{ label: 'github.com/tomymaritano/Airtime', url: 'https://github.com/tomymaritano/Airtime' }],
    star: {
      situation: { title: 'Who is uploading?', body: 'AI tools upload a lot. When a call starts to stutter, there is no quick way to see which app is filling the uplink.' },
      task: { title: 'One glance up there', body: 'A native macOS utility that lives in the menu bar and shows live Wi-Fi and the apps using the uplink.' },
      action: { title: 'Native, all the way', body: 'Swift and SwiftUI, CoreWLAN for the Wi-Fi data, WidgetKit widgets, XCTest coverage and signed release packaging. A companion to the devwifi CLI; it started as DevWifiBar.' },
      result: { title: 'Built', body: 'Open source at github.com/tomymaritano/Airtime. [Downloads or what people use it for.]' },
    },
    results: [{ value: 'Swift', label: 'SwiftUI + WidgetKit' }, { value: 'XCTest', label: 'Test coverage' }, { value: '[N]', label: '[Downloads]' }],
  },
  {
    slug: 'ambient-mixer', name: 'Ambient Mixer', key: 'A', glyph: '≡', short: 'AMBIENT',
    brand: { color: '#FF7A45', bg: '#1A0F0A', fg: '#FFE9DC' },
    category: 'Desktop · Audio', status: 'Building', role: 'Solo · design, build', stack: '[Stack]',
    tagline: 'Rain, café, fan and lofi, mixed while you code.', device: 'window',
    screen: [['Rain', '[—]'], ['Café', '[—]'], ['Fan', '[—]'], ['Brown noise', '[—]'], ['Lofi folder', '[—]']],
    blink: 'Rain on. Focus on.',
    star: {
      situation: { title: 'Focus is fragile', body: '[Why you built it: what you used before and what broke your focus.]' },
      task: { title: 'One tray app', body: 'A tray app that mixes ambient loops with your own lofi folder, made to use while coding.' },
      action: { title: 'Loops + lofi', body: 'Loops for rain, café, fan and brown noise, each with its own level, plus a local lofi music folder. [Stack.]' },
      result: { title: 'Building', body: '[What works today and what is next.]' },
    },
    results: [{ value: '4', label: 'Ambient loops' }, { value: '1', label: 'Lofi folder' }, { value: '[N]', label: '[Hours of focus]' }],
  },
  {
    slug: 'plumbline', name: 'Plumbline', key: 'P', glyph: '⊥', short: 'PLUMB',
    brand: { color: '#3CE0B8', bg: '#E8FBF5', fg: '#062A22' },
    category: 'AI agents · Dev tooling · Open source', status: 'In use', role: 'Creator', stack: 'Agent skills · Node.js hooks · CI',
    tagline: 'AI review skills on every PR, measured with evals.', device: 'window',
    screen: [['review skill', 'pass'], ['held-out cases', '[—]'], ['with skill', '[—]'], ['without skill', '[—]']],
    blink: 'Built on a Friday night. Now nobody merges without it.',
    links: [{ label: 'github.com/tomymaritano/plumbline', url: 'https://github.com/tomymaritano/plumbline' }],
    star: {
      situation: { title: 'Slipping through', body: '[What kept getting past code review before Plumbline.]' },
      task: { title: 'Prove it helps', body: 'Review every PR with AI coding-agent skills, and measure whether each skill actually makes the review better.' },
      action: { title: 'Skills + evals', body: 'AI coding-agent review skills, Node.js hooks and CI workflows. Evaluation fixtures with held-out cases, comparing results with and without each skill.' },
      result: { title: 'Mandatory', body: 'Built in a Friday night. The team adopted it: every PR passes through Plumbline before merging.' },
    },
    results: [{ value: '100%', label: 'PRs pass through it' }, { value: '1', label: 'Friday night to build' }, { value: 'A/B', label: 'With vs. without each skill' }],
  },
  {
    slug: 'minipix', name: 'Minipix', key: 'X', glyph: '▦', short: 'MINIPIX',
    brand: { color: '#FFB020', bg: '#17120B', fg: '#FFF4E0' },
    category: 'Rust · WebAssembly · Image processing', status: 'Open source', role: 'Creator', stack: 'Rust · Node.js · Python · WASM',
    tagline: 'Rust image processing, with bindings for Node.js, Python and the web.', device: 'window',
    screen: [['Rust core', '✓'], ['Node.js binding', '✓'], ['Python binding', '✓'], ['WebAssembly', '✓']],
    blink: 'Pixels, but in Rust.',
    links: [{ label: 'github.com/tomymaritano/minipix', url: 'https://github.com/tomymaritano/minipix' }],
    star: {
      situation: { title: 'Pixels everywhere', body: '[What image-processing problem you hit.]' },
      task: { title: 'One fast core', body: 'One image-processing core in Rust, usable from Node.js, Python and the browser.' },
      action: { title: 'Bindings + tests', body: 'Rust image-processing code with Node.js, Python and WebAssembly bindings, backed by conformance and golden tests plus fuzzing.' },
      result: { title: 'Open source', body: 'Open source at github.com/tomymaritano/minipix. [Benchmarks, downloads or users.]' },
    },
    results: [{ value: '3', label: 'Bindings: Node, Python, WASM' }, { value: 'Fuzz', label: 'Fuzzing + golden tests' }, { value: '[N]', label: '[Benchmark]' }],
  },
];

export function findProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectByKey(key: string): Project | undefined {
  return projects.find((p) => p.key === key);
}

/** True for rooms with a dark background, where text and glyphs go white. */
export function isDarkBrand(p: Project): boolean {
  const n = parseInt(p.brand.bg.slice(1), 16);
  const luminance = 0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255);
  return luminance < 128;
}

/** One line shown above every list of projects. */
export const PROJECTS_INTRO = 'Each one wears its own brand. Pick one to step inside.';

export const STAR_STEPS = ['situation', 'task', 'action', 'result'] as const;
