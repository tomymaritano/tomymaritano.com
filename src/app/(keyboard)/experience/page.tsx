import type { Metadata } from 'next';
import { ExperienceText } from '@/components/TextLayer';

export const metadata: Metadata = { title: 'Experience', description: 'Psynth, Unicoin, Valere Realms, Grandvalira, Wolt and Su Web Express.' };

export default function Experience() {
  return <ExperienceText />;
}
