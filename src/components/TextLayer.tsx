import Link from 'next/link';
import { aiWork, experience, profile, skills } from '@/content/profile';
import { PROJECTS_INTRO, STAR_STEPS, type Project, projects } from '@/content/projects';
import { sections, toPath } from '@/routes';

/**
 * The text version of every room. It is real, server-rendered HTML: what
 * search engines and screen readers get, what shows when WebGL is missing,
 * and what "Read as text" opens on top of the 3D scene.
 */

function Nav() {
  const items = [
    { label: 'Home', href: toPath({ kind: 'home' }) },
    ...sections.map((s) => ({ label: s.label, href: toPath(s.route) })),
    { label: 'Writing', href: '/writing' },
  ];
  return (
    <nav aria-label="Main" className="tl-nav">
      {items.map((i) => <Link key={i.href} href={i.href}>{i.label}</Link>)}
    </nav>
  );
}

function Page({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="tl-page">
      <Nav />
      <h1>{title}</h1>
      {children}
    </article>
  );
}

export function HomeText() {
  return (
    <Page title={`${profile.name} — ${profile.role}`}>
      <p>{profile.headline}. {profile.location}.</p>
      <p>{profile.bio}</p>
      <h2>Projects</h2>
      <ProjectList />
    </Page>
  );
}

function ProjectList() {
  return (
    <ul>
      {projects.map((p) => (
        <li key={p.slug}>
          <Link href={toPath({ kind: 'project', slug: p.slug })}>{p.name}</Link> — {p.tagline} <small>({p.category} · {p.status})</small>
        </li>
      ))}
    </ul>
  );
}

export function ProjectsText() {
  return (
    <Page title="Projects">
      <p>{PROJECTS_INTRO}</p>
      <ProjectList />
    </Page>
  );
}

export function ProjectText({ project: p }: { project: Project }) {
  return (
    <Page title={p.name}>
      <p><strong>{p.tagline}</strong></p>
      <p>{p.category} · {p.status} · Role: {p.role} · Stack: {p.stack}</p>
      {p.links?.map((l) => <p key={l.url}><a href={l.url}>{l.label}</a></p>)}
      {STAR_STEPS.map((step) => (
        <section key={step}>
          <h2>{step[0].toUpperCase() + step.slice(1)}: {p.star[step].title}</h2>
          <p>{p.star[step].body}</p>
        </section>
      ))}
      <h2>Results</h2>
      <ul>{p.results.map((r) => <li key={r.label}><strong>{r.value}</strong> — {r.label}</li>)}</ul>
      <p><Link href={toPath({ kind: 'projects' })}>All projects</Link></p>
    </Page>
  );
}

export function ExperienceText() {
  return (
    <Page title="Experience">
      {experience.map((job) => (
        <section key={job.company}>
          <h2>{job.role} · {job.company}</h2>
          <p><small>{job.meta}</small></p>
          {job.path && <p><small>{job.path}</small></p>}
          <p>{job.mission}</p>
          <ul>{job.highlights.map((h) => <li key={h}>{h}</li>)}</ul>
        </section>
      ))}
    </Page>
  );
}

export function AboutText() {
  return (
    <Page title="About">
      <p>{profile.bio}</p>
      <p><strong>{profile.motto}</strong></p>
      <h2>Skills</h2>
      <dl>{skills.map((s) => <div key={s.group}><dt>{s.group}</dt><dd>{s.items}</dd></div>)}</dl>
      <h2>How I work with AI</h2>
      <ul>{aiWork.map((a) => <li key={a}>{a}</li>)}</ul>
    </Page>
  );
}

export function ContactText() {
  return (
    <Page title="Let's build something loud.">
      <p><a href={`mailto:${profile.email}`}>{profile.email}</a> · {profile.location}</p>
      <ul>{profile.links.filter((l) => l.url).map((l) => <li key={l.label}><a href={l.url}>{l.label}</a></li>)}</ul>
    </Page>
  );
}
