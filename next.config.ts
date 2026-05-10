import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Prevent Next.js from bundling ws and its native addons —
  // bundling breaks the bufferutil fallback logic and causes
  // "t.mask is not a function" on Vercel serverless
  serverExternalPackages: [
    "ws",
    "bufferutil",
    "utf-8-validate",
    "@openai/realtime-api-beta",
    "@stream-io/openai-realtime-api",
  ],
  async redirects() {
    return[
      {
        source:"/",
        destination:"/meetings",
        permanent: false,
      }
    ]
  }
};

export default nextConfig;
