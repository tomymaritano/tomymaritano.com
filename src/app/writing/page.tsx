import type { Metadata } from 'next';
import { content } from '@/content';
import { Blink } from '@/components/Blink';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { WritingIndex } from '@/components/WritingIndex';

export const metadata: Metadata = { title: '/writing', description: 'Postmortems, architecture notes and lessons from leading a team.' };

export default async function WritingPage() {
  const posts = await content.getPosts();
  return (
    <>
      <SiteHeader active="writing" />
      <main id="main" className="wrap" style={{ display: 'flex', flexDirection: 'column', gap: 48, paddingTop: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 640 }}>
            <span className="label up">SHEET 02 · INDEX OF DRAWINGS</span>
            <h1 className="pixel up" style={{ animationDelay: '.1s', fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1 }}>/writing</h1>
            <p className="muted up" style={{ animationDelay: '.2s', fontSize: 19, lineHeight: 1.55 }}>Postmortems, architecture notes and lessons from leading a team. Every post is dated, and every system is drawn.</p>
          </div>
          <Blink pose="think" cell={8} assemble decorative />
        </div>
        <WritingIndex posts={posts} />
      </main>
      <SiteFooter />
    </>
  );
}
