import type { MDXComponents } from "mdx/types";

/**
 * Maps MDX/Markdown elements to the portfolio design system (see tokens.ts).
 * Content (text) always comes from the MDX body — these only apply styling.
 *
 * Notes:
 * - Links get the accent color + underline. The trailing `↗` and internal/
 *   external handling are deferred to the future `Link` component.
 * - `code`/`pre` styling lives in `globals.css` under `.mdx-content` so it can
 *   distinguish inline code from highlighted code blocks (rehype-pretty-code).
 */
export const mdxComponents: MDXComponents = {
  h1: (props) => <h1 className="text-h1 text-primary mt-12 mb-4" {...props} />,
  h2: (props) => <h2 className="text-h2 text-primary mt-10 mb-3" {...props} />,
  h3: (props) => <h3 className="text-h3 text-primary mt-8 mb-2" {...props} />,
  p: (props) => <p className="text-body text-primary my-4" {...props} />,
  a: (props) => (
    <a
      className="text-accent underline underline-offset-2 transition-opacity hover:opacity-70"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="text-body text-primary my-4 list-disc space-y-1 pl-6" {...props} />
  ),
  ol: (props) => (
    <ol className="text-body text-primary my-4 list-decimal space-y-1 pl-6" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="text-secondary border-l-2 border-border my-6 pl-4 italic"
      {...props}
    />
  ),
  hr: () => <hr className="border-border my-10" />,
  strong: (props) => <strong className="font-bold" {...props} />,
  em: (props) => <em className="italic" {...props} />,
  // eslint-disable-next-line @next/next/no-img-element
  img: (props) => (
    // TODO: upgrade to a <Figure> (next/image + caption) component later.
    // eslint-disable-next-line @next/next/no-img-element
    <img className="my-6 h-auto w-full rounded-md" alt="" {...props} />
  ),
};
