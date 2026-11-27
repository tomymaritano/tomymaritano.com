import type { Metadata } from 'next';
import { ContactText } from '@/components/TextLayer';

export const metadata: Metadata = { title: 'Contact', description: "Let's build something loud." };

export default function Contact() {
  return <ContactText />;
}
