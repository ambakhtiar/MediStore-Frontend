import "./src/env";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // experimental: { appDir: true },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "images.pexels.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "deifkwefumgah.cloudfront.net",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "upload.wikimedia.org",
                pathname: "/**",
            },

        ],
    },
    // allowedDevOrigins: ["http://192.168.0.104:3000"],
    async rewrites() {
        return [
            {
                source: "/api/auth/:path*",
                destination: `${process.env.NEXT_PUBLIC_URL}/api/auth/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;