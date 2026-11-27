# AGENTS.md

Guidance for coding agents working on tomymaritano.com. What the site is and how it is laid out: [README.md](README.md).

## Rules of the house

- **Facts live in `src/content/`.** Don't hard-code a project name, a role, a date or a link anywhere else. If a 3D room and the text version both need a sentence, it goes in content.
- **`src/routes.ts` owns URLs.** Build paths with `toPath`, parse them with `fromPath`. Never concatenate route strings.
- **`src/three/` doesn't import React or Next.** The only way in is `mountExperience`; the only way out is `onNavigate`.
- **Every room has a text version** in `src/components/TextLayer.tsx`. A new room without one is unfinished.
- **Placeholders stay visible.** Unknown facts are written as `[What this needs]`, never invented.
- Respect `prefers-reduced-motion`: anything that moves must check it.

## Checks

Run before committing:

```bash
pnpm typecheck
pnpm build
```

## Design check

This repo uses [Plumbline](https://github.com/tomymaritano/plumbline). After a change that adds or rewrites roughly 80+ lines of code, or creates a new source file, run the Plumbline `red-flags` skill on the files you changed before you finish. Report only the flags that triggered, in a few lines; if none did, say so in one line. Don't apply fixes unless asked.

Reviews read and update `.plumbline/findings.md`: don't re-report accepted trade-offs, and say so when a change brings back something marked fixed.

## Conventions

- Commit messages use conventional prefixes: `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`.
- Copy on the site is in English. Short sentences, no hype.
