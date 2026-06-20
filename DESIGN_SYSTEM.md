# Design System

The current styles governing this portfolio. This is a **reference** — the source of
truth lives in code:

- `src/lib/tokens.ts` — typography, color-var, and breakpoint constants
- `tailwind.config.ts` — maps tokens to Tailwind utilities (type scale generated from tokens)
- `src/styles/globals.css` — color CSS variables, `@font-face`, base + MDX styles

> Rule: don't introduce a font size, line-height, or color outside this system. If
> something is missing, add it to `tokens.ts` / `globals.css` first, then use it.

_Status: foundation. Colors are a provisional placeholder (shadcn "Neutral"); hero
accent and a custom spacing scale are not yet decided._

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

| Token | CSS variable | Value | Utilities | Role |
|-------|--------------|-------|-----------|------|
| bg | `--color-bg` | `#ffffff` | `bg-bg` | Page background |
| surface | `--color-surface` | `#f5f5f5` | `bg-surface` | Card / component backgrounds (neutral-100) |
| border | `--color-border` | `#e5e5e5` | `border`, `border-border` | Default border (neutral-200) |
| text-primary | `--color-text-primary` | `#0a0a0a` | `text-primary` | Headings & body (neutral-950) |
| text-secondary | `--color-text-secondary` | `#737373` | `text-secondary` | Muted / helper text (neutral-500) |
| accent | `--color-accent` | `#0066CC` | `text-accent`, `bg-accent` | Interactive accent / link color |

**Open color decisions:**
- **Hero accent** — not yet chosen.
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

## MDX content styling

Case-study MDX bodies render through `<MDXContent>` (`next-mdx-remote/rsc`), with every
element mapped to the tokens above in `src/components/mdx-components.tsx`.

| Element | Styling |
|---------|---------|
| `h1` / `h2` / `h3` | `text-h1` / `text-h2` / `text-h3`, `text-primary`, auto `id` (rehype-slug) |
| `p` | `text-body text-primary` |
| `a` | `text-accent` + underline |
| `ul` / `ol` / `li` | `text-body text-primary`, default list markers |
| `blockquote` | `text-secondary`, left border (`border` token), italic |
| `strong` / `em` | weight 700 / italic |
| `hr` | `border` token |
| `img` | full-width, rounded _(upgrade to `<Figure>` planned)_ |
| inline `code` | `surface` background, rounded (scoped in `globals.css`) |
| fenced code | syntax-highlighted via `rehype-pretty-code` + Shiki (`github-light`) |
| tables | GitHub-flavored (`remark-gfm`) |

---

## Component rules

Every component in `src/components/` follows these (see README for the build workflow):

1. Content via props / MDX only — **no hardcoded strings** in JSX.
2. One component per file, PascalCase.
3. Tailwind utilities only — no inline styles (except Framer Motion `style` for dynamic
   animation values).
4. Mobile-first and responsive by default.
5. Animation is additive — layout must work without Framer Motion; never affects flow.
6. Typed props interface at the top of each file.
