"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { percorso } from "@/i18n/testi";
import { sistemaCodiceApp } from "@/lib/codiceApp";
import { copia } from "@/lib/copia";
import { euro, giorno } from "@/lib/format";
import { NUMERO_LEGGIBILE, linkWhatsApp } from "@/lib/whatsapp";
import { useCart, type Riga } from "./CartProvider";
import { ControlloRobot, type Robot } from "./ControlloRobot";
import { PageHead } from "./Sections";

// Pagina dell'ordine, in due passi:
// 1) "Ordine con obbligo di pagamento": il sito lo manda allo script di Nicholas (scheda Ordini + email) e riceve il numero ORD-...
// 2) "Invia su WhatsApp": si apre WhatsApp con il messaggio già scritto, per accordarsi sul pagamento.
// Se il salvataggio non è attivo o non risponde, si passa comunque a WhatsApp con un codice creato dal sito.
// Il messaggio è sempre in italiano, qualunque sia la lingua del sito.
// Dopo la conferma la pagina "pronto" resta anche se il browser ricarica la scheda tornando da WhatsApp
// (succede spesso sui telefoni): così il cliente non rifà l'ordine due volte.

const MEMORIA_INVIATO = "apebeestore-ordine-inviato";
type Inviato = { codice: string; link: string; testo: string; registrato: boolean };

type Consegna = "ritiro" | "italia" | "europa" | "mondo";
const costi: Record<Consegna, number> = { ritiro: 0, italia: 8, europa: 15, mondo: 50 };
const cittaRitiro = ["Milano", "Como", "Varese"];
const nomiConsegna: Record<Consegna, string> = {
  ritiro: "Ritiro a mano",
  italia: "Spedizione Italia",
  europa: "Spedizione Europa",
  mondo: "Spedizione resto del mondo",
};

type Dati = {
  nome: string;
  telefono: string;
  email: string;
  consegna: Consegna;
  ritiro: string;
  indirizzo: string;
  citta: string;
  cap: string;
  provincia: string;
  paese: string;
  codiceApp: string;
  note: string;
  accetto: boolean;
};

const vuoti: Dati = {
  nome: "",
  telefono: "",
  email: "",
  consegna: "italia",
  ritiro: "Milano",
  indirizzo: "",
  citta: "",
  cap: "",
  provincia: "",
  paese: "",
  codiceApp: "",
  note: "",
  accetto: false,
};

// "APE-2511-4821": giorno e mese + 4 cifre a caso, per riconoscere l'ordine su WhatsApp
function nuovoCodice() {
  const d = new Date();
  const due = (n: number) => String(n).padStart(2, "0");
  return `APE-${due(d.getDate())}${due(d.getMonth() + 1)}-${String(Math.floor(1000 + Math.random() * 9000))}`;
}

const nomeProdotto = (p: Prodotto) => (p.nome === p.codice ? p.codice : `${p.codice} ${p.nome}`);
const euroIt = (n: number) => euro(n, "it");
const dataIt = (iso: string) => iso.split("-").reverse().join("/");

function messaggio(codice: string, righe: Riga[], d: Dati, inglese: boolean, registrato: boolean, totaleScript?: number) {
  const prodotti = righe.reduce((n, r) => n + r.p.prezzo * r.qta, 0);
  const consegna = costi[d.consegna];
  const righeProdotti = righe.map(({ p, qta }) => {
    let r = `- ${nomeProdotto(p)} x${qta} = ${euroIt(p.prezzo * qta)}`;
    if (p.stato === "preordine") r += p.uscita ? ` (preordine, esce il ${dataIt(p.uscita)})` : " (preordine)";
    if (p.stato === "riscatto") r += ` (riscatto app, codice: ${sistemaCodiceApp(d.codiceApp) ?? d.codiceApp.trim()})`;
    return r;
  });
  const dove =
    d.consegna === "ritiro"
      ? `Ritiro a mano: ${d.ritiro}`
      : `Indirizzo: ${d.indirizzo.trim()}, ${d.cap.trim()} ${d.citta.trim()}${d.provincia.trim() ? ` (${d.provincia.trim()})` : ""}, ${
          d.consegna === "italia" ? "Italia" : d.paese.trim()
        }`;
  return [
    `Ciao! Nuovo ordine dal sito: ${codice}`,
    "",
    "PRODOTTI",
    ...righeProdotti,
    "",
    `Consegna: ${nomiConsegna[d.consegna]} (${consegna ? euroIt(consegna) : "gratis"})`,
    `Totale: ${euroIt(totaleScript ?? prodotti + consegna)}`,
    "",
    "CLIENTE",
    `Nome: ${d.nome.trim()}`,
    `Telefono: ${d.telefono.trim()}`,
    `Email: ${d.email.trim()}`,
    dove,
    ...(d.note.trim() ? ["", `Note: ${d.note.trim()}`] : []),
    ...(inglese ? ["", "(Il cliente ha ordinato dal sito in inglese)"] : []),
    ...(registrato ? [] : ["", "(Attenzione: questo ordine non è stato salvato nel foglio)"]),
  ].join("\n");
}

export function Ordine() {
  const { righe, caricato, totale, apri, svuota, aggiornaPrezzi, rimuovi } = useCart();
  const { lang, t } = useLingua();
  const o = t.ordine;
  const [d, setD] = useState<Dati>(vuoti);
  const [errori, setErrori] = useState<Partial<Record<keyof Dati, string>>>({});
  const [codice, setCodice] = useState("");
  const [inviato, setInviato] = useState<Inviato | null>(null);
  const [invio, setInvio] = useState(false);
  const [erroreServer, setErroreServer] = useState("");
  // prezzi cambiati mentre ordinava: codice -> prezzo che aveva visto
  const [prima, setPrima] = useState<Record<string, number>>({});
  // prodotto appena finito sold out o tolto dal catalogo
  const [daTogliere, setDaTogliere] = useState("");
  const [offline, setOffline] = useState(false);
  const [copiato, setCopiato] = useState(false);
  const trappola = useRef<HTMLInputElement>(null);
  const robot = useRef<Robot>(null);
  const modulo = useRef<HTMLFormElement>(null);

  // il codice si crea nel browser, così è diverso per ogni ordine
  useEffect(() => setCodice(nuovoCodice()), []);

  // senza connessione lo dico subito, e i dati scritti restano
  useEffect(() => {
    const aggiorna = () => {
      setOffline(!navigator.onLine);
      // tornata la connessione, il messaggio "sei offline" non serve più
      if (navigator.onLine) setErroreServer((e) => (e === o.offline ? "" : e));
    };
    aggiorna();
    window.addEventListener("online", aggiorna);
    window.addEventListener("offline", aggiorna);
    return () => {
      window.removeEventListener("online", aggiorna);
      window.removeEventListener("offline", aggiorna);
    };
  }, [o.offline]);

  // tornando da WhatsApp con la pagina ricaricata: se il carrello è vuoto rimostro l'ordine appena inviato
  useEffect(() => {
    if (!caricato || inviato) return;
    try {
      const salvato = JSON.parse(sessionStorage.getItem(MEMORIA_INVIATO) ?? "null");
      if (salvato && !righe.length && Date.now() - salvato.quando < 6 * 60 * 60 * 1000) setInviato(salvato.inviato);
      else if (righe.length) sessionStorage.removeItem(MEMORIA_INVIATO);
    } catch {}
  }, [caricato]); // eslint-disable-line react-hooks/exhaustive-deps

  const imposta = <K extends keyof Dati>(k: K, v: Dati[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    // cambiando consegna spariscono i campi dell'indirizzo: tolgo anche i loro errori
    const via = k === "consegna" ? { indirizzo: undefined, citta: undefined, cap: undefined, provincia: undefined, paese: undefined } : {};
    setErrori((e) => ({ ...e, ...via, [k]: undefined }));
  };

  const spedizione = d.consegna !== "ritiro";
  const conRiscatto = righe.some((r) => r.p.stato === "riscatto");
  const costoConsegna = costi[d.consegna];

  function controlla() {
    const e: Partial<Record<keyof Dati, string>> = {};
    const serve = (k: keyof Dati) => {
      if (!String(d[k]).trim()) e[k] = o.errori.obbligatorio;
    };
    serve("nome");
    serve("telefono");
    serve("email");
    if (d.telefono.trim() && d.telefono.replace(/\D/g, "").length < 6) e.telefono = o.errori.telefono;
    if (d.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = o.errori.email;
    if (spedizione) {
      serve("indirizzo");
      serve("citta");
      serve("cap");
      if (d.consegna === "italia") {
        serve("provincia");
        if (d.cap.trim() && !/^\d{5}$/.test(d.cap.trim())) e.cap = o.errori.cap;
      } else serve("paese");
    }
    if (conRiscatto) serve("codiceApp");
    if (conRiscatto && d.codiceApp.trim() && !sistemaCodiceApp(d.codiceApp)) e.codiceApp = o.errori.codiceApp;
    if (!d.accetto) e.accetto = o.errori.accetto;
    setErrori(e);
    return e;
  }

  async function conferma() {
    if (invio) return;
    setErroreServer("");
    const e = controlla();
    if (Object.keys(e).length) {
      // porto il cursore sul primo campo sbagliato
      const primo = Object.keys(e)[0];
      modulo.current?.querySelector<HTMLElement>(`[name="${primo}"]`)?.focus();
      return;
    }
    if (!navigator.onLine) {
      setErroreServer(o.offline);
      return;
    }
    setInvio(true);
    setDaTogliere("");
    let numero = "";
    let totaleScript: number | undefined;
    try {
      const codiceRobot = (await robot.current?.aspetta()) ?? "";
      const res = await fetch("/api/ordine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // anche il prezzo che il cliente sta vedendo: se nel frattempo è cambiato, il server lo dice
          righe: righe.map((r) => ({ codice: r.p.codice, qta: r.qta, prezzo: r.p.prezzo })),
          dati: { ...d, codiceApp: sistemaCodiceApp(d.codiceApp) ?? d.codiceApp },
          lingua: lang,
          sito: trappola.current?.value ?? "",
          robot: codiceRobot,
        }),
      });
      robot.current?.reset();
      const r = await res.json().catch(() => ({}));
      if (res.ok) {
        numero = r.numero;
        totaleScript = r.totale;
      } else if (res.status !== 503) {
        // l'ordine non va bene: lo dico e non vado avanti
        if (Array.isArray(r.prezzi)) {
          // prezzi cambiati: aggiorno il carrello, segno i vecchi prezzi e il cliente conferma di nuovo
          aggiornaPrezzi(r.prezzi);
          setPrima((x) => ({ ...x, ...Object.fromEntries(r.prezzi.map((c: { codice: string; prima: number }) => [c.codice, x[c.codice] ?? c.prima])) }));
        }
        if (typeof r.togli === "string") setDaTogliere(r.togli);
        setErroreServer(r.errore ?? o.erroreGenerico);
        setInvio(false);
        return;
      }
    } catch {
      // senza rete: i dati restano e si riprova; con la rete ma lo script che non risponde si va comunque su WhatsApp
      if (!navigator.onLine) {
        setErroreServer(o.offline);
        setInvio(false);
        return;
      }
    }
    const registrato = !!numero;
    const codiceFinale = numero || codice;
    const testo = messaggio(codiceFinale, righe, d, lang === "en", registrato, totaleScript);
    const pronto = { codice: codiceFinale, registrato, testo, link: linkWhatsApp(testo) };
    setInviato(pronto);
    try {
      sessionStorage.setItem(MEMORIA_INVIATO, JSON.stringify({ quando: Date.now(), inviato: pronto }));
    } catch {}
    svuota();
    setInvio(false);
    window.scrollTo({ top: 0 });
  }

  // la testata della pagina cambia con l'ordine inviato: "Compila i tuoi dati" non serve più
  const cornice = (contenuto: React.ReactNode, testa = { label: o.label, titolo: o.titolo, testo: o.testo }) => (
    <>
      <PageHead label={testa.label} titolo={testa.titolo} testo={testa.testo} />
      <section className="block block--top">
        <div className="wrap">{contenuto}</div>
      </section>
    </>
  );

  if (inviato) {
    return cornice(
      <div className="ordine-pronto">
        <div className="ordine-pronto-tasti">
          <a className="btn btn--primary ordine-invia" href={inviato.link} target="_blank" rel="noopener noreferrer">
            {o.apriWhatsApp}
          </a>
          {/* se WhatsApp non si apre: il messaggio si copia e si manda a mano al numero scritto per intero */}
          <button
            className="btn btn--ghost"
            type="button"
            onClick={async () => {
              if (await copia(inviato.testo)) {
                setCopiato(true);
                setTimeout(() => setCopiato(false), 2500);
              }
            }}
          >
            {copiato ? o.copiato : o.copia}
          </button>
        </div>
        <p className="ordine-a-mano">{o.aMano(NUMERO_LEGGIBILE.replace(/ /g, "\u00a0"))}</p>
        <span className="sr-only" role="status">
          {copiato ? o.copiato : ""}
        </span>
        <Link
          className="link"
          href={percorso(lang, "/catalogo")}
          onClick={() => {
            try {
              sessionStorage.removeItem(MEMORIA_INVIATO);
            } catch {}
          }}
        >
          {o.continua}
        </Link>
      </div>,
      {
        label: inviato.codice,
        titolo: inviato.registrato ? o.pronto : o.prontoSenzaFoglio,
        testo: inviato.registrato ? o.prontoTesto(inviato.codice) : o.prontoTestoSenzaFoglio(inviato.codice),
      },
    );
  }

  // finché il carrello salvato non è stato letto non mostro niente (niente "carrello vuoto" per un attimo)
  if (!caricato) return cornice(<div className="ordine-attesa" aria-busy="true" />);

  if (!righe.length) {
    return cornice(
      <div className="vuoto">
        <p>{o.vuoto}</p>
        <Link className="btn btn--primary btn--sm" href={percorso(lang, "/catalogo")}>
          {o.vaiCatalogo}
        </Link>
      </div>,
    );
  }

  const campo = (k: keyof Dati, etichetta: string, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className={`campo${errori[k] ? " campo--errore" : ""}`}>
      <span>{etichetta}</span>
      <input
        name={k}
        value={String(d[k])}
        onChange={(e) => imposta(k, e.target.value as never)}
        aria-invalid={!!errori[k]}
        maxLength={200}
        {...extra}
      />
      {errori[k] && <em>{errori[k]}</em>}
    </label>
  );

  return cornice(
    <div className="ordine">
      <aside className="ordine-riepilogo" aria-label={o.riepilogo}>
        <h2>{o.riepilogo}</h2>
        <ul>
          {righe.map(({ p, qta }) => (
            <li key={p.codice} className={prima[p.codice] !== undefined && prima[p.codice] !== p.prezzo ? "ordine-cambiato" : undefined}>
              <span className={`carrello-foto${p.immagine ? "" : " carrello-foto--vuota"}`} aria-hidden="true">
                {p.immagine ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.immagine} alt="" loading="lazy" referrerPolicy="no-referrer" />
                ) : (
                  p.codice
                )}
              </span>
              <span className="ordine-nome">
                <strong>{p.nome}</strong>
                <span className="label">
                  {p.codice} · x{qta}
                </span>
                {p.stato === "preordine" && p.uscita && <span className="uscita">{t.card.esce(giorno(p.uscita, lang))}</span>}
              </span>
              <span className="ordine-prezzo">
                {euro(p.prezzo * qta, lang)}
                {prima[p.codice] !== undefined && prima[p.codice] !== p.prezzo && (
                  <s className="ordine-prima">{o.prima(euro(prima[p.codice] * qta, lang))}</s>
                )}
              </span>
            </li>
          ))}
        </ul>
        <dl>
          <div>
            <dt>{o.prodotti}</dt>
            <dd>{euro(totale, lang)}</dd>
          </div>
          <div>
            <dt>{o.consegna}</dt>
            <dd>{costoConsegna ? euro(costoConsegna, lang) : o.gratis}</dd>
          </div>
          <div className="ordine-totale">
            <dt>{o.totale}</dt>
            <dd>{euro(totale + costoConsegna, lang)}</dd>
          </div>
        </dl>
        <button type="button" className="link" onClick={apri}>
          {o.modifica}
        </button>
      </aside>

      <form className="ordine-modulo" ref={modulo} noValidate onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>{o.dati}</legend>
          {campo("nome", o.nome, { autoComplete: "name", required: true })}
          <div className="campi-2">
            {campo("telefono", o.telefono, { type: "tel", autoComplete: "tel", inputMode: "tel", required: true })}
            {campo("email", o.email, { type: "email", autoComplete: "email", required: true })}
          </div>
        </fieldset>

        <fieldset>
          <legend>{o.comeRicevi}</legend>
          <div className="scelte">
            {(Object.keys(costi) as Consegna[]).map((c) => (
              <label key={c} className={`scelta${d.consegna === c ? " scelta--attiva" : ""}`}>
                <input type="radio" name="consegna" checked={d.consegna === c} onChange={() => imposta("consegna", c)} />
                <span>{o.consegne[c]}</span>
                <strong>{costi[c] ? euro(costi[c], lang) : o.gratis}</strong>
              </label>
            ))}
          </div>

          {d.consegna === "ritiro" ? (
            <label className="campo">
              <span>{o.cittaRitiro}</span>
              <select name="ritiro" value={d.ritiro} onChange={(e) => imposta("ritiro", e.target.value)}>
                {cittaRitiro.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          ) : (
            <>
              {campo("indirizzo", o.indirizzo, { autoComplete: "street-address", required: true })}
              <div className="campi-3">
                {campo("citta", o.citta, { autoComplete: "address-level2", required: true })}
                {campo("cap", o.cap, {
                  autoComplete: "postal-code",
                  inputMode: d.consegna === "italia" ? "numeric" : "text",
                  required: true,
                })}
                {d.consegna === "italia"
                  ? campo("provincia", o.provincia, { autoComplete: "address-level1", required: true, maxLength: 30 })
                  : campo("provincia", o.provinciaEstero, { autoComplete: "address-level1" })}
              </div>
              {d.consegna !== "italia" && campo("paese", o.paese, { autoComplete: "country-name", required: true })}
            </>
          )}
        </fieldset>

        {conRiscatto && (
          <fieldset>
            <legend>{t.stati.riscatto}</legend>
            {campo("codiceApp", o.codiceApp, {
              autoComplete: "off",
              autoCapitalize: "characters",
              spellCheck: false,
              required: true,
              maxLength: 20,
              placeholder: "XXXX-XXXX-XXXX",
              // uscendo dal campo lo rimetto nel formato giusto (maiuscole e trattini)
              onBlur: () => {
                const giusto = sistemaCodiceApp(d.codiceApp);
                if (giusto && giusto !== d.codiceApp) imposta("codiceApp", giusto);
              },
            })}
            <p className="campo-aiuto">{o.codiceAppAiuto}</p>
          </fieldset>
        )}

        <fieldset>
          <label className={`campo${errori.note ? " campo--errore" : ""}`}>
            <span>{o.note}</span>
            <textarea name="note" rows={3} maxLength={500} value={d.note} onChange={(e) => imposta("note", e.target.value)} />
          </label>
        </fieldset>

        <label className={`spunta${errori.accetto ? " campo--errore" : ""}`}>
          <input type="checkbox" name="accetto" checked={d.accetto} onChange={(e) => imposta("accetto", e.target.checked)} />
          {/* i link si aprono in un'altra scheda, così i dati scritti qui non si perdono */}
          <span>
            {o.accetto[0]}
            <a href={percorso(lang, "/condizioni-di-vendita")} target="_blank" rel="noopener">
              {o.accetto[1]}
            </a>
            {o.accetto[2]}
            <a href={percorso(lang, "/privacy")} target="_blank" rel="noopener">
              {o.accetto[3]}
            </a>
            {o.accetto[4]}
          </span>
          {errori.accetto && <em>{errori.accetto}</em>}
        </label>

        {Object.keys(errori).some((k) => errori[k as keyof Dati]) && (
          <p className="ordine-errori" role="alert">
            {o.errori.controlla}
          </p>
        )}

        {offline && !erroreServer && (
          <p className="ordine-errori" role="status">
            {o.offline}
          </p>
        )}

        {erroreServer && (
          <div className="ordine-errori" role="alert">
            <p>{erroreServer}</p>
            {daTogliere && righe.some((r) => r.p.codice === daTogliere) && (
              <button
                type="button"
                className="link"
                onClick={() => {
                  rimuovi(daTogliere);
                  setDaTogliere("");
                  setErroreServer("");
                }}
              >
                {o.togliCodice(daTogliere)}
              </button>
            )}
          </div>
        )}

        {/* campo nascosto contro lo spam: le persone non lo vedono */}
        <input ref={trappola} className="trappola" type="text" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <ControlloRobot lang={lang} ref={robot} />

        <button className="btn btn--primary ordine-invia" type="button" onClick={conferma} disabled={invio} aria-busy={invio}>
          {invio ? o.invio : o.invia}
        </button>
        <p className="campo-aiuto">{o.aiutoInvio}</p>
      </form>
    </div>,
  );
}
