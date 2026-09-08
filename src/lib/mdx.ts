import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** Absolute path to the case-study MDX content directory. */
export const WORK_DIR = path.join(process.cwd(), "src", "content", "work");

/**
 * Frontmatter contract for every case-study `.mdx` file. Mirrors the MDX schema
 * in the design brief — keep these in sync.
 */
export interface WorkFrontmatter {
  /** Long descriptive headline — the case-study page subtitle. */
  title: string;
  /** Project / product name — the case-study page's large heading (e.g. "ScienceJury"). */
  name: string;
  /** Org or context line (e.g. "ProtoLab | UC San Diego Design Lab"). Card preheader. */
  affiliation: string;
  /** Short results summary — used by cards + page meta description, not the header. */
  description: string;
  year: string;
  tags: string[];
  coverImage: string;
  /** Card/link label (e.g. "Read case study"). */
  linkLabel: string;
  /**
   * Optional in-header skip CTA label (e.g. "Skip to final design").
   * Requires {@link skipHref}.
   */
  skipLabel?: string;
  /** In-page (or absolute) href for the skip CTA (e.g. "#solution"). */
  skipHref?: string;
  /**
   * Case-study palette tone for the skip CTA (e.g. `"purple"`).
   * Maps to `--cs-*` on the case-study article.
   */
  skipTone?: string;
  /**
   * Curated still paths for the skip CTA cursor-follow preview
   * (e.g. solution screenshots). Decorative; omit for button-only.
   */
  skipPreview?: string[];
  /** Controls sort order on the home page (ascending). */
  order: number;
  published: boolean;
}

/** Frontmatter plus the URL slug derived from the filename. */
export interface WorkMeta extends WorkFrontmatter {
  slug: string;
}

/** A fully parsed case study: metadata plus raw MDX body. */
export interface Work extends WorkMeta {
  /** Raw MDX body (frontmatter stripped), ready to be compiled/rendered. */
  content: string;
}

const DEFAULT_FRONTMATTER: WorkFrontmatter = {
  title: "",
  name: "",
  affiliation: "",
  description: "",
  year: "",
  tags: [],
  coverImage: "",
  linkLabel: "",
  order: 0,
  published: false,
};

function readWorkFiles(): string[] {
  if (!fs.existsSync(WORK_DIR)) return [];
  return fs.readdirSync(WORK_DIR).filter((file) => file.endsWith(".mdx"));
}

function toSlug(filename: string): string {
  return filename.replace(/\.mdx$/, "");
}

function parseFrontmatter(data: Record<string, unknown>): WorkFrontmatter {
  return {
    ...DEFAULT_FRONTMATTER,
    ...data,
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    skipPreview: Array.isArray(data.skipPreview)
      ? (data.skipPreview as unknown[]).filter(
          (item): item is string => typeof item === "string" && item.length > 0,
        )
      : undefined,
  };
}

/**
 * Returns metadata for every published case study, sorted by `order` ascending.
 * Does not read MDX bodies — use {@link getWorkBySlug} for full content.
 */
export function getAllWork(): WorkMeta[] {
  return readWorkFiles()
    .map((file) => {
      const raw = fs.readFileSync(path.join(WORK_DIR, file), "utf8");
      const { data } = matter(raw);
      return { slug: toSlug(file), ...parseFrontmatter(data) };
    })
    .filter((work) => work.published)
    .sort((a, b) => a.order - b.order);
}

/** Returns the slug for every published case study (for `generateStaticParams`). */
export function getAllWorkSlugs(): string[] {
  return getAllWork().map((work) => work.slug);
}

/**
 * Next published case study after `slug` (by `order`, wrapping). Returns
 * `null` when there is no other published study to link to.
 */
export function getNextWork(slug: string): WorkMeta | null {
  const all = getAllWork();
  if (all.length < 2) return null;
  const index = all.findIndex((work) => work.slug === slug);
  if (index === -1) return all[0] ?? null;
  return all[(index + 1) % all.length] ?? null;
}

/**
 * Reads a single case study (metadata + raw MDX body) by slug.
 * Returns `null` when the file does not exist.
 */
export function getWorkBySlug(slug: string): Work | null {
  const filePath = path.join(WORK_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  return { slug, ...parseFrontmatter(data), content };
}
