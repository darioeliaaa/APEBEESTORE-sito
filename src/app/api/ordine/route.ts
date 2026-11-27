import { NextResponse } from "next/server";
import { sistemaCodiceApp } from "@/lib/codiceApp";
import { leggiCatalogo } from "@/lib/sheet";
import { chiamaScript, scriptPronto } from "@/lib/ordini";

// Riceve l'ordine dalla pagina /ordine, ricontrolla tutto con il catalogo di adesso
// e lo passa allo script di Nicholas, che lo salva nella scheda Ordini e manda le email.

const consegne = ["ritiro", "italia", "europa", "mondo"];
const cittaRitiro = ["Milano", "Como", "Varese"];

// un limite semplice contro chi manda ordini a raffica: 5 ordini ogni 10 minuti dallo stesso indirizzo
const invii = new Map<string, number[]>();
function troppi(ip: string) {
  const ora = Date.now();
  const recenti = (invii.get(ip) ?? []).filter((t) => ora - t < 10 * 60 * 1000);
  recenti.push(ora);
  invii.set(ip, recenti);
  return recenti.length > 5;
}

const testo = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const errore = (msg: string, stato = 400, extra: Record<string, unknown> = {}) => NextResponse.json({ errore: msg, ...extra }, { status: stato });

// i messaggi che vede il cliente, nella lingua del sito
const messaggi = {
  it: {
    grande: "Ordine troppo grande.",
    illeggibile: "Ordine non leggibile.",
    consegna: "Metodo di consegna non valido.",
    ritiro: "Città del ritiro non valida.",
    vuoto: "Il carrello è vuoto.",
    troppiProdotti: "Troppi prodotti diversi in un ordine: dividilo in due.",
    sparito: (c: string) => `Il prodotto ${c} non è più in catalogo: toglilo dal carrello.`,
    soldout: (c: string) => `${c} è appena finito sold out: toglilo dal carrello.`,
    quantita: "Quantità non valida.",
    unRiscatto: "Puoi riscattare un solo premio per ordine.",
    aParte: "Preordini e riscatti vanno in un ordine a parte.",
    data: "Puoi unire solo preordini con la stessa data.",
    codiceApp: "Manca il codice dell'app.",
    codiceAppFormato: "Il codice dell'app non è valido: sono 12 lettere e numeri, tipo AB12-CD34-EF56.",
    prezzi: "Nel frattempo alcuni prezzi sono cambiati: controlla il totale e premi di nuovo il tasto per confermare.",
    troppi: "Troppi ordini in poco tempo: riprova tra qualche minuto.",
    nonAttivo: "Il salvataggio degli ordini non è ancora attivo.",
    nonSalvato: "Ordine non salvato.",
    nonRisponde: "Il salvataggio degli ordini non risponde.",
  },
  en: {
    grande: "Order too large.",
    illeggibile: "Order not readable.",
    consegna: "Invalid delivery method.",
    ritiro: "Invalid pickup city.",
    vuoto: "Your cart is empty.",
    troppiProdotti: "Too many different products in one order: split it in two.",
    sparito: (c: string) => `${c} is no longer in the catalogue: remove it from your cart.`,
    soldout: (c: string) => `${c} has just sold out: remove it from your cart.`,
    quantita: "Invalid quantity.",
    unRiscatto: "You can redeem only one prize per order.",
    aParte: "Pre-orders and rewards go in a separate order.",
    data: "You can only combine pre-orders with the same release date.",
    codiceApp: "The app code is missing.",
    codiceAppFormato: "The app code isn't valid: it's 12 letters and numbers, like AB12-CD34-EF56.",
    prezzi: "Some prices have changed in the meantime: check the total and press the button again to confirm.",
    troppi: "Too many orders in a short time: try again in a few minutes.",
    nonAttivo: "Order saving is not active yet.",
    nonSalvato: "Order not saved.",
    nonRisponde: "Order saving is not responding.",
  },
};

export async function POST(req: Request) {
  const grezzo = await req.text();
  if (grezzo.length > 20000) return errore(messaggi.it.grande);
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(grezzo);
  } catch {
    return errore(messaggi.it.illeggibile);
  }
  const m = o.lingua === "en" ? messaggi.en : messaggi.it;
  // campo nascosto: le persone non lo vedono, i programmi che mandano spam lo riempiono
  if (testo(o.sito)) return NextResponse.json({ numero: "", totale: 0 });

  const d = (o.dati ?? {}) as Record<string, unknown>;
  const consegna = testo(d.consegna);
  if (!consegne.includes(consegna)) return errore(m.consegna);
  if (consegna === "ritiro" && !cittaRitiro.includes(testo(d.ritiro))) return errore(m.ritiro);

  // i prodotti si ricontrollano con il catalogo di adesso: prezzo, sold out e regole del carrello
  const catalogo = new Map((await leggiCatalogo()).prodotti.map((p) => [p.codice, p]));
  const righe = Array.isArray(o.righe) ? o.righe : [];
  if (!righe.length) return errore(m.vuoto);
  if (righe.length > 50) return errore(m.troppiProdotti);
  const prodotti: { codice: string; qta: number }[] = [];
  const riscatti: { codice: string; premio: string }[] = [];
  const stati = new Set<string>();
  const uscite = new Set<string>();
  // prezzi cambiati da quando il cliente li ha visti: non salvo niente, gli mostro i nuovi da confermare
  const cambiati: { codice: string; prima: number; prezzo: number }[] = [];
  for (const r of righe as Record<string, unknown>[]) {
    const p = catalogo.get(testo(r.codice, 40));
    const qta = Number(r.qta);
    if (!p) return errore(m.sparito(testo(r.codice, 40)), 409, { togli: testo(r.codice, 40) });
    if (p.stato === "soldout") return errore(m.soldout(p.codice), 409, { togli: p.codice });
    if (!Number.isInteger(qta) || qta < 1 || qta > 99) return errore(m.quantita);
    if (typeof r.prezzo === "number" && r.prezzo !== p.prezzo) cambiati.push({ codice: p.codice, prima: r.prezzo, prezzo: p.prezzo });
    stati.add(p.stato);
    if (p.stato === "preordine") uscite.add(p.uscita ?? "");
    if (p.stato === "riscatto") {
      if (qta !== 1) return errore(m.unRiscatto);
      riscatti.push({ codice: testo(d.codiceApp, 60), premio: p.nome });
    } else prodotti.push({ codice: p.codice, qta });
  }
  if (stati.size > 1) return errore(m.aParte);
  if (riscatti.length > 1) return errore(m.unRiscatto);
  if (uscite.size > 1) return errore(m.data);
  if (riscatti.length && !riscatti[0].codice) return errore(m.codiceApp);
  if (riscatti.length) {
    const giusto = sistemaCodiceApp(riscatti[0].codice);
    if (!giusto) return errore(m.codiceAppFormato);
    riscatti[0].codice = giusto;
  }
  if (cambiati.length) return errore(m.prezzi, 409, { prezzi: cambiati });

  // conto solo gli ordini validi, così chi corregge un errore non viene bloccato
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sconosciuto";
  if (troppi(ip)) return errore(m.troppi, 429);

  if (!scriptPronto()) return errore(m.nonAttivo, 503);

  try {
    const r = await chiamaScript({
      azione: "ordine",
      ordine: {
        cliente: {
          nome: testo(d.nome),
          email: testo(d.email),
          telefono: testo(d.telefono),
          indirizzo: testo(d.indirizzo),
          citta: testo(d.citta),
          cap: testo(d.cap),
          provincia: testo(d.provincia),
          paese: testo(d.paese),
        },
        consegna,
        ritiro: testo(d.ritiro),
        prodotti,
        riscatti,
        note: testo(d.note, 500),
        lingua: o.lingua === "en" ? "en" : "it",
      },
    });
    if (!r.success) return errore(r.error ?? m.nonSalvato);
    return NextResponse.json({ numero: r.orderNumber, totale: r.total });
  } catch (e) {
    console.error("[ordine]", (e as Error).message);
    return errore(m.nonRisponde, 503);
  }
}
