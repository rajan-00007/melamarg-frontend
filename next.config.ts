import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
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


