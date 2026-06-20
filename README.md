# Portfolio

A personal product design portfolio. Next.js (App Router) · Tailwind CSS v3 · Framer Motion · MDX content.

This README is the **operating manual** for building the site with the AI agent. It has two jobs:

1. Tell you (and the agent) how to add content, components, and interactions the right way.
2. Act as a **living status board** — the [Status & Next Up](#-status--next-up) section is always current.

---

## ✅ Status & Next Up

> The agent keeps this section updated after every work session. Read this first.

**Phase: Foundation complete → building components.**

**Done**
- [x] Project scaffold (Next.js 16, Tailwind v3, Framer Motion, TypeScript)
- [x] Design tokens (`src/lib/tokens.ts`) + Tailwind mapping
- [x] `globals.css` with color CSS vars + `@font-face`
- [x] Neue Montreal `.woff2` files added & wired (Regular/Italic/Bold/BoldItalic)
- [x] Neutral palette applied (shadcn "Neutral") + link/accent color set to `#0066CC`
- [x] Visual direction documented (see [Visual direction](#visual-direction))
- [x] MDX parsing utilities (`src/lib/mdx.ts`)
- [x] MDX render pipeline — `next-mdx-remote/rsc` + `remark-gfm` + `rehype-slug` + `rehype-pretty-code` (`MDXContent.tsx` + `mdx-components.tsx`)
- [x] Repo pushed to GitHub (SSH)

**Next up (in order)**
1. **Pick the hero accent color** — the one open color decision; everything else neutral. _(You.)_
2. **Build core components**, smallest first: `Container` → `Link` (underlined, `#0066CC`, trailing `↗`) → `ProjectCard` → `WorkGrid` → `CaseStudyHeader`.
3. **Assemble pages** — home (`work` grid) and `work/[slug]` (case study, renders body via `<MDXContent>`). _(Replaces the placeholder `app/page.tsx`.)_
4. **Add interactions** — Framer Motion on specific components, only when requested.
5. **Deploy** — connect the GitHub repo to Vercel.

**Blocked / decisions needed**
- Hero accent color undecided (Next-up #1); body text stays neutral regardless.
- Per-case-study accent: add an `accent` field to the case-study MDX frontmatter when case studies are built (used for backgrounds/visual elements only).
- `↗` on links + internal/external handling: deferred to the `Link` component (MDX links currently get color + underline only).
- Per-case-study accent: add an `accent` field to the case-study MDX frontmatter when case studies are built (used for backgrounds/visual elements only).

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
  content/work/        # one .mdx per case study
  lib/
    tokens.ts          # design tokens — single source of truth
    mdx.ts             # frontmatter parsing + work listing
  styles/globals.css   # color vars, @font-face, base styles
public/fonts/          # Neue Montreal .woff2 files
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

## Design system quick reference

Use these instead of raw values — the agent will too. Defined in `src/lib/tokens.ts`.

**Type utilities** (size · line-height · tracking · weight baked in):
`text-caption` · `text-label` · `text-body` · `text-h3` · `text-h2` · `text-h1`

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

3. Put images in `public/work/<slug>/`.
4. `getAllWork()` auto-lists published studies sorted by `order`; no code change needed.

**How the body renders:** the MDX body is rendered by `<MDXContent source={...} />`
(`next-mdx-remote/rsc`). Every element is mapped to the design tokens in
`src/components/mdx-components.tsx`. Supported out of the box: headings (with
auto-generated `id`s), paragraphs, **bold**/_italic_, links, lists, blockquotes,
GitHub-flavored tables, horizontal rules, inline code, and syntax-highlighted
fenced code blocks (Shiki, `github-light`). Custom components (e.g. `<Figure>`,
`<Callout>`) get registered in that same map as we build them.

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
