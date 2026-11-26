# tomymaritano.com

Personal site of **Tomás Maritano**, Engineering Manager from Argentina. A 3D mechanical keyboard on a desk: every colored key opens one of my projects, and each project's room wears that project's own brand. Blink, the tiny terminal on the desk, shows you around.

Make it fail loud.

## Run it

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm typecheck
pnpm build       # static production build
```

## How it's put together

```
content/writing/*.mdx    blog posts (files starting with _ are templates)
src/
  content/               the facts, one place each
    projects.ts          every project: brand, case study (STAR), results
    profile.ts           bio, experience, skills, links
    writing/             blog adapter: MDX files today, Ghost with CONTENT_SOURCE=ghost
  routes.ts              Route <-> URL, both ways. Nothing else builds paths.
  app/
    (keyboard)/          /, /about, /experience, /work, /work/[slug], /contact
    writing/             /writing, /writing/[slug] (plain 2D pages)
  components/
    KeyboardSite.tsx     hosts the 3D scene in the (keyboard) layout, syncs it with the URL
    TextLayer.tsx        the text version of every room (SEO, screen readers, no-WebGL)
  three/                 the 3D site, framework-free
    experience.ts        mountExperience(canvas, { initial, onNavigate }) -> { go, setInteractive, dispose }
    stage.ts             renderer, lights, bloom + grain, adaptive quality
    keyboard.ts          layout, which key opens which room, key physics
    blink.ts  desk.ts  hud.ts  sound.ts  commands.ts  themes.ts  kit.ts
    rooms/               one builder per room; pieces.ts holds each project's signature object
```

**The URL is the source of truth.** The 3D scene lives in the `(keyboard)` layout, so it never remounts. Clicking a key starts the camera dive and pushes the new URL; the page underneath swaps its text version; back and forward call `experience.go(route)`. Moves requested mid-flight wait until the camera lands.

**Adding a project** is one entry in `src/content/projects.ts` (pick a free letter for `key`). Optionally give it a signature object in `src/three/rooms/pieces.ts`. Everything else (keycap, room, projects index, text version, sitemap) follows.

**Text in `[brackets]`** in the content files is a placeholder waiting for a real fact.

## Design review with Plumbline

This repo uses [Plumbline](https://github.com/tomymaritano/plumbline), design skills for coding agents based on *A Philosophy of Software Design*.

- **Locally:** `.claude/settings.json` registers the Plumbline marketplace and enables the plugin, so Claude Code offers to install it when you open the repo. Other agents: see Plumbline's README. `AGENTS.md` tells every agent to run `red-flags` after large changes.
- **On pull requests:** `.github/workflows/design-review.yml` runs Plumbline's `code-evolution` review and comments only when a change adds a real design problem. It needs an `ANTHROPIC_API_KEY` repository secret; without it the job skips and stays green.
- **Memory:** `.plumbline/findings.md` records what reviews found, what was fixed and which trade-offs were accepted, so reviews don't repeat themselves.

## Interactions

Colored keys open projects. `TAB` experience, `CAPS` projects, `SPACE` about, `ENTER` contact. `ESC` or `BACKSPACE` leaves a room. Scroll inside a room for the case study. `/` opens a command line (`help`, `ls`, `cd <name>`, `hire`, `theme day|night|retro`, `rgb`, `whoami`). `M` mutes. There may be a code involving arrows.

## License

MIT
