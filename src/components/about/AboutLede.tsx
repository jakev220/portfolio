export interface AboutLedeProps {
  /** Semantic page title — sits in the hang-indent pocket. */
  label: string;
  body: string;
}

/**
 * About statement with a wrap-under hang indent.
 *
 * Desktop: label floats at **2 columns** of the 12-col / `gap-4` grid. Box
 * height matches one `text-h1` line (`3rem × 1.2`) with `items-end`, so
 * "About" sits on the bottom of the first body line. Following lines wrap
 * under full-width. Mobile: label stacks above the body (no float).
 *
 * Type tokens match the rest of the site: `text-label` + `text-h1`.
 */
export function AboutLede({ label, body }: AboutLedeProps) {
  return (
    <section className="about-lede">
      <h1 className="text-label text-secondary float-none mb-4 flex w-full items-end font-normal md:float-left md:mb-0 md:h-[calc(3rem*1.2)] md:w-[calc((100%-11rem)/6+1rem)] md:pr-4">
        {label}
      </h1>
      <p className="text-h1 text-primary m-0">{body}</p>
    </section>
  );
}
