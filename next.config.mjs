/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile elsewhere doesn't mislead Next.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    // Site-wide photography quality. Next's Image default is still 75, but
    // Next 16 coerces to the closest allowed value — with only 90 listed,
    // every optimized <Image> lands at 90 without per-call `quality` props.
    qualities: [90],
  },
};

export default nextConfig;
