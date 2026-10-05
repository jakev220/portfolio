/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cursor/browser previews often hit 127.0.0.1 while `next dev` binds as
  // localhost — without this, Next 16 blocks dev client resources and React
  // never hydrates (toggles, theme, etc. appear dead).
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // Pin the workspace root so a stray lockfile elsewhere doesn't mislead Next.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Site-wide photography quality. Next's Image default is still 75, but
    // Next 16 coerces to the closest allowed value — with only 90 listed,
    // every optimized <Image> lands at 90 without per-call `quality` props.
    qualities: [90, 100],
  },
};

export default nextConfig;
