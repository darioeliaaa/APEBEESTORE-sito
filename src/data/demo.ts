// Dati di prova. Poi arriveranno dal Google Sheet.

export type Stato = "ordinazione" | "preordine" | "riscatto" | "soldout";

// linea = il mondo del prodotto (Beyblade X, poi Pokémon, One Piece...)
// categoria = il tipo dentro la linea (Trottole, Arene, Accessori...)
// Nel foglio CATALOGO saranno due colonne: il sito crea da solo linee e categorie nuove.
export type Prodotto = {
  codice: string;
  nome: string;
  linea: string;
  categoria: string;
  prezzo: number;
  stato: Stato;
  uscita?: string; // data di uscita "2026-12-26", solo preordini
  immagine?: string; // link della foto
  foto?: string[]; // tutte le foto, se nel foglio ce n'è più di una (la prima è "immagine")
  descrizione?: { it?: string; en?: string }; // colonne facoltative "Descrizione" e "Descrizione EN"
};


export const preordini: Prodotto[] = [
  { codice: "BX-54", nome: "Sieg Superion 0-70LP", linea: "Beyblade X", categoria: "Trottole", prezzo: 35, stato: "preordine", uscita: "2026-12-12" },
  { codice: "CX-20", nome: "Customize Set C", linea: "Beyblade X", categoria: "Trottole", prezzo: 100, stato: "preordine", uscita: "2026-12-12" },
  { codice: "BX-56", nome: "String Launcher L White × Violet", linea: "Beyblade X", categoria: "Accessori", prezzo: 25, stato: "preordine", uscita: "2026-12-19" },
];

// Premi da riscattare con il codice dell'app. Cambiano ogni mese.
export const riscatti: Prodotto[] = [
  { codice: "PREMIO 1", nome: "Premio di novembre 1", linea: "Beyblade X", categoria: "Premi", prezzo: 35, stato: "riscatto" },
  { codice: "PREMIO 2", nome: "Premio di novembre 2", linea: "Beyblade X", categoria: "Premi", prezzo: 35, stato: "riscatto" },
  { codice: "PREMIO 3", nome: "Premio di novembre 3", linea: "Beyblade X", categoria: "Premi", prezzo: 35, stato: "riscatto" },
];

export const catalogo: Prodotto[] = [
  { codice: "BX-46", nome: "Stadium Infinity", linea: "Beyblade X", categoria: "Arene", prezzo: 122, stato: "ordinazione" },
  { codice: "UX-17", nome: "Meteor Dragoon 3-70J", linea: "Beyblade X", categoria: "Trottole", prezzo: 33, stato: "ordinazione" },
  { codice: "CX-13", nome: "Bahamut Blitz BK1-50I", linea: "Beyblade X", categoria: "Trottole", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-52", nome: "Luster Dragoon 6-60LC", linea: "Beyblade X", categoria: "Trottole", prezzo: 40, stato: "ordinazione" },
  { codice: "UX-15", nome: "Shark Scale Deck Set", linea: "Beyblade X", categoria: "Trottole", prezzo: 87, stato: "ordinazione" },
  { codice: "CX-11", nome: "Emperor Might Deck Set", linea: "Beyblade X", categoria: "Trottole", prezzo: 105, stato: "soldout" },
  { codice: "BX-25", nome: "Gear Case", linea: "Beyblade X", categoria: "Accessori", prezzo: 39, stato: "ordinazione" },
  { codice: "BX-51", nome: "String Launcher nero / verde", linea: "Beyblade X", categoria: "Accessori", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-10", nome: "Xtreme Stadium", linea: "Beyblade X", categoria: "Arene", prezzo: 58, stato: "ordinazione" },
  { codice: "UX-01", nome: "Dran Buster 1-60A", linea: "Beyblade X", categoria: "Trottole", prezzo: 29, stato: "ordinazione" },
  { codice: "BX-01", nome: "Dran Sword 3-60F", linea: "Beyblade X", categoria: "Trottole", prezzo: 28, stato: "soldout" },
  { codice: "BX-11", nome: "Launcher Grip", linea: "Beyblade X", categoria: "Accessori", prezzo: 18, stato: "ordinazione" },
];
