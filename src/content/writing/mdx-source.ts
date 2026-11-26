import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Post, PostMeta, WritingSource } from './types';

const DIR = path.join(process.cwd(), 'content', 'writing');

async function read(slug: string) {
  const raw = await fs.readFile(path.join(DIR, `${slug}.mdx`), 'utf8').catch(() => null);
  return raw === null ? null : matter(raw);
}

/** gray-matter turns `date: 2026-11-25` into a Date; posts only ever need the day. */
function toIsoDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return typeof value === 'string' ? value : '1970-01-01';
}

function toMeta(slug: string, data: Partial<PostMeta>, body: string): PostMeta {
  return {
    slug,
    title: data.title ?? slug,
    dek: data.dek ?? '',
    kind: data.kind ?? 'POSTMORTEM',
    date: toIsoDate(data.date),
    readingMinutes: data.readingMinutes ?? Math.max(1, Math.round(body.split(/\s+/).length / 220)),
    featured: data.featured ?? false,
    draft: data.draft ?? false,
  };
}

/** Posts are `content/writing/*.mdx`. Files starting with `_` are templates and never published. */
export const mdxSource: WritingSource = {
  async getPosts() {
    const files = (await fs.readdir(DIR).catch(() => [] as string[])).filter((f) => f.endsWith('.mdx') && !f.startsWith('_'));
    const posts = await Promise.all(files.map(async (f) => {
      const slug = f.replace(/\.mdx$/, '');
      const parsed = await read(slug);
      return parsed ? toMeta(slug, parsed.data as Partial<PostMeta>, parsed.content) : null;
    }));
    return posts.filter((p): p is PostMeta => p !== null && !p.draft).sort((a, b) => b.date.localeCompare(a.date));
  },
  async getPost(slug) {
    if (slug.startsWith('_')) return null;
    const parsed = await read(slug);
    if (!parsed) return null;
    const meta = toMeta(slug, parsed.data as Partial<PostMeta>, parsed.content);
    return meta.draft ? null : ({ ...meta, body: parsed.content, format: 'mdx' } satisfies Post);
  },
};
