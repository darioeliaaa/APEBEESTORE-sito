import type { NextConfig } from "next";

const sviluppo = process.env.NODE_ENV === "development";

// Da dove il browser può caricare le cose del sito.
// Le foto prodotto arrivano da link esterni nel foglio, per questo le immagini accettano qualsiasi https.
const csp = [
  "default-src 'self'",
  // challenges.cloudflare.com: il controllo anti-robot di ordine e recensione (Turnstile)
  `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com${sviluppo ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self'",
  `connect-src 'self'${sviluppo ? " ws:" : ""}`,
  "frame-src https://challenges.cloudflare.com",
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
  // la cartella del progetto è su iCloud (Desktop): iCloud duplica i file di lavoro di Next ("LOG 2", "routes.d 2.ts")
  // e npm run dev non parte più. In locale li mettiamo in ".next.nosync", che iCloud non sincronizza; su Vercel resta ".next".
  distDir: process.env.VERCEL ? ".next" : ".next.nosync",
  poweredByHeader: false,
  // il sito ha due lingue con due strutture separate (src/app/(it) e src/app/en):
  // per gli indirizzi che non esistono serve una pagina 404 unica (src/app/global-not-found.tsx)
  experimental: { globalNotFound: true },
  agentRules: false,
  async headers() {
    return [{ source: "/:path*", headers: sicurezza }];
  },
  async redirects() {
    return [{ source: "/come-ordinare", destination: "/faq#come-ordinare", permanent: true }];
  },
};

export default nextConfig;
