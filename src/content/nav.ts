import type { NavItem } from "@/components/Nav";

/**
 * Primary navigation. Edit labels/destinations here — the Nav component stays
 * content-agnostic and derives the active item from the current route.
 * `/play` is a “Coming soon…” placeholder until that section ships.
 */
export const navItems: NavItem[] = [
  { label: "Work", href: "/" },
  { label: "Play", href: "/play" },
  { label: "About", href: "/about" },
];
