import type { Build, BuildMeta, ContentSource, Post, PostKind, PostMeta } from './types';
import { mdxSource } from './mdx-source';

/**
 * Ghost (headless) backend. Posts come from the Ghost Content API.
 * Kind is read from the first Ghost tag (e.g. "postmortem", "architecture").
 * Builds stay in MDX until there is a reason to move them.
 */
const GHOST_URL = process.env.GHOST_URL;
const KEY = process.env.GHOST_CONTENT_API_KEY;

type GhostPost = {
  slug: string;
  title: string;
  custom_excerpt: string | null;
  excerpt: string;
  published_at: string;
  reading_time: number;
  featured: boolean;
  html: string;
  tags?: { name: string }[];
};

function toKind(tag?: string): PostKind {
  const t = (tag ?? '').toUpperCase().replace(/-/g, ' ');
  if (t === 'ARCHITECTURE' || t === 'LEADING TEAMS' || t === 'BUILD LOG') return t;
  return 'POSTMORTEM';
}

async function ghost<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!GHOST_URL || !KEY) throw new Error('GHOST_URL and GHOST_CONTENT_API_KEY must be set when CONTENT_SOURCE=ghost');
  const qs = new URLSearchParams({ key: KEY, ...params });
  const res = await fetch(`${GHOST_URL}/ghost/api/content/${endpoint}/?${qs}`, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Ghost ${endpoint} failed loud: ${res.status}`);
  return res.json() as Promise<T>;
}

function toMeta(p: GhostPost): PostMeta {
  return {
    slug: p.slug,
    title: p.title,
    dek: p.custom_excerpt ?? p.excerpt,
    kind: toKind(p.tags?.[0]?.name),
    date: p.published_at.slice(0, 10),
    readingMinutes: p.reading_time,
    featured: p.featured,
  };
}

export const ghostSource: ContentSource = {
  async getPosts() {
    const data = await ghost<{ posts: GhostPost[] }>('posts', { include: 'tags', limit: 'all', fields: 'slug,title,custom_excerpt,excerpt,published_at,reading_time,featured' });
    return data.posts.map(toMeta);
  },
  async getPost(slug) {
    const data = await ghost<{ posts: GhostPost[] }>(`posts/slug/${slug}`, { include: 'tags' }).catch(() => null);
    const p = data?.posts[0];
    return p ? ({ ...toMeta(p), body: p.html, format: 'html' } satisfies Post) : null;
  },
  getBuilds: (): Promise<BuildMeta[]> => mdxSource.getBuilds(),
  getBuild: (slug: string): Promise<Build | null> => mdxSource.getBuild(slug),
};
