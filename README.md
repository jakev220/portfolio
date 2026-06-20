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
- [x] Provisional colors applied — shadcn "Neutral" palette
- [x] MDX parsing utilities (`src/lib/mdx.ts`)
- [x] Repo pushed to GitHub (SSH)

**Next up (in order)**
1. **Finalize the color palette** — currently the shadcn "Neutral" placeholder in `src/styles/globals.css` (6 vars). Pick final values, especially a real `--color-accent` (Neutral has no chromatic accent). _(You — no agent needed.)_
2. **Choose the MDX render pipeline** — `mdx.ts` parses frontmatter + raw body, but the body isn't rendered yet. Pick `next-mdx-remote/rsc` (recommended) so case-study bodies render. _(Ask the agent.)_
3. **Build core components**, smallest first: `Container` → `Prose`/type primitives → `ProjectCard` → `WorkGrid` → `CaseStudyHeader`.
4. **Assemble pages** — home (`work` grid) and `work/[slug]` (case study). _(Replaces the placeholder `app/page.tsx`.)_
5. **Add interactions** — Framer Motion on specific components, only when requested.
6. **Deploy** — connect the GitHub repo to Vercel.

**Blocked / decisions needed**
- MDX render library not yet installed (see Next-up #2).
- Color palette not finalized — using shadcn "Neutral" as a placeholder, accent is a stand-in (see Next-up #1).

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
