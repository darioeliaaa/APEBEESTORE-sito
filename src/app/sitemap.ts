import type { MetadataRoute } from "next";
import { percorso, type Lingua } from "@/i18n/testi";
import { linkProdotto } from "@/lib/prodotto";
import { leggiCatalogo, lineeCatalogo } from "@/lib/sheet";
import { SITO } from "@/pagine/meta";

// sitemap.xml: l'elenco delle pagine da far trovare a Google, in italiano e in inglese.
// Prodotti e linee si prendono dal foglio, quindi si aggiorna da solo.

const fisse = ["/", "/catalogo", "/preordini", "/riscatti", "/recensioni", "/faq", "/chi-siamo", "/condizioni-di-vendita", "/privacy"];

const voce = (link: (l: Lingua) => string): MetadataRoute.Sitemap[number] => ({
  url: SITO + link("it"),
  alternates: { languages: { it: SITO + link("it"), en: SITO + link("en"), "x-default": SITO + link("it") } },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // se il foglio non risponde l'errore sale e resta la sitemap di prima (come per le altre pagine)
  const { prodotti } = await leggiCatalogo();
  return [
    ...fisse.map((p) => voce((l) => percorso(l, p))),
    ...lineeCatalogo(prodotti).map((x) => voce((l) => percorso(l, `/catalogo/${x.slug}`))),
    ...prodotti.map((p) => voce((l) => linkProdotto(l, p.codice))),
  ];
}
