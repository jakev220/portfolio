import type { NavItem } from "@/components/Nav";

/**
 * Primary navigation. Edit labels/destinations here — the Nav component stays
 * content-agnostic and derives the active item from the current route.
 */
export const navItems: NavItem[] = [
  { label: "Work", href: "/" },
  { label: "Archive", href: "/archive" },
  { label: "About", href: "/about" },
];
