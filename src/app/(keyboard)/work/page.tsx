import type { Metadata } from 'next';
import { ProjectsText } from '@/components/TextLayer';

export const metadata: Metadata = { title: 'Projects', description: 'The products I build after hours, each in its own brand.' };

export default function Projects() {
  return <ProjectsText />;
}
