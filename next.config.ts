import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ["images.unsplash.com", "images.pexels.com"],
    },
    allowedDevOrigins: ["http://192.168.0.100:3000"], // your LAN dev URL


};

export default nextConfig;
