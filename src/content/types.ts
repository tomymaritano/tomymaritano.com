export type PostKind = 'POSTMORTEM' | 'ARCHITECTURE' | 'LEADING TEAMS' | 'BUILD LOG';

export interface PostMeta {
  slug: string;
  title: string;
  dek: string;
  kind: PostKind;
  date: string; // ISO yyyy-mm-dd
  readingMinutes?: number;
  featured?: boolean;
  draft?: boolean;
}

export interface Post extends PostMeta {
  /** Raw MDX (mdx source) or HTML (ghost source). */
  body: string;
  format: 'mdx' | 'html';
}

export type BuildStatus = 'LIVE' | 'BUILDING' | 'IN DESIGN' | 'OPEN SOURCE';
export type Device = 'browser' | 'window' | 'ide' | 'menubar' | 'sliders' | 'terminal' | 'phone';

export interface BuildMeta {
  slug: string;
  order: number;
  name: string;
  status: BuildStatus;
  desc: string;
  device: Device;
  deviceTitle: string;
  platform: string;
  metric: string;
  url?: string;
  repo?: string;
  stack?: string;
  started?: string;
  screenshot?: string;
}

export interface Build extends BuildMeta {
  body: string;
  format: 'mdx' | 'html';
}

/**
 * Every content backend implements this. Pages only talk to the adapter,
 * so moving from MDX files to Ghost is a config change, not a rewrite.
 */
export interface ContentSource {
  getPosts(): Promise<PostMeta[]>;
  getPost(slug: string): Promise<Post | null>;
  getBuilds(): Promise<BuildMeta[]>;
  getBuild(slug: string): Promise<Build | null>;
}
