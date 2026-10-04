import type { Metadata } from "next";
import "@/styles/globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { footer } from "@/content/footer";
import { navItems } from "@/content/nav";

const siteDescription =
  "Jake Villaseñor is a product designer building digital experiences that help people find answers and decide what to do next.";

export const metadata: Metadata = {
  metadataBase: new URL("https://jakevillasenor.com"),
  title: {
    default: "Jake Villaseñor – Product Designer",
    template: "%s · Jake Villaseñor",
  },
  description: siteDescription,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://jakevillasenor.com",
    siteName: "Jake Villaseñor",
    title: "Jake Villaseñor – Product Designer",
    description: siteDescription,
    // Drop the file at `public/og.png` (1200×630 recommended).
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Jake Villaseñor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jake Villaseñor – Product Designer",
    description: siteDescription,
    images: ["/og.png"],
  },
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
      <body className="font-sans text-body min-h-dvh bg-bg">
        <div className="relative flex min-h-dvh w-full min-w-0 flex-col overflow-x-clip">
          <Nav items={navItems} />
          <div className="flex w-full min-w-0 flex-1 flex-col">{children}</div>
          <Footer {...footer} />
        </div>
      </body>
    </html>
  );
}
