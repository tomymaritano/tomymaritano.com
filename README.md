# tomymaritano.com

```
       *
       |
  .---------.
  |  >   _  |      Blueprint system. Pixel soul.
  |         |      Make it fail loud.
  '---------'
     |   |
```

Personal site of **Tomás Maritano**, engineering lead from Argentina. Postmortems, architecture notes, lessons from leading a team, and the small apps I build after hours.

## Stack

- **Next.js** (App Router, React Server Components, TypeScript), fully static.
- **MDX** content in `/content`, rendered with `next-mdx-remote` + GFM.
- A **content adapter** (`src/content`) so the source can switch from MDX files to **Ghost** (headless, Content API) with one env var.
- No UI framework, no WebGL, no trackers. Plain CSS with three themes and scroll-driven animations.

## Run it

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # static production build
```

## Structure

```
content/
  writing/*.mdx      posts (frontmatter: title, dek, kind, date, draft)
  builds/*.mdx       products (status, device, platform, metric, url, repo...)
src/
  app/               routes: /, /writing, /writing/[slug], /builds, /builds/[slug], /now, 404
  components/        Blink, DeviceMockup, Showcase, Hero, Story, Incident...
  content/           types + adapter (mdx-source, ghost-source) + now.ts
  styles/globals.css themes, grid, motion
```

## Writing a post

Copy `content/writing/_template-postmortem.mdx`, rename it, set `draft: false`. Posts can use these components inline:

- `<Incident stages={[...]} nodes={[...]} />` interactive four-stage incident figure
- `<TLDR items={[...]} />`
- `<Blink pose="error" cell={6} />` poses: idle, wave, error, ship, sleep, think
- `<DeviceMockup device="browser" title="..." />`

## Adding a product

Add `content/builds/<slug>.mdx`. `device` picks the mockup frame: `browser`, `window`, `ide`, `menubar`, `sliders`, `terminal`, `phone`. Put a real screenshot in `public/` and set `screenshot: /file.png` to replace the schematic UI.

## Switching to Ghost

```bash
cp .env.example .env.local
# CONTENT_SOURCE=ghost, GHOST_URL, GHOST_CONTENT_API_KEY
```

Posts then come from Ghost (the first tag sets the kind: postmortem, architecture, leading-teams, build-log). Builds stay in MDX.

## Brand

- **Themes:** Blueprint (default), Pixel, Paper (light). The site respects `prefers-color-scheme` and remembers the choice.
- **Type:** Silkscreen (wordmark, H1, buttons), Space Grotesk (text), IBM Plex Mono (labels).
- **Color:** Blueprint `#0E3A8A`, Line `#EAF2FF`, Sol `#F6B40E`, Night `#1B1F3B`, Loud `#FF6B97` (errors only), Paper `#F6F5F1`.
- **Motion:** everything respects `prefers-reduced-motion`.

## TODO

- [ ] Real metrics and screenshots for each build
- [ ] Plumbline one-line description
- [ ] Wire the build log form to a newsletter provider
- [ ] Social handles
- [ ] OG images per post

## License

Code: MIT. Writing and the Blink character: © Tomás Maritano.
