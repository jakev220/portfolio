import { SplitGrid } from "@/components/case-study/SplitGrid";

export interface AboutProseProps {
  heading: string;
  /** One string per paragraph. */
  body: string[];
}

/**
 * About prose row: h3 heading on the left, stacked body paragraphs on the
 * right (16px gap). Geometry from `SplitGrid` (400 + 64 + flex).
 */
export function AboutProse({ heading, body }: AboutProseProps) {
  return (
    <SplitGrid
      left={<h2 className="text-h3 text-heading">{heading}</h2>}
      right={
        <div className="flex flex-col gap-4">
          {body.map((paragraph) => (
            <p key={paragraph} className="text-body m-0">
              {paragraph}
            </p>
          ))}
        </div>
      }
    />
  );
}
