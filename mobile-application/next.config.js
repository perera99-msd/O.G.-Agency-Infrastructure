/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  runtimeCaching: [
    {
      headers: { "Cache-Control": "public, max-age=31536000, immutable" },
      matcher: /\/icons\/.*\/icons-.*\.png$/,
    },
    {
      headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
      matcher: "/:path*",
    },
  ],
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      "ogagency-5cc6a.firebasestorage.app",
      "firebasestorage.googleapis.com",
      "images.unsplash.com",
      "i.pravatar.cc",
      "lh3.googleusercontent.com",
    ],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = withPWA(nextConfig);
