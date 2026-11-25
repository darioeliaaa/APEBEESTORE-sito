"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { percorso } from "@/i18n/testi";
import { euro, giorno } from "@/lib/format";
import { linkWhatsApp } from "@/lib/whatsapp";
import { useCart, type Riga } from "./CartProvider";

// Pagina dell'ordine, in due passi:
// 1) "Conferma l'ordine": il sito lo manda allo script di Nicholas (scheda Ordini + email) e riceve il numero ORD-...
// 2) "Invia su WhatsApp": si apre WhatsApp con il messaggio già scritto, per accordarsi sul pagamento.
// Se il salvataggio non è attivo o non risponde, si passa comunque a WhatsApp con un codice creato dal sito.
// Il messaggio è sempre in italiano, qualunque sia la lingua del sito.

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
    if (p.stato === "riscatto") r += ` (riscatto app, codice: ${d.codiceApp.trim()})`;
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
  const { righe, caricato, totale, apri, svuota } = useCart();
  const { lang, t } = useLingua();
  const o = t.ordine;
  const [d, setD] = useState<Dati>(vuoti);
  const [errori, setErrori] = useState<Partial<Record<keyof Dati, string>>>({});
  const [codice, setCodice] = useState("");
  const [inviato, setInviato] = useState<{ codice: string; link: string; registrato: boolean } | null>(null);
  const [invio, setInvio] = useState(false);
  const [erroreServer, setErroreServer] = useState("");
  const trappola = useRef<HTMLInputElement>(null);
  const modulo = useRef<HTMLFormElement>(null);

  // il codice si crea nel browser, così è diverso per ogni ordine
  useEffect(() => setCodice(nuovoCodice()), []);

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
    setInvio(true);
    let numero = "";
    let totaleScript: number | undefined;
    try {
      const res = await fetch("/api/ordine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          righe: righe.map((r) => ({ codice: r.p.codice, qta: r.qta })),
          dati: d,
          lingua: lang,
          sito: trappola.current?.value ?? "",
        }),
      });
      const r = await res.json().catch(() => ({}));
      if (res.ok) {
        numero = r.numero;
        totaleScript = r.totale;
      } else if (res.status !== 503) {
        // l'ordine non va bene (es. un prodotto è appena finito sold out): lo dico e non vado avanti
        setErroreServer(r.errore ?? o.erroreGenerico);
        setInvio(false);
        return;
      }
    } catch {
      // senza rete o script che non risponde: si va comunque su WhatsApp
    }
    const registrato = !!numero;
    const codiceFinale = numero || codice;
    setInviato({
      codice: codiceFinale,
      registrato,
      link: linkWhatsApp(messaggio(codiceFinale, righe, d, lang === "en", registrato, totaleScript)),
    });
    svuota();
    setInvio(false);
    window.scrollTo({ top: 0 });
  }

  if (inviato) {
    return (
      <div className="ordine-pronto">
        <span className="label">{inviato.codice}</span>
        <h2>{inviato.registrato ? o.pronto : o.prontoSenzaFoglio}</h2>
        <p>{inviato.registrato ? o.prontoTesto(inviato.codice) : o.prontoTestoSenzaFoglio(inviato.codice)}</p>
        <a className="btn btn--primary ordine-invia" href={inviato.link} target="_blank" rel="noopener noreferrer">
          {o.apriWhatsApp}
        </a>
        <Link className="link" href={percorso(lang, "/catalogo")}>
          {o.continua}
        </Link>
      </div>
    );
  }

  // finché il carrello salvato non è stato letto non mostro niente (niente "carrello vuoto" per un attimo)
  if (!caricato) return <div className="ordine-attesa" aria-busy="true" />;

  if (!righe.length) {
    return (
      <div className="vuoto">
        <p>{o.vuoto}</p>
        <Link className="btn btn--primary btn--sm" href={percorso(lang, "/catalogo")}>
          {o.vaiCatalogo}
        </Link>
      </div>
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

  return (
    <div className="ordine">
      <aside className="ordine-riepilogo" aria-label={o.riepilogo}>
        <h2>{o.riepilogo}</h2>
        <ul>
          {righe.map(({ p, qta }) => (
            <li key={p.codice}>
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
              <span className="ordine-prezzo">{euro(p.prezzo * qta, lang)}</span>
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
            {campo("codiceApp", o.codiceApp, { autoComplete: "off", required: true, maxLength: 60 })}
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
          <span>{o.accetto}</span>
          {errori.accetto && <em>{errori.accetto}</em>}
        </label>

        {Object.keys(errori).some((k) => errori[k as keyof Dati]) && (
          <p className="ordine-errori" role="alert">
            {o.errori.controlla}
          </p>
        )}

        {erroreServer && (
          <p className="ordine-errori" role="alert">
            {erroreServer}
          </p>
        )}

        {/* campo nascosto contro lo spam: le persone non lo vedono */}
        <input ref={trappola} className="trappola" type="text" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <button className="btn btn--primary ordine-invia" type="button" onClick={conferma} disabled={invio} aria-busy={invio}>
          {invio ? o.invio : o.invia}
        </button>
        <p className="campo-aiuto">{o.aiutoInvio}</p>
      </form>
    </div>
  );
}
