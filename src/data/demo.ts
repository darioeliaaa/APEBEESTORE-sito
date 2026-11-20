// Dati di prova. Poi arriveranno dal Google Sheet.

export type Stato = "ordinazione" | "preordine" | "soldout";

export type Prodotto = {
  codice: string;
  nome: string;
  categoria: "Arene" | "Beyblade" | "Accessori";
  prezzo: number;
  stato: Stato;
  uscita?: string; // gg/mm, solo preordini
};

export const ACCONTO_PREORDINE = 0.4;
export const RISCATTO_CODICE = 35;

export const preordini: Prodotto[] = [
  { codice: "BX-54", nome: "Sieg Superion 0-70LP", categoria: "Beyblade", prezzo: 35, stato: "preordine", uscita: "12/12" },
  { codice: "CX-20", nome: "Customize Set C", categoria: "Beyblade", prezzo: 100, stato: "preordine", uscita: "12/12" },
  { codice: "BX-56", nome: "String Launcher L White × Violet", categoria: "Accessori", prezzo: 25, stato: "preordine", uscita: "19/12" },
];

export const catalogo: Prodotto[] = [
  { codice: "BX-46", nome: "Stadium Infinity", categoria: "Arene", prezzo: 122, stato: "ordinazione" },
  { codice: "UX-17", nome: "Meteor Dragoon 3-70J", categoria: "Beyblade", prezzo: 33, stato: "ordinazione" },
  { codice: "CX-13", nome: "Bahamut Blitz BK1-50I", categoria: "Beyblade", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-52", nome: "Luster Dragoon 6-60LC", categoria: "Beyblade", prezzo: 40, stato: "ordinazione" },
  { codice: "UX-15", nome: "Shark Scale Deck Set", categoria: "Beyblade", prezzo: 87, stato: "ordinazione" },
  { codice: "CX-11", nome: "Emperor Might Deck Set", categoria: "Beyblade", prezzo: 105, stato: "soldout" },
  { codice: "BX-25", nome: "Gear Case", categoria: "Accessori", prezzo: 39, stato: "ordinazione" },
  { codice: "BX-51", nome: "String Launcher nero / verde", categoria: "Accessori", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-10", nome: "Xtreme Stadium", categoria: "Arene", prezzo: 58, stato: "ordinazione" },
  { codice: "UX-01", nome: "Dran Buster 1-60A", categoria: "Beyblade", prezzo: 29, stato: "ordinazione" },
  { codice: "BX-01", nome: "Dran Sword 3-60F", categoria: "Beyblade", prezzo: 28, stato: "soldout" },
  { codice: "BX-11", nome: "Launcher Grip", categoria: "Accessori", prezzo: 18, stato: "ordinazione" },
];

export const faq: { domanda: string; risposta: string }[] = [
  { domanda: "Quanto ci mette ad arrivare?", risposta: "Circa 3–4 settimane. Ordiniamo in Giappone dopo il tuo ordine." },
  { domanda: "Spedizione e dogana sono incluse?", risposta: "Sì, sono nel prezzo. La consegna a casa costa € 8 in Italia, € 15 in Europa, da € 50 nel resto del mondo." },
  { domanda: "Come pago?", risposta: "Su WhatsApp, dopo l'ordine. Con PayPal, Revolut o bonifico." },
  { domanda: "Sono originali?", risposta: "Sì, solo Beyblade X originali Takara Tomy." },
  { domanda: "Come funziona il preordine?", risposta: "Si ordina da solo, senza altri prodotti. Paghi il 40% subito e il resto quando arriva." },
  { domanda: "Come funziona il riscatto codici?", risposta: "Ci mandi i codici, li riscattiamo in Giappone e ti mandiamo i premi. € 35 a codice." },
];
