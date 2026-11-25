import { percorso, type Lingua } from "@/i18n/testi";

// indirizzo della pagina di un prodotto: "BX-46" -> /prodotto/bx-46
export const slugCodice = (codice: string) =>
  codice
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const linkProdotto = (lang: Lingua, codice: string) => percorso(lang, `/prodotto/${slugCodice(codice)}`);

// colore dell'etichetta di ogni stato (card, ricerca, pagina del prodotto)
export const classiStato = {
  ordinazione: "badge--order",
  preordine: "badge--pre",
  riscatto: "badge--redeem",
  soldout: "badge--sold",
};
