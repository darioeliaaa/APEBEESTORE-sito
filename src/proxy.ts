import { timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// La pagina /controllo mostra i problemi del foglio: la vede solo chi ha la parola d'ordine.
// Il browser la chiede con la sua finestrella (nome utente qualsiasi).
// Se CONTROLLO_PASSWORD non c'è, la pagina non esiste.

function uguali(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

// contro chi prova le password a raffica: dopo 10 password sbagliate in 15 minuti dallo stesso indirizzo
// la pagina risponde "riprova più tardi" anche alla password giusta, finché non passano i 15 minuti
const sbagliate = new Map<string, number[]>();
const QUINDICI_MINUTI = 15 * 60 * 1000;
function bloccato(ip: string) {
  const ora = Date.now();
  const recenti = (sbagliate.get(ip) ?? []).filter((t) => ora - t < QUINDICI_MINUTI);
  if (recenti.length) sbagliate.set(ip, recenti);
  else sbagliate.delete(ip);
  return recenti.length >= 10;
}

export function proxy(req: NextRequest) {
  const giusta = process.env.CONTROLLO_PASSWORD;
  if (!giusta) return new NextResponse("Pagina non trovata", { status: 404 });

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "sconosciuto";
  if (bloccato(ip)) return new NextResponse("Troppi tentativi: riprova tra 15 minuti", { status: 429 });

  const [tipo, valore] = (req.headers.get("authorization") ?? "").split(" ");
  if (tipo === "Basic" && valore) {
    const scritta = Buffer.from(valore, "base64").toString();
    const password = scritta.slice(scritta.indexOf(":") + 1);
    if (!uguali(password, giusta)) sbagliate.set(ip, [...(sbagliate.get(ip) ?? []), Date.now()]);
    else {
      const res = NextResponse.next();
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
  }
  return new NextResponse("Serve la parola d'ordine", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Controllo foglio", charset="UTF-8"' },
  });
}

export const config = { matcher: ["/controllo"] };
