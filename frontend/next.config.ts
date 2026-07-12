import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  webpack(config) {
    config.resolve.alias["@coinbase/wallet-sdk"] = false;
    return config;
  },
  turbopack: {
    resolveAlias: {
      "@coinbase/wallet-sdk": "./src/lib/stubs/coinbase-wallet-sdk.ts",
    },
  },
};

export default nextConfig;
