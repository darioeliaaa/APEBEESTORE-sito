// Legge il foglio CATALOGO dal Google Sheet.
// Solo lettura: il permesso chiesto a Google è "spreadsheets.readonly", il sito non può scrivere nel foglio.
//
// Se il foglio non si legge o sembra rotto (nessun prodotto, colonne sparite, troppe righe sbagliate)
// il sito non pubblica niente di nuovo e continua a mostrare l'ultima versione buona.
// I dati di prova si usano solo se le chiavi non ci sono (in locale o nelle anteprime).

import { createSign } from "node:crypto";
import { cache } from "react";
import { catalogo as demoCatalogo, preordini as demoPreordini, riscatti as demoRiscatti } from "@/data/demo";
import type { Prodotto, Stato } from "@/data/demo";

const FOGLIO = "CATALOGO";
const FOGLIO_BANNER = "BANNER"; // scheda con le foto del banner in home
// secondi: il sito rilegge il foglio ogni 5 minuti (in locale ogni 10 secondi, così le prove si vedono subito)
const AGGIORNA_OGNI = process.env.NODE_ENV === "development" ? 10 : 300;

// una riga del foglio che ha qualcosa che non va
// scartato = la riga non va sul sito; altrimenti è solo un avviso
export type Problema = { riga: number; codice: string; motivo: string; scartato: boolean };

export type Catalogo = { prodotti: Prodotto[]; problemi: Problema[]; dalFoglio: boolean };

// ---------- accesso a Google ----------

// la chiave privata si può incollare in tanti modi (con o senza virgolette, con \n scritti,
// con gli a capo diventati spazi, o tutto il file JSON): qui la rimetto sempre nel formato giusto
function chiavePrivata(grezza?: string) {
  if (!grezza?.trim()) return undefined;
  let s = grezza.trim();
  if (s.startsWith("{")) {
    try {
      s = JSON.parse(s).private_key ?? s;
    } catch {}
  }
  s = s.replace(/^["']+|["']+$/g, "").replace(/\\n/g, "\n");
  const m = s.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
  if (!m) throw new Error("GOOGLE_PRIVATE_KEY non è nel formato giusto: deve contenere -----BEGIN PRIVATE KEY-----");
  const corpo = m[1].replace(/\s+/g, "").match(/.{1,64}/g)?.join("\n") ?? "";
  return `-----BEGIN PRIVATE KEY-----\n${corpo}\n-----END PRIVATE KEY-----\n`;
}

function chiavi() {
  const id = process.env.GOOGLE_SHEET_ID?.trim();
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim();
  const chiave = chiavePrivata(process.env.GOOGLE_PRIVATE_KEY);
  return id && email && chiave ? { id, email, chiave } : null;
}

async function token(email: string, chiave: string): Promise<string> {
  // il permesso di Google dura un'ora: lo chiediamo una volta ogni 30 minuti e intanto lo teniamo
  const ora = Math.floor(Date.now() / 1000 / 1800) * 1800;
  const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const testa = b64({ alg: "RS256", typ: "JWT" });
  const corpo = b64({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets.readonly",
    aud: "https://oauth2.googleapis.com/token",
    iat: ora,
    exp: ora + 3600,
  });
  const firma = createSign("RSA-SHA256").update(`${testa}.${corpo}`).sign(chiave, "base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${testa}.${corpo}.${firma}`,
    }),
    next: { revalidate: 1500 },
  });
  if (!res.ok) throw new Error(`Accesso a Google non riuscito (${res.status})`);
  return (await res.json()).access_token;
}

// fresco = salta la copia salvata e rilegge subito (serve alla pagina /controllo)
// null = la scheda non esiste
async function leggiRighe(foglio: string, fresco = false): Promise<unknown[][] | null> {
  const k = chiavi();
  if (!k) throw new Error("Chiavi del Google Sheet mancanti");
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${k.id}/values/${encodeURIComponent(foglio)}` +
    "?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await token(k.email, k.chiave)}` },
    ...(fresco ? { cache: "no-store" as const } : { next: { revalidate: AGGIORNA_OGNI } }),
  });
  // Google risponde 400 quando la scheda non c'è
  if (res.status === 400) return null;
  if (!res.ok) throw new Error(`Lettura del foglio ${foglio} non riuscita (${res.status})`);
  return (await res.json()).values ?? [];
}

// ---------- dalle righe ai prodotti ----------

// "Prezzo pubblico (€)" -> "prezzopubblico"
const pulisci = (s: unknown) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[^a-z0-9]/g, "");

const testo = (v: unknown) => String(v ?? "").trim();

// cerca le colonne per nome, così l'ordine delle colonne nel foglio non conta
function colonne(intestazione: unknown[]) {
  const nomi = intestazione.map(pulisci);
  const trova = (...chiavi: string[]) => nomi.findIndex((n) => chiavi.some((k) => n === k || n.startsWith(k)));
  const c = {
    linea: trova("linea"),
    categoria: trova("categoria"),
    codice: trova("codice"),
    nome: trova("nome"),
    stato: trova("stato"),
    prezzo: trova("prezzopubblico"),
    immagine: trova("immagine"),
    attivo: trova("attivo"),
    uscita: trova("datauscita", "uscita"),
  };
  // senza queste il sito non può funzionare: meglio fermarsi che pubblicare un catalogo sbagliato
  const servono = { codice: "Codice", nome: "Nome", stato: "Stato", prezzo: "Prezzo pubblico" } as const;
  for (const [k, nome] of Object.entries(servono)) {
    if (c[k as keyof typeof servono] < 0) throw new Error(`Nel foglio non trovo la colonna «${nome}»`);
  }
  return c;
}

const stati: Record<string, Stato> = {
  disponibile: "ordinazione",
  suordinazione: "ordinazione",
  preordine: "preordine",
  soldout: "soldout",
  riscatta: "riscatto",
  riscatto: "riscatto",
};

// nomi delle categorie come si leggono sul sito
const nomiCategorie: Record<string, string> = { beyblade: "Trottole" };

const maiuscola = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function categoria(v: unknown) {
  const s = testo(v);
  if (!s) return "Altro";
  return nomiCategorie[pulisci(s)] ?? s.toLowerCase().split(/\s+/).map(maiuscola).join(" ");
}

// "BX 46 stadium infinity" -> "Stadium Infinity" (il codice c'è già a parte)
function nome(v: unknown, codice: string) {
  let s = testo(v);
  const radice = codice.replace(/[-\s]/g, "");
  const inizio = s.match(/^[A-Za-z]+[\s-]?\d+[A-Za-z]?\s*/);
  if (inizio && inizio[0].replace(/[-\s]/g, "").toLowerCase() === radice.toLowerCase()) s = s.slice(inizio[0].length);
  if (!s) return codice;
  // se è scritto tutto minuscolo diventa "Stadium Infinity", altrimenti resta com'è nel foglio
  if (s === s.toLowerCase()) return s.split(" ").map(maiuscola).join(" ");
  return maiuscola(s);
}

// prezzi accettati: da 1 a 5.000 euro, fuori da qui è quasi sicuramente un errore di battitura
export const PREZZO_MIN = 1;
export const PREZZO_MAX = 5000;

// capisce da solo se punto e virgola sono decimali o migliaia:
// 35 · 35,5 · 35.50 · 1.234 · 1.234,50 · 1,234.50 · € 35
export function prezzo(v: unknown): number {
  if (typeof v === "number") return Number.isFinite(v) ? Math.round(v * 100) / 100 : NaN;
  // tolgo simbolo dell'euro, la parola euro e gli spazi; se resta qualcosa che non è un numero, non è un prezzo
  const s = testo(v).toLowerCase().replace(/€|\beuro?\b|\s|'/g, "");
  if (!/^[\d.,]*\d[\d.,]*$/.test(s)) return NaN;
  // migliaia vere: "1.234" sì, "0.001" no
  const migliaia = (sep: string) => new RegExp(`^[1-9]\\d{0,2}(\\${sep}\\d{3})+$`).test(s);
  let n: string;
  if (s.includes(",") && s.includes(".")) {
    // il separatore che viene per ultimo è quello dei decimali
    const dec = s.lastIndexOf(",") > s.lastIndexOf(".") ? "," : ".";
    const mil = dec === "," ? "." : ",";
    n = s.split(mil).join("").replace(dec, ".");
  } else if (s.includes(",")) {
    n = migliaia(",") && !/,\d{1,2}$/.test(s) ? s.replace(/,/g, "") : s.replace(",", ".");
  } else if (s.includes(".")) {
    n = migliaia(".") ? s.replace(/\./g, "") : s;
  } else {
    n = s;
  }
  // "1,2,3" o "3.5.0" non sono prezzi
  if ((n.match(/\./g) ?? []).length > 1) return NaN;
  return Math.round(Number(n) * 100) / 100;
}

const attivo = (v: unknown) => v === true || ["✔", "✓", "si", "sì", "true", "x"].includes(testo(v).toLowerCase());

// "26/12/2026", "26/12/26", "26/12", "2026-12-26" -> "2026-12-26"
// senza anno prende la prossima volta che arriva quel giorno
// undefined = vuota, null = scritta male
export function data(v: unknown, oggi = new Date()): string | undefined | null {
  const s = testo(v);
  if (!s) return undefined;
  let g: number, m: number, a: number | undefined;
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  const it = s.match(/^(\d{1,2})[/.-](\d{1,2})(?:[/.-](\d{4}|\d{2}))?$/);
  if (iso) [a, m, g] = [+iso[1], +iso[2], +iso[3]];
  else if (it) [g, m, a] = [+it[1], +it[2], it[3] ? (it[3].length === 2 ? 2000 + +it[3] : +it[3]) : undefined];
  else return null;
  if (a === undefined) {
    a = oggi.getFullYear();
    // se quel giorno è passato da più di due mesi, è dell'anno dopo
    if (Date.UTC(a, m - 1, g) < oggi.getTime() - 60 * 86400000) a++;
  }
  const d = new Date(Date.UTC(a, m - 1, g));
  if (d.getUTCFullYear() !== a || d.getUTCMonth() !== m - 1 || d.getUTCDate() !== g) return null;
  return d.toISOString().slice(0, 10);
}

// data scritta in fondo al nome: "Random Booster · 26/12/2026"
const dataInFondo = /\s*[·•\-–]\s*(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s*$/;

export function righeInProdotti(righe: unknown[][]): { prodotti: Prodotto[]; problemi: Problema[] } {
  const [intestazione, ...dati] = righe;
  if (!intestazione) throw new Error("Il foglio è vuoto");
  const c = colonne(intestazione);
  const cella = (r: unknown[], i: number) => (i >= 0 ? r[i] : undefined);
  const visti = new Map<string, number>(); // codice -> riga dove l'ho visto
  const prodotti: Prodotto[] = [];
  const problemi: Problema[] = [];

  dati.forEach((r, i) => {
    const riga = i + 2; // la riga 1 è l'intestazione
    const codice = testo(cella(r, c.codice));
    const scarta = (motivo: string) => problemi.push({ riga, codice, motivo, scartato: true });
    const avvisa = (motivo: string) => problemi.push({ riga, codice, motivo, scartato: false });

    if (!codice && !testo(cella(r, c.nome))) return; // riga vuota
    if (c.attivo >= 0 && !attivo(cella(r, c.attivo))) return; // spenta apposta
    if (!codice) return scarta("manca il codice");
    // "BX-56", "bx-56" e "BX 56" sono lo stesso prodotto
    const chiaveCodice = codice.toUpperCase().replace(/[\s-]/g, "");
    if (visti.has(chiaveCodice)) return scarta(`il codice ${codice} c'è già alla riga ${visti.get(chiaveCodice)}`);

    const statoScritto = testo(cella(r, c.stato));
    const stato = stati[pulisci(statoScritto)];
    if (!statoScritto) return scarta("manca lo stato");
    if (!stato) return scarta(`stato «${statoScritto}» non valido (usa Disponibile, Preordine, Sold out o Riscatta)`);

    const prezzoScritto = cella(r, c.prezzo);
    const euro = prezzo(prezzoScritto);
    if (!testo(prezzoScritto)) return scarta("manca il prezzo pubblico");
    if (!Number.isFinite(euro)) return scarta(`prezzo «${testo(prezzoScritto)}» non valido`);
    if (euro < PREZZO_MIN || euro > PREZZO_MAX) {
      return scarta(`prezzo «${testo(prezzoScritto)}» fuori dai limiti (da € 1 a € 5.000)`);
    }

    visti.set(chiaveCodice, riga);

    // la data nel nome la tolgo solo nei preordini e solo se è una data vera
    // così "Grip - 1/2" resta com'è
    let nomeGrezzo = testo(cella(r, c.nome));
    let uscita: string | undefined;
    if (stato === "preordine") {
      const d = nomeGrezzo.match(dataInFondo);
      const dalNome = d ? data(d[1]) : undefined;
      if (d && dalNome) nomeGrezzo = nomeGrezzo.slice(0, d.index);
      const dallaColonna = data(cella(r, c.uscita));
      if (dallaColonna === null) avvisa(`data di uscita «${testo(cella(r, c.uscita))}» non valida`);
      uscita = dallaColonna || dalNome || undefined;
      if (!uscita && dallaColonna !== null) avvisa("preordine senza data di uscita");
    }

    const img = testo(cella(r, c.immagine));
    if (img && !img.startsWith("https://")) avvisa("il link della foto deve iniziare con https://");
    const nomeSito = nome(nomeGrezzo, codice);

    prodotti.push({
      codice,
      nome: nomeSito,
      linea: nomeLinea(cella(r, c.linea)),
      categoria: categoria(cella(r, c.categoria)),
      prezzo: euro,
      stato,
      uscita,
      immagine: img.startsWith("https://") ? img : undefined,
    });
  });

  return { prodotti, problemi };
}

// il foglio sembra rotto? allora non lo pubblico
function controlla({ prodotti, problemi }: { prodotti: Prodotto[]; problemi: Problema[] }) {
  const scartati = problemi.filter((p) => p.scartato).length;
  if (prodotti.length === 0) throw new Error("Nel foglio non c'è nessun prodotto valido");
  if (scartati > prodotti.length) throw new Error(`Troppe righe sbagliate nel foglio (${scartati} su ${scartati + prodotti.length})`);
}

// ---------- quello che usano le pagine ----------

const demo = (): Catalogo => ({
  prodotti: [...demoCatalogo, ...demoPreordini, ...demoRiscatti],
  problemi: [],
  dalFoglio: false,
});

// cache: nella stessa pagina il foglio si elabora una volta sola, anche se lo chiedono layout e pagina
export const leggiCatalogo = cache(async (): Promise<Catalogo> => {
  if (!chiavi()) {
    // sul sito vero senza chiavi meglio fermarsi che mostrare prezzi finti
    if (process.env.VERCEL_ENV === "production") throw new Error("Chiavi del Google Sheet mancanti su Vercel");
    return demo();
  }
  // se qui c'è un errore la pagina non si aggiorna e resta l'ultima versione buona
  const righe = await leggiRighe(FOGLIO);
  if (!righe) throw new Error(`Nel Google Sheet non trovo la scheda ${FOGLIO}`);
  const risultato = righeInProdotti(righe);
  controlla(risultato);
  // nei log di Vercel solo le righe che non vanno sul sito; gli avvisi si vedono nella pagina /controllo
  for (const p of risultato.problemi.filter((x) => x.scartato)) {
    console.warn(`[catalogo] riga ${p.riga}${p.codice ? ` (${p.codice})` : ""}: ${p.motivo} · non è sul sito`);
  }
  return { ...risultato, dalFoglio: true };
});

// per la pagina /controllo: rilegge subito e non si ferma mai, dice solo cosa non va
export async function controllaFoglio(): Promise<{ prodotti: number; problemi: Problema[]; errore?: string }> {
  try {
    if (!chiavi()) return { prodotti: 0, problemi: [], errore: "Chiavi del Google Sheet mancanti" };
    const righe = await leggiRighe(FOGLIO, true);
    if (!righe) return { prodotti: 0, problemi: [], errore: `Nel Google Sheet non trovo la scheda ${FOGLIO}` };
    const banner = await leggiRighe(FOGLIO_BANNER, true).catch(() => null);
    const risultato = righeInProdotti(righe);
    if (banner) risultato.problemi.push(...righeInBanner(banner).problemi);
    try {
      controlla(risultato);
    } catch (e) {
      return { prodotti: risultato.prodotti.length, problemi: risultato.problemi, errore: (e as Error).message };
    }
    return { prodotti: risultato.prodotti.length, problemi: risultato.problemi };
  } catch (e) {
    return { prodotti: 0, problemi: [], errore: (e as Error).message };
  }
}

// ---------- banner della home ----------
// Scheda BANNER: una riga = una foto. Colonne (riconosciute dal nome):
//   Immagine (URL)  il link della foto, deve iniziare con https://
//   Link            facoltativo: dove porta il clic sulla foto (es. /preordini o https://...)
//   Attivo          facoltativo: senza spunta la foto non si vede
// Se la scheda non c'è o è vuota, in home resta il disegno con l'ape.

export type FotoBanner = { immagine: string; link?: string };

// "/preordini" (pagina del sito) oppure "https://..." (sito esterno), nient'altro.
// Niente "//" o "/\" all'inizio: il browser li tratterebbe come link verso un altro sito.
function linkSicuro(link: string) {
  if (/^\/(?![/\\])[^\s\\]*$/.test(link)) return link;
  if (/^https:\/\/[^\s\\]+$/.test(link)) return link;
  return "";
}

// i link di Google Drive ("drive.google.com/file/d/ID/view", "open?id=ID") aprono la pagina di Drive, non la foto:
// li trasformo nel link diretto all'immagine, così nel foglio si può incollare il link di Drive così com'è
export function linkFoto(link: string) {
  const id =
    link.match(/^https:\/\/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1] ??
    link.match(/^https:\/\/drive\.google\.com\/(?:open|uc)\?(?:.*&)?id=([\w-]+)/)?.[1];
  return id ? `https://lh3.googleusercontent.com/d/${id}` : link;
}

export function righeInBanner(righe: unknown[][]): { foto: FotoBanner[]; problemi: Problema[] } {
  const foto: FotoBanner[] = [];
  const problemi: Problema[] = [];
  if (!righe.length) return { foto, problemi };
  // se la prima riga è già un link, la scheda non ha intestazione
  const senzaTitoli = testo(righe[0][0]).startsWith("http");
  const nomi = senzaTitoli ? [] : righe[0].map(pulisci);
  const trova = (k: string) => nomi.findIndex((n) => n.startsWith(k));
  const c = { immagine: Math.max(trova("immagine"), 0), link: trova("link"), attivo: trova("attivo") };

  righe.slice(senzaTitoli ? 0 : 1).forEach((r, i) => {
    const riga = i + (senzaTitoli ? 1 : 2);
    if (c.attivo >= 0 && testo(r[c.attivo]) !== "" && !attivo(r[c.attivo])) return;
    const link = c.link >= 0 ? testo(r[c.link]) : "";
    const linkOk = linkSicuro(link);
    if (link && !linkOk) problemi.push({ riga, codice: "BANNER", motivo: `link «${link}» non valido (usa /pagina o https://...)`, scartato: false });
    // nella stessa cella si possono mettere anche più link, uno per riga o separati da virgola
    // (la virgola divide solo se dopo inizia un altro link: dentro i link di Amazon ci sono virgole)
    for (const img of testo(r[c.immagine]).split(/\s+|,\s*(?=https?:\/\/)/).filter(Boolean)) {
      if (!img.startsWith("https://")) {
        problemi.push({ riga, codice: "BANNER", motivo: `la foto «${img.slice(0, 40)}» deve iniziare con https://`, scartato: true });
        continue;
      }
      foto.push({ immagine: linkFoto(img), link: linkOk || undefined });
    }
  });
  return { foto, problemi };
}

export const leggiBanner = cache(async (): Promise<FotoBanner[]> => {
  if (!chiavi()) return [];
  // se Google non risponde l'errore sale e la home resta all'ultima versione buona
  const righe = await leggiRighe(FOGLIO_BANNER);
  return righe ? righeInBanner(righe).foto.slice(0, 10) : [];
});

// ---------- linee (Beyblade X, Pokémon...) ----------

// "Pokémon" -> "pokemon", "Beyblade X" -> "beyblade-x": l'indirizzo della linea (/catalogo/pokemon)
export const slugLinea = (nome: string) =>
  nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// come si scrivono le linee sul sito, anche se nel foglio sono scritte in minuscolo o senza accento
const nomiLinee: Record<string, string> = {
  "beyblade-x": "Beyblade X",
  pokemon: "Pokémon",
  "one-piece": "One Piece",
  "dragon-ball": "Dragon Ball",
  gundam: "Gundam",
  "union-arena": "Union Arena",
  "naruto-kayou": "Naruto Kayou",
};

// la linea scritta nel foglio, sempre nello stesso modo: "pokemon", "POKEMON" e "Pokémon" sono la stessa
function nomeLinea(v: unknown) {
  const s = testo(v).replace(/\s+/g, " ");
  if (!s) return "Beyblade X";
  return nomiLinee[slugLinea(s)] ?? s.split(" ").map((p) => (p === p.toLowerCase() ? maiuscola(p) : p)).join(" ");
}

export type Linea = { nome: string; slug: string; quanti: number; foto?: string };

// le linee che hanno prodotti in catalogo, nell'ordine in cui compaiono nel foglio
export function lineeCatalogo(prodotti: Prodotto[]): Linea[] {
  const linee = new Map<string, Linea>();
  for (const p of prodotti) {
    if (p.stato !== "ordinazione" && p.stato !== "soldout") continue;
    const slug = slugLinea(p.linea);
    const l = linee.get(slug) ?? { nome: p.linea, slug, quanti: 0 };
    l.quanti++;
    if (!l.foto && p.immagine && p.stato === "ordinazione") l.foto = p.immagine;
    linee.set(slug, l);
  }
  return [...linee.values()];
}

export const perStato = (prodotti: Prodotto[], ...stati: Stato[]) => prodotti.filter((p) => stati.includes(p.stato));
