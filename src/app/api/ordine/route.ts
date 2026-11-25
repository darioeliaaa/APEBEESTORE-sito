import { NextResponse } from "next/server";
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
const errore = (msg: string, stato = 400) => NextResponse.json({ errore: msg }, { status: stato });

export async function POST(req: Request) {
  const grezzo = await req.text();
  if (grezzo.length > 20000) return errore("Ordine troppo grande.");
  let o: Record<string, unknown>;
  try {
    o = JSON.parse(grezzo);
  } catch {
    return errore("Ordine non leggibile.");
  }
  // campo nascosto: le persone non lo vedono, i programmi che mandano spam lo riempiono
  if (testo(o.sito)) return NextResponse.json({ numero: "", totale: 0 });

  const d = (o.dati ?? {}) as Record<string, unknown>;
  const consegna = testo(d.consegna);
  if (!consegne.includes(consegna)) return errore("Metodo di consegna non valido.");
  if (consegna === "ritiro" && !cittaRitiro.includes(testo(d.ritiro))) return errore("Città del ritiro non valida.");

  // i prodotti si ricontrollano con il catalogo di adesso: prezzo, sold out e regole del carrello
  const catalogo = new Map((await leggiCatalogo()).prodotti.map((p) => [p.codice, p]));
  const righe = Array.isArray(o.righe) ? o.righe : [];
  if (!righe.length || righe.length > 50) return errore("Il carrello è vuoto.");
  const prodotti: { codice: string; qta: number }[] = [];
  const riscatti: { codice: string; premio: string }[] = [];
  const stati = new Set<string>();
  const uscite = new Set<string>();
  for (const r of righe as Record<string, unknown>[]) {
    const p = catalogo.get(testo(r.codice, 40));
    const qta = Number(r.qta);
    if (!p) return errore(`Il prodotto ${testo(r.codice, 40)} non è più in catalogo.`);
    if (p.stato === "soldout") return errore(`${p.codice} è sold out.`);
    if (!Number.isInteger(qta) || qta < 1 || qta > 99) return errore("Quantità non valida.");
    stati.add(p.stato);
    if (p.stato === "preordine") uscite.add(p.uscita ?? "");
    if (p.stato === "riscatto") {
      if (qta !== 1) return errore("Puoi riscattare un solo premio per ordine.");
      riscatti.push({ codice: testo(d.codiceApp, 60), premio: p.nome });
    } else prodotti.push({ codice: p.codice, qta });
  }
  if (stati.size > 1) return errore("Preordini e riscatti vanno in un ordine a parte.");
  if (riscatti.length > 1) return errore("Puoi riscattare un solo premio per ordine.");
  if (uscite.size > 1) return errore("Puoi unire solo preordini con la stessa data.");
  if (riscatti.length && !riscatti[0].codice) return errore("Manca il codice dell'app.");

  // conto solo gli ordini validi, così chi corregge un errore non viene bloccato
  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sconosciuto";
  if (troppi(ip)) return errore("Troppi ordini in poco tempo: riprova tra qualche minuto.", 429);

  if (!scriptPronto()) return errore("Il salvataggio degli ordini non è ancora attivo.", 503);

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
    if (!r.success) return errore(r.error ?? "Ordine non salvato.");
    return NextResponse.json({ numero: r.orderNumber, totale: r.total });
  } catch (e) {
    console.error("[ordine]", (e as Error).message);
    return errore("Il salvataggio degli ordini non risponde.", 503);
  }
}
