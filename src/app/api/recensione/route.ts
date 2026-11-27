import { NextResponse } from "next/server";
import { chiamaScript, scriptPronto } from "@/lib/ordini";
import { nonRobot } from "@/lib/robot";

// Riceve la recensione dal modulo della pagina Recensioni e la passa allo script di Nicholas,
// che la scrive nella scheda RECENSIONI con Attivo spento: sul sito compare solo dopo l'approvazione.

const messaggi = {
  it: {
    illeggibile: "Recensione non leggibile.",
    nome: "Scrivi il tuo nome.",
    frase: "Scrivi la recensione (almeno qualche parola).",
    consenso: "Serve la spunta per pubblicare la recensione.",
    voto: "Scegli da 1 a 5 stelle.",
    troppe: "Hai già mandato una recensione: riprova più tardi.",
    robot: "Il controllo anti-robot non è andato: ricarica la pagina e riprova.",
    nonAttivo: "Le recensioni dal sito non sono ancora attive.",
    nonRisponde: "Non siamo riusciti a mandare la recensione. Riprova tra poco.",
  },
  en: {
    illeggibile: "Review not readable.",
    nome: "Please write your name.",
    frase: "Please write your review (at least a few words).",
    consenso: "Please tick the box to publish your review.",
    voto: "Please choose from 1 to 5 stars.",
    troppe: "You've already sent a review: try again later.",
    robot: "The anti-bot check didn't pass: reload the page and try again.",
    nonAttivo: "Reviews from the site are not active yet.",
    nonRisponde: "We couldn't send your review. Please try again shortly.",
  },
};

// contro chi manda recensioni a raffica: 3 ogni ora dallo stesso indirizzo
const invii = new Map<string, number[]>();
function troppe(ip: string) {
  const ora = Date.now();
  // ogni tanto tolgo gli indirizzi che non scrivono da più di un'ora, così la memoria non cresce
  if (invii.size >= 500) for (const [k, v] of invii) if (ora - v[v.length - 1] > 60 * 60 * 1000) invii.delete(k);
  const recenti = (invii.get(ip) ?? []).filter((t) => ora - t < 60 * 60 * 1000);
  recenti.push(ora);
  invii.set(ip, recenti);
  return recenti.length > 3;
}

const testo = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\s+/g, " ").trim().slice(0, max) : "");
const errore = (msg: string, stato = 400) => NextResponse.json({ errore: msg }, { status: stato });

export async function POST(req: Request) {
  // solo JSON: così un altro sito non può far partire ordini o recensioni dal browser di chi lo visita
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return errore(messaggi.it.illeggibile, 415);
  const grezzo = await req.text();
  let o: Record<string, unknown>;
  try {
    if (grezzo.length > 5000) throw new Error();
    o = JSON.parse(grezzo);
  } catch {
    return errore(messaggi.it.illeggibile);
  }
  const m = o.lingua === "en" ? messaggi.en : messaggi.it;
  // campo nascosto: le persone non lo vedono, i programmi che mandano spam lo riempiono
  if (testo(o.sito, 100)) return NextResponse.json({ ok: true });

  const nome = testo(o.nome, 60);
  const frase = testo(o.frase, 600);
  if (!nome) return errore(m.nome);
  if (frase.length < 3) return errore(m.frase);
  const voto = Number(o.voto);
  if (!Number.isInteger(voto) || voto < 1 || voto > 5) return errore(m.voto);
  if (o.consenso !== true) return errore(m.consenso);

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sconosciuto";
  if (!(await nonRobot(o.robot, ip))) return errore(m.robot, 403);
  if (troppe(ip)) return errore(m.troppe, 429);
  if (!scriptPronto()) return errore(m.nonAttivo, 503);

  try {
    const r = await chiamaScript({
      azione: "recensione",
      recensione: { nome, frase, voto, citta: testo(o.citta, 60), prodotto: testo(o.prodotto, 60), consenso: true },
    });
    if (!r.success) return errore(r.error ?? m.nonRisponde);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[recensione]", (e as Error).message);
    return errore(m.nonRisponde, 503);
  }
}
