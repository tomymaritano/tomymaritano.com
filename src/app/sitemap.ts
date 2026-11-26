import type { MetadataRoute } from 'next';
import { content } from '@/content';

const BASE = 'https://tomymaritano.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, builds] = await Promise.all([content.getPosts(), content.getBuilds()]);
  return [
    ...['', '/writing', '/builds', '/now'].map((p) => ({ url: `${BASE}${p}` })),
    ...posts.map((p) => ({ url: `${BASE}/writing/${p.slug}`, lastModified: p.date })),
    ...builds.map((b) => ({ url: `${BASE}/builds/${b.slug}` })),
  ];
}
