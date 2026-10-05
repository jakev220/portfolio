"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/Icon";
import { useChromeVisibility } from "@/lib/chrome-visibility";

/**
 * Fixed left chrome on case-study pages. Same show/hide rules as the nav.
 * Same-origin referrer → history back; otherwise Work (`/`).
 */
export function CaseStudyBack() {
  const router = useRouter();
  const { hidden, floating, suppressed, reveal } = useChromeVisibility();

  const goBack = () => {
    try {
      const referrer = document.referrer;
      if (referrer) {
        const url = new URL(referrer);
        if (url.origin === window.location.origin) {
          router.back();
          return;
        }
      }
    } catch {
      /* fall through */
    }
    router.push("/");
  };

  return (
    <div
      aria-hidden={suppressed || undefined}
      onFocusCapture={reveal}
      className={`pointer-events-none fixed inset-x-0 top-0 z-50 transition-transform duration-300 ease-out motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-start px-6 pt-20">
        <div className="relative inline-flex sm:-ml-4">
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 rounded-xl border border-border bg-[color-mix(in_srgb,var(--color-bg)_70%,transparent)] backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none ${
              floating ? "opacity-100" : "opacity-0"
            }`}
          />
          <button
            type="button"
            onClick={goBack}
            className="pointer-events-auto relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-body text-secondary transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <Icon name="arrow-left" size={20} />
            <span>Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
