/** URL/fragment-safe slug from a section label (e.g. "Formative study" → "formative-study"). */
export function slugifyLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
