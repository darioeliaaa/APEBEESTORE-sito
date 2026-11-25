import type { Metadata } from "next";
import { percorso, testi, type Lingua } from "@/i18n/testi";

// indirizzo del sito: serve per l'anteprima quando si condivide un link (WhatsApp, Instagram...)
const sito = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000";

// dati comuni a tutte le pagine di una lingua (titolo, descrizione, immagine dell'anteprima)
export function metaSito(lang: Lingua): Metadata {
  const t = testi[lang].meta;
  return {
    metadataBase: new URL(sito),
    title: { default: t.titolo, template: "%s · APEBEESTORE" },
    description: t.descrizione,
    robots: { index: false, follow: false },
    icons: { icon: "/icon.png" },
    openGraph: {
      type: "website",
      siteName: "APEBEESTORE",
      locale: t.locale,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: t.immagine }],
    },
    twitter: { card: "summary_large_image", images: ["/og.png"] },
  };
}

// titolo di una pagina + collegamento alla stessa pagina nell'altra lingua
export function metaPagina(lang: Lingua, p: string, titolo?: string, descrizione?: string): Metadata {
  return {
    ...(titolo ? { title: titolo } : {}),
    ...(descrizione ? { description: descrizione } : {}),
    alternates: { canonical: percorso(lang, p), languages: { it: percorso("it", p), en: percorso("en", p) } },
  };
}
