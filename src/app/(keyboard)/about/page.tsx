import type { Metadata } from 'next';
import { AboutText } from '@/components/TextLayer';

export const metadata: Metadata = { title: 'About', description: 'Engineering manager and hands-on engineer. Skills, and how I work with AI.' };

export default function About() {
  return <AboutText />;
}
