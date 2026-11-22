import type { NextConfig } from "next";

const sviluppo = process.env.NODE_ENV === "development";

// Da dove il browser può caricare le cose del sito.
// Le foto prodotto arrivano da link esterni nel foglio, per questo le immagini accettano qualsiasi https.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${sviluppo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self'${sviluppo ? " ws:" : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(sviluppo ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const sicurezza = [
  { key: "Content-Security-Policy", value: csp },
  // il sito non si può mettere dentro altre pagine
  { key: "X-Frame-Options", value: "DENY" },
  // il browser non deve indovinare il tipo dei file
  { key: "X-Content-Type-Options", value: "nosniff" },
  // agli altri siti diciamo solo da che dominio arriva chi clicca
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // fotocamera, microfono, posizione ecc. non servono
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    return [{ source: "/:path*", headers: sicurezza }];
  },
  async redirects() {
    return [{ source: "/come-ordinare", destination: "/faq", permanent: true }];
  },
};

export default nextConfig;
