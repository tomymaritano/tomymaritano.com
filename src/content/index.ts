import type { ContentSource } from './types';
import { mdxSource } from './mdx-source';
import { ghostSource } from './ghost-source';

export * from './types';

export const content: ContentSource = process.env.CONTENT_SOURCE === 'ghost' ? ghostSource : mdxSource;
