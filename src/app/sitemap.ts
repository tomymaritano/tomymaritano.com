import type { MetadataRoute } from 'next';
import { profile } from '@/content/profile';
import { projects } from '@/content/projects';
import { writing } from '@/content/writing';
import { sections, toPath, type Route } from '@/routes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rooms: Route[] = [
    { kind: 'home' },
    ...sections.map((s) => s.route),
    ...projects.map((p): Route => ({ kind: 'project', slug: p.slug })),
  ];
  const posts = await writing.getPosts();
  return [
    ...rooms.map((r) => ({ url: `${profile.site}${toPath(r)}` })),
    { url: `${profile.site}/writing` },
    ...posts.map((p) => ({ url: `${profile.site}/writing/${p.slug}`, lastModified: p.date })),
  ];
}
