/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    loader: "default",
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },
};

export default nextConfig;
