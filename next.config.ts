import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async redirects() {
    return [{ source: "/come-ordinare", destination: "/faq", permanent: true }];
  },
};

export default nextConfig;
