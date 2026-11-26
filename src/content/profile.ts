/**
 * Who Tomás is, in one place: identity, bio, links, career, skills.
 * Source: his CV. Achievements the CV marks as "to validate" (†) are left out.
 */

export const profile = {
  name: 'Tomás Maritano',
  handle: 'tomymaritano',
  role: 'Engineering Manager',
  /** The role as it is stacked on the desk, one word per line. */
  roleLines: ['Engineering', 'Manager.'],
  headline: 'Engineering Manager · AI platforms and full stack engineering',
  location: 'Argentina · Remote',
  country: 'Argentina',
  timezone: { label: 'GMT-3', offsetMinutes: -180 },
  email: 'tomymaritano@gmail.com',
  site: 'https://tomymaritano.com',
  motto: 'Make it fail loud.',
  bio: 'Engineering manager and hands-on engineer building AI, web, mobile and desktop products. I lead engineering at Psynth across platform architecture, cloud infrastructure and clinical workflows. After hours I build my own products, like DólarGaucho and Dripnex, from the first commit to production.',
  homeLine: 'Tomás Maritano. Engineering Manager at Psynth. After hours I build my own apps, and every colored key is one of them.',
  links: [
    { label: 'GitHub', url: 'https://github.com/tomymaritano' },
    { label: 'LinkedIn', url: '' },
    { label: 'X', url: '' },
  ],
} as const;

export interface Job {
  year: string;
  role: string;
  company: string;
  meta: string;
  /** Promotions inside the same company, oldest first. */
  path?: string;
  mission: string;
  highlights: string[];
}

export const experience: Job[] = [
  {
    year: '2026', role: 'Engineering Manager', company: 'Psynth', meta: 'Jan 2026 – Present · Full-time · Remote',
    path: 'Design Engineer → Senior Full Stack → Lead Engineer → Engineering Manager',
    mission: 'Reliable clinical reporting across AI generation, structured editing, audio capture and regional data boundaries.',
    highlights: [
      'Engineering strategy and execution for an AI clinical reporting platform: architecture, code quality, testing and delivery standards.',
      'Led the move from many repositories to an Nx monorepo; contributed to the MongoDB-to-PostgreSQL migration.',
      'Built ingestion, extraction, generation, editing and export workflows with visible failure handling.',
      'Co-developed ambient listening for clinical sessions; built a schema-driven TipTap editor.',
      'Google Cloud for LLM workloads and AWS platform services, all in Terraform.',
      'Data residency and fail-closed paths; HIPAA, GDPR and PIPEDA work through RBAC and org scoping.',
    ],
  },
  {
    year: '2024', role: 'Technical Lead', company: 'Unicoin', meta: 'Jan 2024 – Jul 2025 · Contract · Remote',
    mission: 'Reliable wallet-connected workflows across browser state, backend APIs and external providers.',
    highlights: ['Led a product team of three backend and one frontend engineer, plus a three-person UX team.'],
  },
  {
    year: '2023', role: 'Founding Engineer', company: 'Valere Realms', meta: 'Aug 2023 – Dec 2024 · Contract · Remote',
    mission: 'Evolve an early product into maintainable web and mobile applications with consistent APIs, data rules and releases.',
    highlights: ['A two-person technical team with the CTO, shipping on AWS.'],
  },
  {
    year: '2022', role: 'Lead Full Stack Engineer', company: 'Grandvalira SAETDE', meta: 'May 2022 – Nov 2023 · Andorra · On-site',
    mission: 'Build and operate an internal directory with reliable user records, usable interfaces and traceable behavior.',
    highlights: [
      'Sole engineer on the intranet and user directory, from architecture to deployment and support.',
      'React and Next.js interfaces, backend APIs and MongoDB data models.',
      'CI/CD, monitoring and code quality practices; AWS provisioned with Terraform.',
    ],
  },
  {
    year: '2020', role: 'Technical Lead', company: 'Wolt', meta: 'May 2020 – May 2022 · Copenhagen · On-site',
    mission: 'Keep data-heavy operational interfaces responsive and consistent as backend data and operator actions change.',
    highlights: ['Led a group of 10 engineers on market operations tooling, inside an engineering org of 45.'],
  },
  {
    year: '2017', role: 'Full Stack Engineer', company: 'Su Web Express', meta: 'Apr 2017 – Jun 2018 · Buenos Aires · On-site',
    mission: 'Client websites, end to end.',
    highlights: [
      'WordPress and PHP sites, responsive HTML and CSS layouts, JavaScript interactions.',
      'Deployed updates to client hosting and worked with designers on consistent pages.',
    ],
  },
];

export const skills: { group: string; items: string }[] = [
  { group: 'Languages', items: 'TypeScript, JavaScript, Python, Rust, Swift, PHP, SQL, HTML, CSS' },
  { group: 'Frontend', items: 'React, Next.js, Tailwind CSS, Zustand, TanStack Query, GSAP, Recharts, TipTap, CodeMirror 6' },
  { group: 'Mobile + desktop', items: 'React Native, Expo, EAS, Flutter, Electron, SwiftUI, WidgetKit, Tauri' },
  { group: 'Backend + APIs', items: 'Node.js, NestJS, Fastify, Hono, FastAPI, REST, OpenAPI, Zod, passkeys' },
  { group: 'Data', items: 'PostgreSQL, MongoDB, SQLite, Turso, Drizzle, pgvector, SQLAlchemy, migrations and sync' },
  { group: 'AI + agents', items: 'LLM workflows, ambient listening, streaming, tool execution, MCP, embeddings, hybrid retrieval' },
  { group: 'Cloud + delivery', items: 'AWS, Google Cloud, Terraform, Railway, Vercel, Cloudflare Workers, Docker, GitHub Actions, Nx, Turborepo' },
  { group: 'Product + security', items: 'Stripe, PostHog, GA4, feature flags, RBAC, JWT, data residency, encryption' },
  { group: 'Testing', items: 'Unit, integration, component and E2E; Vitest, Jest, Testing Library, Playwright, pytest, CI' },
];

export const aiWork: string[] = [
  'AI-assisted engineering with Claude Code and Codex: reusable skills, edit and stop hooks, review, fix and test loops, GitHub Actions.',
  'Plumbline evaluation suites with fixtures, held-out cases and with-vs-without comparisons for every skill.',
  'MCP clients and servers, and bounded tool-execution loops with context budgeting, retries, cancellation and streaming in Dripnex.',
  'Local Ollama models and embeddings for hybrid retrieval; shared agent instructions across repositories.',
];
