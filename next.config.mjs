/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile elsewhere doesn't mislead Next.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
