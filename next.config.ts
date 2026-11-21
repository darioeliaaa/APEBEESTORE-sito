import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async rewrites() {
    return [{ source: "/prova", destination: "/prova/index.html" }];
  },
};

export default nextConfig;
