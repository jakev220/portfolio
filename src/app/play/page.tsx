import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Play",
  description: "Coming soon.",
};

/**
 * Play page placeholder until the section ships.
 */
export default function PlayPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 items-center justify-center px-6 pt-64 pb-24">
      <p className="text-body text-secondary m-0 text-center">Coming soon...</p>
    </main>
  );
}
