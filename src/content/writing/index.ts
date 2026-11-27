import { ghostSource } from './ghost-source';
import { mdxSource } from './mdx-source';
import type { WritingSource } from './types';

export * from './types';

export const writing: WritingSource = process.env.CONTENT_SOURCE === 'ghost' ? ghostSource : mdxSource;
