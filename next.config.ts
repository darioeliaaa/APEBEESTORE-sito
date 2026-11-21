import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async rewrites() {
    return [{ source: "/prova", destination: "/prova/index.html" }];
  },
  async redirects() {
    return [{ source: "/come-ordinare", destination: "/faq", permanent: true }];
  },
};

export default nextConfig;
