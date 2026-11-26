import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProjectText } from '@/components/TextLayer';
import { findProject, projects } from '@/content/projects';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = findProject((await params).slug);
  return p ? { title: p.name, description: p.tagline } : {};
}

export default async function ProjectPage({ params }: Props) {
  const p = findProject((await params).slug);
  if (!p) notFound();
  return <ProjectText project={p} />;
}
