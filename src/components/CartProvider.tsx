"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import { euro, giorno } from "@/lib/format";

// Carrello.
// Preordini e riscatti app non si uniscono ad altri prodotti.
// Un riscatto app è sempre da solo: un premio per ordine, una volta sola.
// I preordini tra loro solo se hanno la stessa data.
// I testi (anche i messaggi) sono nel dizionario src/i18n/testi.ts.

export type Riga = { p: Prodotto; qta: number };

type CartContextValue = {
  righe: Riga[];
  caricato: boolean; // false finché il carrello salvato nel browser non è stato letto
  count: number;
  totale: number;
  add: (p: Prodotto) => void;
  apri: () => void;
  svuota: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuori da CartProvider");
  return ctx;
}

export function motivoBlocco(nelCarrello: Prodotto[], p: Prodotto, lang: Lingua): string | null {
  const b = testi[lang].carrello.blocchi;
  if (p.stato === "soldout") return b.soldout;
  const primo = nelCarrello[0];
  if (!primo) return null;
  if (primo.stato === "riscatto" && p.stato === "riscatto") return b.unRiscatto;
  if (primo.stato !== p.stato) {
    if (p.stato === "preordine") return b.preordine;
    if (p.stato === "riscatto") return b.riscatto;
    if (primo.stato === "preordine") return b.hoPreordine;
    return b.hoRiscatto;
  }
  // confronto la data intera (anno compreso), così 26/12/2026 e 26/12/2027 non si mischiano
  if (p.stato === "preordine" && primo.uscita !== p.uscita) {
    return b.data(primo.uscita ? giorno(primo.uscita, lang) : undefined);
  }
  return null;
}

// il carrello resta salvato nel browser per 14 giorni, così non si perde ricaricando la pagina
const MEMORIA = "apebeestore-carrello";
const DURATA = 14 * 24 * 60 * 60 * 1000;
const MAX_QTA = 99;
// quanti pezzi dello stesso prodotto: un premio dei riscatti si prende una volta sola
const massimo = (p: Prodotto) => (p.stato === "riscatto" ? 1 : MAX_QTA);
const statiValidi = ["ordinazione", "preordine", "riscatto", "soldout"];

// quello che arriva dal browser lo ricontrollo: potrebbe essere vecchio o modificato a mano
function rigaValida(r: unknown): r is Riga {
  const x = r as Riga;
  return (
    !!x?.p &&
    typeof x.p.codice === "string" &&
    typeof x.p.nome === "string" &&
    typeof x.p.prezzo === "number" &&
    x.p.prezzo >= 1 &&
    x.p.prezzo <= 5000 &&
    statiValidi.includes(x.p.stato) &&
    x.p.stato !== "soldout" &&
    Number.isInteger(x.qta) &&
    x.qta >= 1 &&
    x.qta <= MAX_QTA
  );
}

function caricaCarrello(): Riga[] {
  try {
    const salvato = JSON.parse(localStorage.getItem(MEMORIA) ?? "null");
    if (!salvato || Date.now() - salvato.quando > DURATA || !Array.isArray(salvato.righe)) return [];
    return salvato.righe.filter(rigaValida);
  } catch {
    return [];
  }
}

// il carrello salvato può essere vecchio: lo confronto con il catalogo di adesso
// (prezzi aggiornati, sold out e prodotti spariti tolti, niente mischiati che non si possono unire)
function allinea(salvate: Riga[], catalogo: Prodotto[] | null, lang: Lingua): { righe: Riga[]; avvisi: string[] } {
  if (!catalogo) return { righe: salvate, avvisi: [] };
  const a = testi[lang].carrello.avvisi;
  const avvisi: string[] = [];
  const righe: Riga[] = [];
  for (const r of salvate) {
    const ora = catalogo.find((p) => p.codice === r.p.codice);
    if (!ora) {
      avvisi.push(a.sparito(r.p.codice));
      continue;
    }
    if (ora.stato === "soldout") {
      avvisi.push(a.soldout(ora.codice));
      continue;
    }
    if (motivoBlocco(righe.map((x) => x.p), ora, lang)) {
      avvisi.push(a.aParte(ora.codice));
      continue;
    }
    if (ora.prezzo !== r.p.prezzo) avvisi.push(a.prezzo(ora.codice, euro(ora.prezzo, lang)));
    righe.push({ p: ora, qta: Math.min(r.qta, massimo(ora)) });
  }
  return { righe, avvisi };
}

export function CartProvider({ catalogo, children }: { catalogo: Prodotto[] | null; children: React.ReactNode }) {
  const { lang, t } = useLingua();
  const [righe, setRighe] = useState<Riga[]>([]);
  const [avvisi, setAvvisi] = useState<string[]>([]);
  const [caricato, setCaricato] = useState(false);
  const [aperto, setAperto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chiudiBtn = useRef<HTMLButtonElement>(null);
  const pannello = useRef<HTMLElement>(null);
  const prima = useRef<HTMLElement | null>(null);

  // all'apertura della pagina riprendo il carrello salvato e lo allineo al catalogo
  useEffect(() => {
    const { righe: aggiornate, avvisi: note } = allinea(caricaCarrello(), catalogo, lang);
    setRighe(aggiornate);
    setAvvisi(note);
    setCaricato(true);
  }, [catalogo, lang]);

  useEffect(() => {
    if (!caricato) return;
    try {
      if (righe.length) localStorage.setItem(MEMORIA, JSON.stringify({ quando: Date.now(), righe }));
      else localStorage.removeItem(MEMORIA);
    } catch {}
  }, [righe, caricato]);

  const show = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  useEffect(() => {
    if (avvisi.length) show(t.carrello.aggiornato);
  }, [avvisi, show, t]);

  // pannello aperto: Esc chiude, il tasto Tab resta dentro il pannello e la pagina sotto non scorre
  useEffect(() => {
    if (!aperto) return;
    prima.current = document.activeElement as HTMLElement | null;
    chiudiBtn.current?.focus();
    const tasti = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setAperto(false);
      if (e.key !== "Tab" || !pannello.current) return;
      const cliccabili = [...pannello.current.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]")];
      if (!cliccabili.length) return;
      const primo = cliccabili[0];
      const ultimo = cliccabili[cliccabili.length - 1];
      const fuori = !pannello.current.contains(document.activeElement);
      if (e.shiftKey && (document.activeElement === primo || fuori)) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && (document.activeElement === ultimo || fuori)) {
        e.preventDefault();
        primo.focus();
      }
    };
    document.addEventListener("keydown", tasti);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tasti);
      document.body.style.overflow = "";
      // chiuso il carrello, il cursore torna dov'era (sull'icona del carrello); gli avvisi li hai già visti
      prima.current?.focus();
      setAvvisi([]);
    };
  }, [aperto]);

  const add = useCallback(
    (p: Prodotto) => {
      const blocco = motivoBlocco(righe.map((r) => r.p), p, lang);
      if (blocco) {
        show(blocco);
        return;
      }
      const gia = righe.find((r) => r.p.codice === p.codice);
      if (gia && gia.qta >= MAX_QTA) {
        show(t.carrello.massimo(MAX_QTA));
        return;
      }
      setRighe((rr) =>
        rr.some((r) => r.p.codice === p.codice)
          ? rr.map((r) => (r.p.codice === p.codice ? { ...r, qta: r.qta + 1 } : r))
          : [...rr, { p, qta: 1 }],
      );
      show(t.carrello.aggiunto(p.codice));
    },
    [righe, show, lang, t],
  );

  const cambia = (codice: string, di: number) =>
    setRighe((rr) =>
      rr.map((r) => (r.p.codice === codice ? { ...r, qta: Math.min(massimo(r.p), r.qta + di) } : r)).filter((r) => r.qta > 0),
    );

  const count = righe.reduce((n, r) => n + r.qta, 0);
  const totale = righe.reduce((n, r) => n + r.p.prezzo * r.qta, 0);

  return (
    <CartContext.Provider value={{ righe, caricato, count, totale, add, apri: () => setAperto(true), svuota: () => setRighe([]) }}>
      {children}
      {aperto && (
        <div className="carrello-sfondo" onClick={() => setAperto(false)}>
          <aside
            ref={pannello}
            className="carrello"
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrello-titolo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="carrello-testa">
              <h2 id="carrello-titolo">{t.carrello.titolo}</h2>
              <button ref={chiudiBtn} className="icon-btn" type="button" aria-label={t.carrello.chiudi} onClick={() => setAperto(false)}>
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            {avvisi.length > 0 && (
              <ul className="carrello-avvisi">
                {avvisi.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}

            {righe.length === 0 ? (
              <p className="carrello-vuoto">{t.carrello.vuoto}</p>
            ) : (
              <>
                <ul className="carrello-righe">
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
                      <div className="carrello-nome">
                        <span className="label">{p.codice}</span>
                        <strong>{p.nome}</strong>
                        {p.stato === "preordine" && p.uscita && <span className="uscita">{t.card.esce(giorno(p.uscita, lang))}</span>}
                      </div>
                      <div className="carrello-qta">
                        <button type="button" aria-label={t.carrello.togli(p.codice)} onClick={() => cambia(p.codice, -1)}>
                          {qta > 1 ? <Minus size={16} strokeWidth={2.4} /> : <Trash2 size={16} strokeWidth={2.2} />}
                        </button>
                        <span aria-label={t.carrello.quantita(qta)}>{qta}</span>
                        <button
                          type="button"
                          aria-label={t.carrello.aggiungiUno(p.codice)}
                          disabled={qta >= massimo(p)}
                          onClick={() => cambia(p.codice, 1)}
                        >
                          <Plus size={16} strokeWidth={2.4} />
                        </button>
                      </div>
                      <span className="carrello-prezzo">{euro(p.prezzo * qta, lang)}</span>
                    </li>
                  ))}
                </ul>
                <div className="carrello-piede">
                  <div className="carrello-totale">
                    <span>{t.carrello.totale}</span>
                    <strong>{euro(totale, lang)}</strong>
                  </div>
                  <span className="incl">{t.carrello.incluse}</span>
                  <Link className="btn btn--primary" href={percorso(lang, "/ordine")} onClick={() => setAperto(false)}>
                    {t.carrello.concludi}
                  </Link>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </CartContext.Provider>
  );
}
