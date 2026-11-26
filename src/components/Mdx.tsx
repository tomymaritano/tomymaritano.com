import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { Blink } from './Blink';
import { DeviceMockup } from './DeviceMockup';
import { Incident, TLDR } from './Incident';

const components = { Incident, TLDR, Blink, DeviceMockup };

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />;
}
