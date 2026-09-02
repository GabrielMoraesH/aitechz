import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/*/image/upload/v*/aitechz/products/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/*/image/upload/aitechz/products/**",
        search: "",
      },
    ],
  },
  experimental: {
    serverActions: {
      // Eight 5 MB images plus multipart/form-data overhead.
      bodySizeLimit: "42mb",
    },
  },
};

export default nextConfig;
