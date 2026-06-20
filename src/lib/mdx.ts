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
  title: string;
  description: string;
  year: string;
  role: string;
  tags: string[];
  coverImage: string;
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
  description: "",
  year: "",
  role: "",
  tags: [],
  coverImage: "",
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
