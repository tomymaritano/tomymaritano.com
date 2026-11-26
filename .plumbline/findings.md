# Plumbline findings

Design findings for tomymaritano.com, kept by Plumbline reviews (`red-flags`, `design-review`, `code-evolution`). One entry per problem, keyed by concept. See https://github.com/tomymaritano/plumbline.

## keyboard-legend-duplicated
- flag: 5 Information Leakage
- where: desk legend text in `hud.ts` vs section keys in `keyboard.ts`
- status: fixed
- first seen: 2026-11-26
- fixed: 2026-11-26
- note: the legend restated which key opens which room; `Keyboard.shortcuts` now owns it and the HUD prints it

## command-route-names
- flag: 18 Vocabulary Not Owned
- where: `resolve` in `three/commands.ts`
- status: fixed
- first seen: 2026-11-26
- fixed: 2026-11-26
- note: commands kept their own name→route table; they now go through `fromPath` in `routes.ts`

## section-list-repeated
- flag: 7 Repetition
- where: nav in `TextLayer.tsx`, `WritingHeader.tsx`, `sitemap.ts`
- status: fixed
- first seen: 2026-11-26
- fixed: 2026-11-26
- note: three hand-written lists of sections; `sections` in `routes.ts` is the one list

## theme-application-spread
- flag: 7 Repetition
- where: theme switch in `three/experience.ts`; `Stage.hemi` exposed to callers
- status: fixed
- first seen: 2026-11-26
- fixed: 2026-11-26
- note: one `applyTheme`; the stage hides its light behind `setAmbient`

## parsed-display-strings
- flag: 14 Non-obvious Code
- where: `profile.role.split(' ').pop()` and `profile.location.split(' ·')` in `three/hud.ts`
- status: fixed
- first seen: 2026-11-26
- fixed: 2026-11-26
- note: content now says what the desk prints (`roleLines`, `country`) instead of the HUD parsing prose

## sound-errors-swallowed
- flag: 17 Catch-and-Ignore
- where: `play` in `three/sound.ts`
- status: accepted
- first seen: 2026-11-26
- reason: sound is decoration; a blocked AudioContext must never break input, and there is nothing a caller could do with the error

## experience-owns-input-and-camera
- flag: 1 Shallow Module (checked, not triggered as shallow; noted for size)
- where: `mountExperience` in `three/experience.ts`
- status: accepted
- first seen: 2026-11-26
- reason: camera transitions, input and routing share the `busy`/`pending` state; splitting them would create conjoined modules. The interface stays three calls (`go`, `setInteractive`, `dispose`)
