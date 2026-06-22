import type { Metadata } from "next";
import "@/styles/globals.css";
import { Nav } from "@/components/Nav";
import { navItems } from "@/content/nav";

export const metadata: Metadata = {
  // TODO: replace with real site metadata
  title: "Portfolio",
  description: "",
};

/**
 * Applies the saved (or system) theme before first paint to avoid a flash of
 * the wrong theme. Mirrors the persistence logic in ThemeToggle.
 */
const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans text-body text-primary bg-bg">
        <div className="relative">
          <Nav items={navItems} />
          {children}
        </div>
      </body>
    </html>
  );
}
