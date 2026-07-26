# Design System

The current styles governing this portfolio. This is a **reference** — the source of
truth lives in code:

- `src/lib/tokens.ts` — typography, color-var, and breakpoint constants
- `tailwind.config.ts` — maps tokens to Tailwind utilities (type scale generated from tokens)
- `src/styles/globals.css` — color CSS variables, `@font-face`, base + MDX styles, first-paint enter animations
- `src/lib/about-transition.ts` — home → About exit timing + shared easing curve

> Rule: don't introduce a font size, line-height, or color outside this system. If
> something is missing, add it to `tokens.ts` / `globals.css` first, then use it.

_Status: foundation. Colors are provisional placeholders (shadcn "Neutral", light +
dark); hero accent and a custom spacing scale are not yet decided._

---

## Typography

**Font:** Neue Montreal (self-hosted via `@font-face`), with a system sans-serif fallback.

**Weights in use:** Regular **400**, Bold **700**, plus _italic_ for each.
(`Light` and `Medium` files exist in `public/fonts/` but are intentionally **unused** —
they're outside the system.)

**Type scale** — each token is a Tailwind utility (e.g. `text-h1`). Size · line-height ·
letter-spacing · weight are all baked into the utility.

| Token | Utility | Size | Line height | Tracking | Weight | Usage |
|-------|---------|------|-------------|----------|--------|-------|
| caption | `text-caption` | 0.875rem / 14px | 1.5 | 0em | 400 | Image captions, footnotes, helper text |
| label | `text-label` | 0.875rem / 14px | 1.5 | 0em | 400 | Section pre-headers, in-page nav anchors |
| body | `text-body` | 1rem / 16px | 1.6 | 0em | 400 | Default body text |
| h3 | `text-h3` | 1.5rem / 24px | 1.2 | 0em | 400 | Sub-section headers |
| h2 | `text-h2` | 2rem / 32px | 1.2 | -0.01em | 400 | Section headers |
| h1 | `text-h1` | 3rem / 48px | 1.2 | -0.01em | 400 | Case study page titles |

> `caption` and `label` are identical today but kept as separate tokens so they can
> diverge later (e.g. `label` may gain tracking or an uppercase treatment).

---

## Color

Provisional palette from **shadcn/ui "Neutral"** (the Tailwind neutral grays). Each token
is a CSS variable in `globals.css`, surfaced as Tailwind utilities.

The text scale is a **five-step neutral ramp** mapped from the Figma `black-N` shades
(darkest → lightest): primary (`black-100`) → heading (`black-82`) → body (`black-60`) →
secondary (`black-40`) → divider (`black-20`).

| Token | CSS variable | Value | Utilities | Role |
|-------|--------------|-------|-----------|------|
| bg | `--color-bg` | `#ffffff` | `bg-bg` | Page background |
| surface | `--color-surface` | `#f5f5f5` | `bg-surface` | Card / component backgrounds (neutral-100) |
| border | `--color-border` | `#e5e5e5` | `border`, `border-border` | Component strokes (neutral-200) |
| divider | `--color-divider` | `#d4d4d4` | `border-divider` | Content dividers, `black-20` (neutral-300) |
| text-primary | `--color-text-primary` | `#0a0a0a` | `text-primary` | `h1` / strong / emphasis, `black-100` (neutral-950) |
| text-heading | `--color-text-heading` | `#262626` | `text-heading` | `h2` / `h3` section headers, `black-82` (neutral-800) |
| text-body | `--color-text-body` | `#404040` | _(inherited base — see note)_ | Body / default text, `black-60` (neutral-700) |
| text-secondary | `--color-text-secondary` | `#737373` | `text-secondary` | Labels / captions / pre-headers, `black-40` (neutral-500) |
| accent | `--color-accent` | `#0066CC` | `text-accent`, `bg-accent` | Interactive accent / link color |

> **No `text-body` color utility.** A color named `body` would collide with the
> `text-body` **font-size** utility, so body text has no color class — it inherits the
> base `color: var(--color-text-body)` set on `body` in `globals.css`. Headings, labels,
> and emphasis opt _up/down_ from there with `text-primary` / `text-heading` /
> `text-secondary`.

### Theming (light / dark)

Because every color is a token (CSS variable), the site themes by **overriding the token
values**, not by adding per-component `dark:` styles. Dark values live under a `.dark`
selector in `globals.css`; the same Tailwind utilities (`bg-bg`, `text-primary`, …)
resolve to the dark values whenever `.dark` is present on `<html>`.

| Token | Light | Dark |
|-------|-------|------|
| bg | `#ffffff` | `#0a0a0a` (neutral-950) |
| surface | `#f5f5f5` | `#171717` (neutral-900) |
| border | `#e5e5e5` | `#262626` (neutral-800) |
| divider | `#d4d4d4` (neutral-300) | `#404040` (neutral-700) |
| text-primary | `#0a0a0a` | `#fafafa` (neutral-50) |
| text-heading | `#262626` (neutral-800) | `#e5e5e5` (neutral-200) |
| text-body | `#404040` (neutral-700) | `#d4d4d4` (neutral-300) |
| text-secondary | `#737373` | `#a3a3a3` (neutral-400) |
| accent | `#0066CC` | `#4c9fff` (lighter for contrast on dark) |

**How the theme is applied:**
- `ThemeToggle` (in the nav) toggles the `.dark` class on `<html>` and persists the
  choice to `localStorage`.
- A tiny inline script in `app/layout.tsx` sets the class **before first paint** (reads
  `localStorage`, falls back to `prefers-color-scheme`) to avoid a flash of the wrong theme.
- `color-scheme` is set per theme so native form controls / scrollbars match.
- For one-off translucency over a theme color, use `color-mix(in srgb, var(--color-…) N%,
  transparent)` (Tailwind's `/opacity` modifier doesn't work on these var-based colors).

**Open color decisions:**
- **Hero accent** — not yet chosen.
- **Dark palette values** — provisional placeholders; finalize alongside the light palette.
- **Per-case-study accent** — each case study will carry its own theme color (planned
  `accent` frontmatter field), used for backgrounds / visual elements only. Body text
  stays neutral everywhere.

---

## Spacing

Tailwind's **default spacing scale** is used as-is (placeholder). A custom scale can be
added later under `theme.extend.spacing` in `tailwind.config.ts` (extend, don't replace).

---

## Breakpoints

Tailwind defaults — do not customize. Mobile-first: base styles first, then `md:`, `lg:`.

| Prefix | Min width |
|--------|-----------|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

---

## Links

Per the visual direction (Apple HIG–inspired):

- Color: `#0066CC` (the `accent` token)
- **Underlined**
- End with a `↗` character _(planned — lands with the `Link` component; not yet implemented)_

In MDX bodies, links currently render with color + underline (the `↗` and
internal/external handling are deferred to the `Link` component).

---

## Motion

Motion is **additive**: layout must read correctly with animations disabled
(`prefers-reduced-motion: reduce` or no JS). Never animate layout that changes
document flow (no height collapses for primary content; expand/collapse is the
accordion exception).

### Principles

| Concern | Tool | Why |
|---------|------|-----|
| Page / section **enters** (refresh + soft nav) | **CSS** `@keyframes` in `globals.css` | Starts on first paint — no wait for React hydration |
| **Exits**, hover micro-interactions, scroll-linked effects | **Framer Motion** | Needs runtime state, scroll progress, or delayed `router.push` |
| Reduced motion | CSS `@media` and/or `useReducedMotion()` | Skip choreography; show the settled state immediately |

### Shared easing

Default curve for page transitions and hero enters:

`cubic-bezier(0.22, 1, 0.36, 1)` — exported as `EXIT_EASE` from
`src/lib/about-transition.ts` for Framer; mirrored in CSS animations.

### Timing tokens (`src/lib/about-transition.ts`)

Home → About **exit** (name + avatar click):

| Constant | Value | Role |
|----------|-------|------|
| `HOME_EXIT_MS` | 780ms | Fade for hero copy, work grid, footer |
| `REEL_EXIT_MS` | 900ms | Avatar reel rise + fade duration |
| `REEL_FADE_DELAY_MS` | 180ms | Reel opacity starts after the rise begins |
| `NAVIGATE_DELAY_MS` | 780ms | `router.push("/about")` after the home fade settles |

Signal: `beginHomeAboutExit()` dispatches `HOME_EXIT_EVENT`; `HomeExitShell` and
`Hero` listen and fade; `HeroAvatar` runs the reel exit then navigates.

### CSS enter classes (`globals.css`)

| Class | Duration | Delay | Travel | Used by |
|-------|----------|-------|--------|---------|
| `.hero-enter` | 0.85s | — | `translateY(8px)` → 0 | Home `<Hero>` section |
| `.about-hero-tile` | 0.7s | — | `translateY(10px)` → 0 | About collage tiles (base) |
| `.about-hero-tile-0` … `-3` | — | 0.12s + n×0.14s | — | Stagger L→R, T→B |
| `.about-hero-greeting` | 0.85s | 0.8s | `translateY(8px)` → 0 | About “Hi, I'm Jake!” block |
| `.about-lede-enter` | 0.85s | 1.1s | `translateY(8px)` → 0 | About hang statement (`HangStatement`) |

Fill mode is `both` so elements stay at the `from` state until the delay elapses.
Soft navigations remount the nodes and replay the same CSS animations.

### Other motion in the product

| Pattern | Where | Notes |
|---------|-------|-------|
| Scroll color reveal | `HangStatement` | Words interpolate secondary → primary via scroll progress; skipped when reduced motion |
| Avatar cycle + lift | `HeroAvatar` | Hover/focus cycles frames; slight `-translate-y` lift; accent name color |
| Folder icons | `HeroFolder` | Hover opens tool icons (Framer) |
| Accordion | `AccordionItem` | Ease-out **400ms** expand/collapse |
| Formative bars | `ScienceJuryFormativeCallout` | Bars grow on scroll into view (`whileInView`, once) |
| Nav chrome | `Nav` | Show/hide + backdrop opacity; `motion-reduce:transition-none` |

### When adding new motion

1. Prefer **CSS enters** for anything that should feel instant on refresh.
2. Put shared durations / easings in `about-transition.ts` (or a future
   `motion.ts`) — don’t hardcode one-off milliseconds in multiple files.
3. Always honor `prefers-reduced-motion`.
4. Update this section when you add a new first-class choreography.

---

## MDX content styling

Case-study MDX bodies render through `<MDXContent>` (`next-mdx-remote/rsc`), with every
element mapped to the tokens above in `src/components/mdx-components.tsx`.

| Element | Styling |
|---------|---------|
| `h1` | `text-h1`, `text-primary`, auto `id` (rehype-slug) |
| `h2` / `h3` | `text-h2` / `text-h3`, `text-heading`, auto `id` (rehype-slug) |
| `p` | `text-body` (inherits body color) |
| `a` | `text-accent` + underline |
| `ul` / `ol` / `li` | `text-body`, default list markers |
| `blockquote` | `text-secondary`, left border (`divider` token), italic |
| `strong` / `em` | weight 700 + `text-primary` / italic |
| `hr` | `divider` token |
| `img` | full-width, rounded _(upgrade to `<Figure>` planned)_ |
| inline `code` | `surface` background, rounded (scoped in `globals.css`) |
| fenced code | syntax-highlighted via `rehype-pretty-code` + Shiki (`github-light`) |
| tables | GitHub-flavored (`remark-gfm`) |

### Images (`next/image`)

Optimized images use **quality 90** site-wide. Configured via `images.qualities: [90]`
in `next.config.mjs` — Next 16 coerces the component default (75) to the closest
allowed value, so every optimized `<Image>` gets 90 without a per-call `quality`
prop. Do not add `quality={75}` (or other values); they will be coerced or rejected.

Exceptions: `unoptimized` images (e.g. the hero avatar cycle) skip the optimizer
and serve the source file as-is.

### Case-study section components (used as JSX in MDX bodies)

| Component | Purpose |
|-----------|---------|
| `<CaseStudyHeader>` | Frontmatter-driven: `<hgroup>` (name `h1` + descriptive subtitle), cover media, divider. |
| `<ProjectDetails>` | Beneath the header: meta column (Timeline / Team / Venue …) + project brief. Meta via nested `<Detail>`; brief as MDX prose. |
| `<Section>` | The section unit: `<section>` that stacks its children with a 64px internal gap (128px between sections). Compose rows + media inside. |
| `<Split>` | Lead row: `h2` heading (via `<SplitHeading>`) on the 400px left column + body prose on the right; optional eyebrow `label`. |
| `<MediaRow>` | Sub-row: `h3` heading (via `<SplitHeading>`) on the left + a `<Figure>` on the right. Stack several inside a `<Section>` for a goals list. |
| `<Figure>` | Aspect-locked media (`ratio="W/H"`): `next/image` or a `bg-surface` placeholder when no `src`. |
| `<Accent>` | Inline span in the darkest neutral (`text-primary`) for emphasizing body text. |
| `<Subtle>` | Inline span in the light grey (`text-secondary` / black-40) for de-emphasizing a phrase within body text — e.g. `1 UI/UX Designer <Subtle>(me!)</Subtle>`. |
| `<Accordion>` | Stack of collapsible rows; place inside a `<Section>`. Items separated by bottom dividers. |
| `<AccordionItem>` | One accordion row: `title` (+ optional `subtitle`) as string props; expanded body as MDX children. Multiple items can be open; ease-out 400ms expand/collapse. |

---

## Component rules

Every component in `src/components/` follows these (see README for the build workflow):

1. Content via props / MDX only — **no hardcoded strings** in JSX.
2. One component per file, PascalCase.
3. Tailwind utilities only — no inline styles (except runtime-dynamic values that can't be
   a build-time class, e.g. Framer Motion animation `style` or `<Figure>`'s `aspectRatio`).
4. Mobile-first and responsive by default.
5. Animation is additive — layout must work without Framer Motion; never affects flow.
6. Typed props interface at the top of each file.
