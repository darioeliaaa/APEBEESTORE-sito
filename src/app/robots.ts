import type { MetadataRoute } from "next";
import { SITO, pubblico } from "@/pagine/meta";

// robots.txt: cosa possono leggere Google e gli altri motori di ricerca.
// Ordine, riepilogo, controllo e API non servono su Google; le versioni di prova di Vercel restano tutte nascoste.
export default function robots(): MetadataRoute.Robots {
  if (!pubblico) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/controllo", "/ordine", "/en/ordine", "/riepilogo", "/en/riepilogo"],
    },
    sitemap: `${SITO}/sitemap.xml`,
  };
}
