import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["images.unsplash.com", "images.pexels.com"],
    },
    allowedDevOrigins: ["http://192.168.0.104:3000"],
};

export default nextConfig;
