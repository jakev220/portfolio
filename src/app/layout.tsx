import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  // TODO: replace with real site metadata
  title: "Portfolio",
  description: "",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans text-body text-primary bg-bg">{children}</body>
    </html>
  );
}
