import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Build, BuildMeta, ContentSource, Post, PostMeta } from './types';

const ROOT = path.join(process.cwd(), 'content');

async function readDir(dir: string) {
  const full = path.join(ROOT, dir);
  const files = await fs.readdir(full).catch(() => [] as string[]);
  return files.filter((f) => f.endsWith('.mdx'));
}

async function readFile(dir: string, slug: string) {
  const file = path.join(ROOT, dir, `${slug}.mdx`);
  const raw = await fs.readFile(file, 'utf8').catch(() => null);
  if (!raw) return null;
  return matter(raw);
}

function wordsToMinutes(text: string) {
  return Math.max(1, Math.round(text.split(/\s+/).length / 220));
}

export const mdxSource: ContentSource = {
  async getPosts() {
    const files = await readDir('writing');
    const posts: (PostMeta | null)[] = await Promise.all(
      files.map(async (f) => {
        const slug = f.replace(/\.mdx$/, '');
        const parsed = await readFile('writing', slug);
        if (!parsed) return null;
        const d = parsed.data as Partial<PostMeta>;
        const meta: PostMeta = {
          slug,
          title: d.title ?? slug,
          dek: d.dek ?? '',
          kind: d.kind ?? 'POSTMORTEM',
          date: String(d.date ?? '1970-01-01'),
          readingMinutes: d.readingMinutes ?? wordsToMinutes(parsed.content),
          featured: d.featured ?? false,
          draft: d.draft ?? false,
        };
        return meta;
      }),
    );
    return posts
      .filter((p): p is PostMeta => p !== null && !p.draft)
      .sort((a, b) => b.date.localeCompare(a.date));
  },

  async getPost(slug) {
    const parsed = await readFile('writing', slug);
    if (!parsed) return null;
    const meta = (await this.getPosts()).find((p) => p.slug === slug);
    if (!meta) return null;
    return { ...meta, body: parsed.content, format: 'mdx' } satisfies Post;
  },

  async getBuilds() {
    const files = await readDir('builds');
    const builds: (BuildMeta | null)[] = await Promise.all(
      files.map(async (f) => {
        const slug = f.replace(/\.mdx$/, '');
        const parsed = await readFile('builds', slug);
        if (!parsed) return null;
        const meta: BuildMeta = { slug, ...(parsed.data as Omit<BuildMeta, 'slug'>) };
        return meta;
      }),
    );
    return builds.filter((b): b is BuildMeta => b !== null).sort((a, b) => a.order - b.order);
  },

  async getBuild(slug) {
    const parsed = await readFile('builds', slug);
    if (!parsed) return null;
    return { slug, ...(parsed.data as Omit<BuildMeta, 'slug'>), body: parsed.content, format: 'mdx' } satisfies Build;
  },
};
