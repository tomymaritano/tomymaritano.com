export type PostKind = 'POSTMORTEM' | 'ARCHITECTURE' | 'LEADING TEAMS' | 'BUILD LOG';

export interface PostMeta {
  slug: string;
  title: string;
  dek: string;
  kind: PostKind;
  /** ISO yyyy-mm-dd. */
  date: string;
  readingMinutes?: number;
  featured?: boolean;
  draft?: boolean;
}

export interface Post extends PostMeta {
  /** Raw MDX (mdx source) or HTML (ghost source). */
  body: string;
  format: 'mdx' | 'html';
}

/**
 * Every writing backend implements this. Pages only talk to the adapter, so
 * moving from MDX files to Ghost is a config change, not a rewrite.
 */
export interface WritingSource {
  getPosts(): Promise<PostMeta[]>;
  getPost(slug: string): Promise<Post | null>;
}
