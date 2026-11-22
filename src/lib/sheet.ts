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
const AGGIORNA_OGNI = 300; // secondi: il sito rilegge il foglio ogni 5 minuti

// una riga del foglio che ha qualcosa che non va
// scartato = la riga non va sul sito; altrimenti è solo un avviso
export type Problema = { riga: number; codice: string; motivo: string; scartato: boolean };

export type Catalogo = { prodotti: Prodotto[]; problemi: Problema[]; dalFoglio: boolean };

// ---------- accesso a Google ----------

function chiavi() {
  const id = process.env.GOOGLE_SHEET_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const chiave = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
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
async function leggiRighe(fresco = false): Promise<unknown[][]> {
  const k = chiavi();
  if (!k) throw new Error("Chiavi del Google Sheet mancanti");
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${k.id}/values/${encodeURIComponent(FOGLIO)}` +
    "?valueRenderOption=UNFORMATTED_VALUE&dateTimeRenderOption=FORMATTED_STRING";
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${await token(k.email, k.chiave)}` },
    ...(fresco ? { cache: "no-store" as const } : { next: { revalidate: AGGIORNA_OGNI } }),
  });
  if (!res.ok) throw new Error(`Lettura del foglio non riuscita (${res.status})`);
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

// capisce da solo se punto e virgola sono decimali o migliaia:
// 35 · 35,5 · 35.50 · 1.234 · 1.234,50 · 1,234.50 · € 35
export function prezzo(v: unknown): number {
  if (typeof v === "number") return v;
  const s = testo(v).replace(/[^\d,.]/g, "");
  if (!/\d/.test(s)) return NaN;
  const migliaia = (sep: string) => new RegExp(`^\\d{1,3}(\\${sep}\\d{3})+$`).test(s);
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
    if (visti.has(codice)) return scarta(`il codice ${codice} c'è già alla riga ${visti.get(codice)}`);

    const statoScritto = testo(cella(r, c.stato));
    const stato = stati[pulisci(statoScritto)];
    if (!statoScritto) return scarta("manca lo stato");
    if (!stato) return scarta(`stato «${statoScritto}» non valido (usa Disponibile, Preordine, Sold out o Riscatta)`);

    const prezzoScritto = cella(r, c.prezzo);
    const euro = prezzo(prezzoScritto);
    if (!Number.isFinite(euro) || euro <= 0) {
      return scarta(testo(prezzoScritto) ? `prezzo «${testo(prezzoScritto)}» non valido` : "manca il prezzo pubblico");
    }

    visti.set(codice, riga);

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

    prodotti.push({
      codice,
      nome: nome(nomeGrezzo, codice),
      linea: testo(cella(r, c.linea)) || "Beyblade X",
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
  const risultato = righeInProdotti(await leggiRighe());
  controlla(risultato);
  for (const p of risultato.problemi) {
    console.warn(`[catalogo] riga ${p.riga}${p.codice ? ` (${p.codice})` : ""}: ${p.motivo}${p.scartato ? " · non è sul sito" : ""}`);
  }
  return { ...risultato, dalFoglio: true };
});

// per la pagina /controllo: rilegge subito e non si ferma mai, dice solo cosa non va
export async function controllaFoglio(): Promise<{ prodotti: number; problemi: Problema[]; errore?: string }> {
  try {
    if (!chiavi()) return { prodotti: 0, problemi: [], errore: "Chiavi del Google Sheet mancanti" };
    const risultato = righeInProdotti(await leggiRighe(true));
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

export const perStato = (prodotti: Prodotto[], ...stati: Stato[]) => prodotti.filter((p) => stati.includes(p.stato));
