import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode, {
  type Options as RehypePrettyCodeOptions,
} from "rehype-pretty-code";
import { mdxComponents } from "@/components/mdx-components";

interface MDXContentProps {
  /** Raw MDX body string (e.g. from `getWorkBySlug(slug).content`). */
  source: string;
}

const prettyCodeOptions: RehypePrettyCodeOptions = {
  theme: "github-light",
  keepBackground: true,
};

/**
 * Server Component that compiles and renders an MDX body string using the
 * design-system element map. Frontmatter is parsed separately in `lib/mdx.ts`,
 * so only the body is passed here.
 */
export function MDXContent({ source }: MDXContentProps) {
  return (
    <div className="mdx-content [&>section:not(:first-child)]:mt-32">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
          },
        }}
      />
    </div>
  );
}
