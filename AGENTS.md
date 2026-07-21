# Agent notes — alg0.dev

Astro site with a single React island (`AlgoViz`) for the interactive visualizer.
Prefer **Astro + plain JS** for static chrome; keep React for playback, visualizers, Monaco, and orchestration.

## DOM helpers: `$` and `$$`

Defined in `src/lib/dom.ts` (import `@lib/dom`). **Always prefer these** over raw `querySelector` / `querySelectorAll` in client code.

```ts
import { $, $$ } from '@lib/dom'

// One element (or null)
const btn = $<HTMLButtonElement>('[data-theme-toggle]')

// All matches as Element[]
const tabs = $$<HTMLButtonElement>('[role="tab"]', panel)
```

| Helper                | Equivalent              | Returns     |
| --------------------- | ----------------------- | ----------- |
| `$(selector, root?)`  | `root.querySelector`    | `T \| null` |
| `$$(selector, root?)` | `root.querySelectorAll` | `T[]`       |

- Optional second arg scopes the search (`ParentNode`, default `document`).
- Pass a generic for typed elements: `$<HTMLInputElement>('#q')`.
- Do **not** reintroduce ad-hoc `querySelector` helpers elsewhere.

## Theme

- Module: `src/lib/theme.ts` (`getTheme`, `setTheme`, `toggleTheme`, `resolveInitialTheme`).
- FOUC-safe init stays **inline** in `Layout.astro` (must run before paint; cannot import modules).
- Interactive toggle: put `data-theme-toggle` on a button. Global listener in `src/scripts/client.ts` (event delegation) — no React `onClick` required.
- Theme changes dispatch `window` event `themechange` with `detail: 'light' \| 'dark'`.

## Client bootstrap

`src/scripts/client.ts` is imported once from `Layout.astro`. Add other small, site-wide plain-JS behaviors there (delegation preferred) instead of one-off scripts per page.

## React vs Astro

| Use React                                | Prefer Astro / plain JS                                           |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `AlgoViz` orchestration + playback state | `SiteHeader.astro` (logo, breadcrumb, langs, theme, **controls**) |
| Monaco / `CodePanel` editor body         | `HeaderControls.astro` + `controls.ts`                            |
| Graph / concept visualizers              | `SiteSidebar.astro` + `sidebar.ts`                                |
| Mobile bottom transport bar              | `CodePanelShell.astro` + `code-panel-shell.ts`                    |
|                                          | Array/matrix visualizers (`src/lib/visualizers/*`)                |
|                                          | Keyboard shortcuts (`keyboard.ts`)                                |
|                                          | Layout, SEO, static copy                                          |

### Site header

- Static chrome: `SiteHeader.astro` (breadcrumb, logo, langs, theme, **playback controls**, code expand/open).
- No React portals into the header.
- SPA selection updates breadcrumb/lang with `syncHeaderChrome` (`header-chrome.ts`).
- Playback UI syncs via event bus: `publishPlaybackState` / `dispatchPlaybackCommand` (`playback.ts`).

### Code panel shell

- Outside the React island (sibling of `AlgoViz`), like the sidebar.
- Shell + resize + mobile drawer: `CodePanelShell.astro` + `code-panel-shell.ts`.
- Monaco content: React `CodePanel` portaled into `[data-code-panel-mount]` only.

### Welcome (home)

- Static copy + shortcuts: `WelcomeChrome.astro`, passed as `slot="welcome-chrome"` from **every** page (algorithm pages included, so the SPA back-to-home path still has copy). Astro turns named slots into props, so `AlgoViz` receives it as `welcomeChrome`.
- The default slot is the algorithm description (`AlgorithmDescription.astro` → about tab). Keep the two slots separate: a single `children` slot leaks the description into the welcome screen.
- Interactive demo: `AlgorithmShowcase` (React) inside `WelcomeScreen` — the only React left there.
- `WelcomeScreen` lays out chrome via `data-welcome-chrome` / `data-welcome-shortcuts` + CSS `order` so the showcase sits between them.
- Astro wraps island slots in `<astro-slot>` — WelcomeScreen uses `[&_astro-slot]:contents` so those nodes participate in flex `order`.

### Algorithm description (about tab)

- `AlgorithmDescription.astro` renders the copy; `ComplexityChart.astro` renders the time-complexity curve. Both SSR, zero client JS.
- Parsing + SVG geometry live in `src/lib/complexity.ts` — server-only, **do not import from a React component** or the parser ships to the browser.

### Sidebar

- **Outside the React island** (sibling of `AlgoViz` in pages), same pattern as `SiteHeader`.
- Full shell + catalog in `SiteSidebar.astro`: search UI, category icons (inline SVG), real `<a href>`, desktop resize handle, mobile drawer chrome.
- Category expand uses native `<details open>` (no JS). Selected color/dot via CSS vars + `aria-current` (no class rebuild in JS).
- SSR tokens only: `src/lib/sidebar-meta.ts` — **do not import from client bundles**.
- Thin client: `src/lib/sidebar.ts` via `initSidebar()` — search filter, resize drag, mobile open/close, SPA click bridge, `syncSidebarSelection` (toggles `aria-current` only).
- Click (no modifier) → `alg0:select-algorithm` `{ id }`; AlgoViz loads SPA-style and calls `syncSidebarSelection` + `syncHeaderChrome`.

When adding UI, ask: does this need reactive shared state with the visualizer? If not, implement outside the React island.

## Code languages

Algorithm sources live under `src/lib/algorithms/{python,java,cpp,rust}/`.
Line maps use `#@n` / `//@n` markers via `annotated()` in `src/lib/code-languages.ts`.
Language packs load on demand through `loadLanguageImplementation` in `src/lib/algorithms/loaders.ts`.

## Fonts

- Originals live in `fonts-src/` (not served). `public/fonts/` holds **generated** Latin subsets — never edit by hand.
- `pnpm fonts:subset` regenerates them (`scripts/subset-fonts.mjs`): keeps ASCII + Latin-1 + the punctuation/math/box glyphs the UI renders, and clips Geist Mono's `wght` axis to 400–700.
- Adding copy or visualizer glyphs outside that charset? Extend `RANGES` in the script and re-run, otherwise the character falls back to the system font.
- Only two faces ship: Geist Pixel Square (`--font-sans` **and** `--font-heading`) and Geist Mono. Both are `<link rel="preload">`ed in `Layout.astro` because both paint above the fold.
