import type { Metadata } from "next";
import { percorso, testi, type Lingua } from "@/i18n/testi";

// indirizzo del sito: serve a Google e all'anteprima quando si condivide un link (WhatsApp, Instagram...)
// online è sempre www.apebeestore.com (apebeestore.com e il vecchio vercel.app ci rimandano o puntano lì)
export const SITO = "https://www.apebeestore.com";
// chi siamo per Google: nome, sito, logo e profili (in home e in Chi siamo)
export const ORGANIZZAZIONE = {
  "@type": "Organization",
  name: "APEBEESTORE",
  url: SITO,
  logo: `${SITO}/icon.png`,
  address: { "@type": "PostalAddress", addressLocality: "Milano", addressCountry: "IT" },
  sameAs: ["https://www.instagram.com/apebeestore"],
};
// Google deve vedere solo il sito vero: le versioni di prova di Vercel e il sito in locale restano nascoste
export const pubblico = process.env.VERCEL_ENV === "production";
const sito = pubblico ? SITO : process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";

// dati comuni a tutte le pagine di una lingua (titolo, descrizione, immagine dell'anteprima)
export function metaSito(lang: Lingua): Metadata {
  const t = testi[lang].meta;
  return {
    metadataBase: new URL(sito),
    title: { default: t.titolo, template: "%s · APEBEESTORE" },
    description: t.descrizione,
    robots: pubblico ? { index: true, follow: true } : { index: false, follow: false },
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
    alternates: { canonical: percorso(lang, p), languages: { it: percorso("it", p), en: percorso("en", p), "x-default": percorso("it", p) } },
  };
}
