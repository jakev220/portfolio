# Portfolio

A personal product design portfolio. Next.js (App Router) · Tailwind CSS v3 · Framer Motion · MDX content.

This README is the **operating manual** for building the site with the AI agent. It has two jobs:

1. Tell you (and the agent) how to add content, components, and interactions the right way.
2. Act as a **living status board** — the [Status & Next Up](#-status--next-up) section is always current.

---

## ✅ Status & Next Up

> The agent keeps this section updated after every work session. Read this first.

**Phase: Home page assembled (hero · work · footer · nav · theme) → building case-study pages.**

**Done**
- [x] Project scaffold (Next.js 16, Tailwind v3, Framer Motion, TypeScript)
- [x] Design tokens (`src/lib/tokens.ts`) + Tailwind mapping
- [x] `globals.css` with color CSS vars + `@font-face`
- [x] Neue Montreal `.woff2` files added & wired (Regular/Italic/Bold/BoldItalic)
- [x] Neutral palette applied (shadcn "Neutral") + link/accent color set to `#0066CC`
- [x] Visual direction documented (see [Visual direction](#visual-direction))
- [x] MDX parsing utilities (`src/lib/mdx.ts`)
- [x] MDX render pipeline — `next-mdx-remote/rsc` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` (`MDXContent.tsx` + `mdx-components.tsx`)
- [x] `CaseStudyCard` — **stack** + **card** + **inline** variants (home work section)
- [x] `CaseStudyCardInline` — desktop cursor-following media preview (Framer Motion, portal, hover-capable devices only)
- [x] `WorkGrid` — arranges cards per variant (stack = 1-col, card = 2-col, inline = 1-col list), responsive gaps
- [x] `WorkViewToggle` — 3 ghost icon buttons (44px, 16px gap); selected = round grey border
- [x] `Icon` — single `<Icon name>` primitive (path registry, `currentColor`, size/className props); supports fill **and** stroke icons (`arrow-*`, `zoom-*`, `refresh`, `expand`, `close`, view toggles, `mode`)
- [x] Case-study MDX layout — `Section` / `Split` / `Figure` / `Accordion` / `FlowDiagram` (+ tabs & images), lightbox, charts, insight cards (see `DESIGN_SYSTEM.md`)
- [x] `Hero` — home hero with interactive avatar (hover-cycles images) + macOS folder; subhero accent links (external get `↗` + new tab via `src/lib/links.ts`)
- [x] `WorkSection` — home work section: `WorkViewToggle` + `WorkGrid` with 4 preview case studies
- [x] `Footer` — 3-part (contact links, "explore" media card, meta row) + `FooterClock` (live Pacific time, sun/moon icon)
- [x] `Nav` — Work/Play/About + theme toggle, right-aligned to the content grid; **auto-hide on scroll-down, reveal on scroll-up / cursor-to-top / keyboard focus**; frosted rounded reveal box (optically outset to align to grid)
- [x] **Dark mode** — `ThemeToggle` toggles `.dark` on `<html>`; theme-aware token overrides in `globals.css`; persisted to `localStorage` + respects system preference; no-FOUC init script in `layout.tsx`
- [x] Repo pushed to GitHub (SSH)

**Next up (in order)**
1. **Pick the hero accent color** — the one open color decision; everything else neutral. _(You.)_
2. **Finalize palettes** — dark-mode values are preview placeholders; lock light + dark together once the accent is set. _(You.)_
3. **Build remaining components**: `Container`, `Link` (underlined, `#0066CC`, trailing `↗` — generalize `src/lib/links.ts`), `CaseStudyHeader`.
4. **Assemble pages** — `work/[slug]` (case study, renders body via `<MDXContent>`) and retire the temporary preview content.
5. **Add interactions** — Framer Motion on specific components, only when requested.
6. **Deploy** — connect the GitHub repo to Vercel.

**Optional / parked**
- **In-line mobile "press" preview** — feasible via pointer/touch events but competes with tap-to-navigate + scroll; deferred per discussion. Ask to add it.

**Blocked / decisions needed**
- **MDX schema vs `CaseStudyCard` slots:** the card needs a short `name` (preheader) separate from the big `title`, plus `affiliation`. Current frontmatter has `title`, `role`, `year` — decide the field mapping (and any additions) when wiring real case studies.
- Hero accent color undecided (Next-up #1); body text stays neutral regardless.
- Dark palette values are preview placeholders (shadcn Neutral dark + a lighter `#4c9fff` link blue) — finalize with the light palette.
- Per-case-study accent: add an `accent` field to the case-study MDX frontmatter when case studies are built (used for backgrounds/visual elements only).
- `↗` on links + internal/external handling currently lives in `src/lib/links.ts`; fold into a dedicated `Link` component when built.

---

## Getting started

This project is pinned to **Node 21** (your system default is too old for Next 16).

```bash
nvm use            # reads .nvmrc → Node 21
npm install        # first time only
npm run dev        # http://localhost:3000
```

Other scripts: `npm run build` · `npm run start` · `npm run lint` · `npm run typecheck`.

---

## Project structure

```
src/
  app/                 # routes (layout.tsx, page.tsx, work/[slug]/page.tsx)
  components/          # one component per file, PascalCase
  content/             # data for sections (hero.ts, nav.ts, footer.ts)
    work/              # one .mdx per case study (drives the home work grid)
  lib/
    tokens.ts          # design tokens — single source of truth
    mdx.ts             # frontmatter parsing + work listing
    links.ts           # internal/external link detection (↗ + new-tab rules)
  styles/globals.css   # color vars (light + .dark), @font-face, base styles
public/fonts/          # Neue Montreal .woff2 files
public/icons/          # standalone SVGs (e.g. mode.svg for the theme toggle)
tailwind.config.ts     # type scale generated FROM tokens.ts
```

---

## Visual direction

The guiding aesthetic — keep every component aligned to this.

- **Minimalist & neutral.** Text is neutral (the shadcn Neutral grays) across the
  entire site, including inside case studies, to preserve a clean feel.
- **Links:** color `#0066CC` (the `--color-accent` token), **underlined**, in the
  spirit of Apple's Human Interface Guidelines. Links end with a `↗` character.
- **Per-case-study accent:** each case study has its own theme accent color, spread
  through the page as **backgrounds / visual elements** (never applied to body text).
  This lives in the case study's MDX frontmatter (planned `accent` field), not in the
  global tokens.
- **Hero accent:** still TBD — not set yet.
- **Light & dark mode:** every color is a token, so the site themes by swapping token
  values under `.dark` on `<html>` (no per-component dark styles). Toggled via the nav's
  `ThemeToggle`; dark values are provisional placeholders (see `DESIGN_SYSTEM.md`).

## Design system quick reference

Use these instead of raw values — the agent will too. Defined in `src/lib/tokens.ts`.
Full reference: [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

**Type utilities** (size · line-height · tracking · weight baked in):
`text-caption` · `text-label` · `text-body` · `text-body-large` · `text-h3` · `text-h2` · `text-h1`

**Color utilities** (map to CSS vars in `globals.css`):
`bg-bg` · `bg-surface` · `border` / `border-border` · `text-primary` · `text-secondary` · `text-accent` / `bg-accent`

**Spacing:** Tailwind defaults (placeholder until custom scale is added in `tailwind.config.ts`).

> Don't introduce font sizes, line heights, or colors outside this system. If something's missing, add it to `tokens.ts`/`globals.css` first, then use it.

---

## How to add a case study (content)

1. Create `src/content/work/<slug>.mdx`. The filename is the URL slug.
2. Add frontmatter (all fields required):

```mdx
---
title: "Project Name"
description: "One-line summary."
year: "2026"
role: "Lead Product Designer"
tags: ["Mobile", "Design System"]
coverImage: "/work/<slug>/cover.jpg"
order: 1            # lower = earlier on home page
published: true     # false = hidden everywhere
---

Write the case study body here in MDX/Markdown.
```

3. Put images in `public/work/<slug>/` (diagram WebPs in `public/work/<slug>/diagrams/` with kebab-case names).
4. `getAllWork()` auto-lists published studies sorted by `order`; no code change needed.

**How the body renders:** the MDX body is rendered by `<MDXContent source={...} />`
(`next-mdx-remote/rsc`). Every element is mapped to the design tokens in
`src/components/mdx-components.tsx`. Supported out of the box: headings (with
auto-generated `id`s), paragraphs, **bold**/_italic_, links, lists, blockquotes,
GitHub-flavored tables, horizontal rules, inline code, and syntax-highlighted
fenced code blocks (Shiki, `github-light`). Custom components (e.g. `<Figure>`,
`<FlowDiagram>`, `<InsightCard>`, `<Accordion>`) are registered in that same map —
full list in [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).

---

## How to add a component

Tell the agent: **"build [ComponentName]"**. Every component follows these rules
(enforced automatically):

- Typed props interface at the top of the file; **no hardcoded text** (props/MDX only).
- One component per file in `src/components/`, PascalCase.
- Tailwind utilities only (no inline styles), using the design-system classes above.
- Mobile-first: base styles, then `md:` / `lg:`.
- Animation is **opt-in** — not added unless you ask for it on that component.

## How to add interactions (animation)

- Request it explicitly: _"add a fade-in on scroll to ProjectCard."_
- Framer Motion is additive only: layout must work without it; animated nodes are
  wrapped in `<motion.div>` and never change document flow.

---

## 🪙 Working with the agent to minimize tokens

The biggest token costs are re-reading files and re-deriving context. Keep sessions cheap:

1. **Point, don't paste.** Reference paths (`src/components/ProjectCard.tsx`), not file contents. The agent can open what it needs.
2. **One component per request.** "Build ProjectCard" beats "build the whole home page" — smaller diffs, fewer re-reads, less rework.
3. **Lean on this README.** It encodes the rules, so you don't need to restate the brief each time. Just say "follow the README conventions."
4. **Trust the design system.** Say "use the type + color tokens" instead of specifying pixel values — avoids back-and-forth.
5. **Batch tiny tweaks.** Group small copy/spacing edits into one message rather than many.
6. **Be specific about scope.** Name the exact file/component and the exact change. Vague asks cause exploratory reading.
7. **Don't ask for full rebuilds/verification** unless something's actually broken — `npm run typecheck` locally is cheaper than an agent build loop.
8. **Keep "Next Up" as the source of truth.** Start a session with "what's next?" and the agent reads this section instead of re-scanning the repo.

---

## Deployment

Push to GitHub, import the repo in Vercel. Framework preset: **Next.js** (auto-detected).
Set the Node version to 20.x+ in Vercel project settings to match `engines`.
