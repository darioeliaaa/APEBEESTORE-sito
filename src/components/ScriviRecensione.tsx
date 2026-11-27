"use client";

import { useRef, useState } from "react";
import { Star, X } from "lucide-react";
import { useLingua } from "@/i18n/LinguaProvider";
import { ControlloRobot, type Robot } from "./ControlloRobot";

// Modulo "Lascia una recensione": la recensione va allo script di Nicholas, che la scrive nella scheda
// RECENSIONI del foglio con Attivo spento. Sul sito compare solo quando lui mette la spunta.

type Dati = { voto: number; nome: string; citta: string; prodotto: string; frase: string; consenso: boolean };
const vuoti: Dati = { voto: 0, nome: "", citta: "", prodotto: "", frase: "", consenso: false };

export function ScriviRecensione() {
  const { lang, t } = useLingua();
  const s = t.recensioni.scrivi;
  const [d, setD] = useState<Dati>(vuoti);
  const [errori, setErrori] = useState<Partial<Record<keyof Dati, string>>>({});
  const [errore, setErrore] = useState("");
  const [invio, setInvio] = useState(false);
  const [fatto, setFatto] = useState(false);
  const [aperto, setAperto] = useState(false); // il modulo si apre con il tasto "Scrivi la recensione"
  const [sopra, setSopra] = useState(0); // stella sotto il mouse, per far vedere il voto prima del clic
  const trappola = useRef<HTMLInputElement>(null);
  const robot = useRef<Robot>(null);
  const modulo = useRef<HTMLFormElement>(null);
  const grazie = useRef<HTMLDivElement>(null);
  const tastoApri = useRef<HTMLButtonElement>(null);

  const imposta = <K extends keyof Dati>(k: K, v: Dati[K]) => {
    setD((x) => ({ ...x, [k]: v }));
    setErrori((e) => ({ ...e, [k]: undefined }));
  };

  async function manda() {
    if (invio) return;
    setErrore("");
    const e: Partial<Record<keyof Dati, string>> = {};
    if (!d.voto) e.voto = s.erroreVoto;
    if (!d.nome.trim()) e.nome = t.ordine.errori.obbligatorio;
    if (d.frase.trim().length < 3) e.frase = t.ordine.errori.obbligatorio;
    if (!d.consenso) e.consenso = t.ordine.errori.accetto;
    setErrori(e);
    if (Object.keys(e).length) {
      modulo.current?.querySelector<HTMLElement>(`[name="${Object.keys(e)[0]}"]`)?.focus();
      return;
    }
    if (!navigator.onLine) return setErrore(s.offline);
    setInvio(true);
    try {
      const codiceRobot = (await robot.current?.aspetta()) ?? "";
      const res = await fetch("/api/recensione", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...d, lingua: lang, sito: trappola.current?.value ?? "", robot: codiceRobot }),
      });
      robot.current?.reset();
      const r = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrore(r.errore ?? s.erroreGenerico);
        return;
      }
      setFatto(true);
      setD(vuoti);
      // il messaggio di grazie prende il posto del modulo: ci porto il cursore
      setTimeout(() => grazie.current?.focus(), 0);
    } catch {
      setErrore(navigator.onLine ? s.erroreGenerico : s.offline);
    } finally {
      setInvio(false);
    }
  }

  function apri() {
    setAperto(true);
    // aperto il modulo, il cursore va sulla prima stella
    setTimeout(() => modulo.current?.querySelector<HTMLElement>('input[name="voto"]')?.focus(), 0);
  }

  function chiudi() {
    // quello che hai scritto resta, se lo riapri lo ritrovi
    setAperto(false);
    setFatto(false);
    setErrore("");
    setTimeout(() => tastoApri.current?.focus(), 0);
  }

  return (
    <section className={`scrivi-recensione${aperto ? "" : " scrivi-recensione--chiusa"}`} aria-labelledby="scrivi-recensione">
      <div className="scrivi-testa">
        <h2 id="scrivi-recensione">{s.titolo}</h2>
        {aperto ? (
          <button type="button" className="icon-btn scrivi-chiudi" aria-label={s.chiudi} onClick={chiudi}>
            <X size={22} strokeWidth={2} aria-hidden="true" />
          </button>
        ) : (
          <button ref={tastoApri} type="button" className="btn btn--primary" aria-expanded={false} onClick={apri}>
            {s.apri}
          </button>
        )}
      </div>
      {!aperto ? null : fatto ? (
        <div className="scrivi-grazie" ref={grazie} tabIndex={-1} role="status">
          <p>{s.grazie}</p>
          <button type="button" className="link" onClick={() => setFatto(false)}>
            {s.altra}
          </button>
        </div>
      ) : (
        <form id="modulo-recensione" ref={modulo} noValidate onSubmit={(e) => (e.preventDefault(), manda())}>
          <p className="scrivi-testo">{s.testo}</p>
          {/* stelle: sono 5 radio, quindi si scelgono anche con le frecce della tastiera */}
          <fieldset className={`stelle-scelta${errori.voto ? " campo--errore" : ""}`}>
            <legend>{s.voto}</legend>
            {/* le stelle sotto il mouse si accendono solo se il mouse si muove davvero:
                se scegli con la tastiera vedi sempre il voto scelto */}
            <div className="stelle-riga" onMouseLeave={() => setSopra(0)} onKeyDown={() => setSopra(0)}>
              {[1, 2, 3, 4, 5].map((n) => (
                <label key={n} className={(sopra || d.voto) >= n ? "piena" : undefined} onMouseMove={(e) => (e.movementX || e.movementY) && sopra !== n && setSopra(n)}>
                  <input type="radio" name="voto" value={n} checked={d.voto === n} onChange={() => (imposta("voto", n), setSopra(0))} />
                  <Star size={34} strokeWidth={1.8} aria-hidden="true" />
                  <span className="sr-only">{t.recensioni.stelle(n)}</span>
                </label>
              ))}
            </div>
            {errori.voto && <em>{errori.voto}</em>}
          </fieldset>
          <div className="campi-2">
            <label className={`campo${errori.nome ? " campo--errore" : ""}`}>
              <span>{s.nome}</span>
              <input name="nome" value={d.nome} onChange={(e) => imposta("nome", e.target.value)} autoComplete="given-name" maxLength={60} required aria-invalid={!!errori.nome} />
              {errori.nome && <em>{errori.nome}</em>}
            </label>
            <label className="campo">
              <span>{s.citta}</span>
              <input name="citta" value={d.citta} onChange={(e) => imposta("citta", e.target.value)} autoComplete="address-level2" maxLength={60} />
            </label>
          </div>
          <label className="campo">
            <span>{s.prodotto}</span>
            <input name="prodotto" value={d.prodotto} onChange={(e) => imposta("prodotto", e.target.value)} placeholder={s.prodottoEsempio} maxLength={60} />
          </label>
          <label className={`campo${errori.frase ? " campo--errore" : ""}`}>
            <span>{s.frase}</span>
            <textarea name="frase" rows={4} maxLength={600} value={d.frase} onChange={(e) => imposta("frase", e.target.value)} required aria-invalid={!!errori.frase} />
            {errori.frase && <em>{errori.frase}</em>}
          </label>
          <label className={`spunta${errori.consenso ? " campo--errore" : ""}`}>
            <input type="checkbox" name="consenso" checked={d.consenso} onChange={(e) => imposta("consenso", e.target.checked)} />
            <span>{s.consenso}</span>
            {errori.consenso && <em>{errori.consenso}</em>}
          </label>
          {/* campo nascosto contro lo spam: le persone non lo vedono */}
          <input ref={trappola} className="trappola" type="text" name="sito" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <ControlloRobot lang={lang} ref={robot} />
          {errore && (
            <p className="ordine-errori" role="alert">
              {errore}
            </p>
          )}
          <button className="btn btn--primary" type="submit" disabled={invio} aria-busy={invio}>
            {invio ? s.invio : s.invia}
          </button>
        </form>
      )}
    </section>
  );
}
