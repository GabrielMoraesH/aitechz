import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Eight 5 MB images plus multipart/form-data overhead.
      bodySizeLimit: "42mb",
    },
  },
};

export default nextConfig;
