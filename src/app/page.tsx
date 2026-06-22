import { Hero } from "@/components/Hero";
import { hero } from "@/content/hero";

export default function HomePage() {
  // Top padding (pt-64 ≈ 258px) is a Tailwind-default placeholder for the
  // hero's offset from the top of the page; refine with custom spacing later.
  return (
    <main className="mx-auto max-w-7xl px-6 pt-64">
      <Hero {...hero} />
    </main>
  );
}
