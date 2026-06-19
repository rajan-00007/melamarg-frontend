import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: process.env.NEXT_STANDALONE === 'true' ? 'standalone' : 'export',
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  outputFileTracingExcludes: {
    '*': [
      'node_modules/@img/**/*',
      'node_modules/sharp/**/*',
      'node_modules/@capacitor/**/*',
    ],
  },
};

export default nextConfig;


