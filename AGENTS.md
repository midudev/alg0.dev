# Agent notes — alg0.dev

Astro + plain JS only. **No React.** Prefer SSR Astro chrome and thin client modules in `src/lib/` / `src/scripts/client.ts`.

## DOM helpers: `$` and `$$`

Defined in `src/lib/dom.ts` (import `@lib/dom`). **Always prefer these** over raw `querySelector` / `querySelectorAll` in client code.

```ts
import { $, $$ } from '@lib/dom'

const btn = $<HTMLButtonElement>('[data-theme-toggle]')
const tabs = $$<HTMLButtonElement>('[role="tab"]', panel)
```

| Helper                | Equivalent              | Returns     |
| --------------------- | ----------------------- | ----------- |
| `$(selector, root?)`  | `root.querySelector`    | `T \| null` |
| `$$(selector, root?)` | `root.querySelectorAll` | `T[]`       |

## Theme

- Module: `src/lib/theme.ts`. FOUC-safe init stays **inline** in `Layout.astro`.
- Toggle: `data-theme-toggle` + listener in `src/scripts/client.ts`.

## Client bootstrap

`src/scripts/client.ts` is imported once from `Layout.astro`. Site-wide behaviors go there (sidebar, controls, code panel shell, keyboard, showcase, **algo-page**).

## Architecture

| Area           | Implementation                                                         |
| -------------- | ---------------------------------------------------------------------- |
| Header         | `SiteHeader.astro` + `HeaderControls.astro` + `controls.ts`            |
| Sidebar        | `SiteSidebar.astro` + `sidebar.ts`                                     |
| Code panel     | `CodePanelShell.astro` + `code-panel-shell.ts` + `code-panel-state.ts` |
| Playback       | `create-playback.ts` + bus in `playback.ts`                            |
| Algorithm page | `AlgoStage.astro` + `algo-page.ts`                                     |
| Home           | `WelcomeHome.astro` + `showcase.ts` (no algo-page)                     |
| Visualizers    | `array`/`matrix`/`graph` + lazy `concept/*` per type                   |

### Algorithm page

- Markup: `AlgoStage.astro` (viz host, step description SSR, mobile transport).
- Bootstrap: `<script type="application/json" data-algo-bootstrap>` with `{ locale, algorithm, steps }`.
- Runtime: `initAlgoPage` / `initAllAlgoPages` — SPA select, popstate, playback, chrome sync, step paint.
- Sidebar SPA: dispatches cancelable `alg0:select-algorithm`; algo-page `preventDefault()`s to claim; home navigates fully.

### Playback

- Engine: `createPlayback` — steps, play/pause, speed, autoplay.
- Bus: `publishPlaybackState` / `dispatchPlaybackCommand`.
- Header controls + keyboard only use the bus.

### Visualizers

- Array / matrix / graph: eager modules under `src/lib/visualizers/`.
- **Concept**: split under `src/lib/visualizers/concept/` (one file per type: `big-o`, `linked-list`, …).
  - Entry `concept/index.ts` **dynamic-imports** only `step.concept.type` (cached after first use).
  - Shared SVG/DOM helpers: `concept/dom.ts`.
- Stage: `bindStepVisualizer` → `renderStepVisualizer` (async for concept) on `[data-step-viz]`.
- Home showcase: same path via `showcase.ts` (loads concept chunks only for concept demos in the cycle).

### Code panel

- Outside the stage (sibling), like the sidebar.
- Content driven by plain JS (`publishCodePanelState`), not React.

When adding UI: does it need shared reactive state with playback? If not, keep it Astro/static + optional plain-JS listener.

## Code languages

Algorithm sources under `src/lib/algorithms/{python,java,cpp,rust}/`.
Line maps: `#@n` / `//@n` via `annotated()` in `code-languages.ts`.
Packs load on demand through `loaders.ts`.

## Fonts

- Originals in `fonts-src/`; `public/fonts/` is generated — `pnpm fonts:subset`.
- Faces: Geist Pixel Square + Geist Mono.
