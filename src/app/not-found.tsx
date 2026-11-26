import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="page">
      <p className="eyebrow">404 · FAILED LOUD</p>
      <h1 className="display">This key isn&apos;t on the keyboard.</h1>
      <p><Link href="/">Back to the keyboard →</Link></p>
    </main>
  );
}
