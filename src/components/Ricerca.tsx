"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import Link from "next/link";
import { euro, giorno } from "@/lib/format";
import { classiStato as classi, linkProdotto } from "@/lib/prodotto";
import { linkWhatsApp } from "@/lib/whatsapp";
import { useCart } from "./CartProvider";

// Ricerca: la lente in alto apre un pannello, i risultati compaiono mentre scrivi.
// Cerca in tutto il foglio (catalogo, preordini, premi dei riscatti) per nome, codice, linea e categoria.
// I sold out stanno in fondo.

// minuscole, senza accenti e senza trattini: "Pokémon BX-56" -> "pokemon bx 56"
function pulito(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function trova(catalogo: Prodotto[], domanda: string) {
  const parole = pulito(domanda).split(" ").filter(Boolean);
  if (!parole.length) return [];
  const tutta = parole.join("");
  const risultati: { p: Prodotto; punti: number; i: number }[] = [];
  catalogo.forEach((p, i) => {
    const testo = pulito(`${p.codice} ${p.nome} ${p.linea} ${p.categoria}`);
    const attaccato = testo.replace(/ /g, "");
    // ogni parola deve esserci; "bx56" trova anche "BX-56"
    if (!parole.every((w) => testo.includes(w) || attaccato.includes(w))) return;
    const codice = pulito(p.codice).replace(/ /g, "");
    let punti = codice === tutta ? 0 : codice.startsWith(tutta) ? 1 : pulito(p.nome).startsWith(parole[0]) ? 2 : 3;
    if (p.stato === "soldout") punti += 10;
    risultati.push({ p, punti, i });
  });
  return risultati.sort((a, b) => a.punti - b.punti || a.i - b.i);
}

export function Ricerca({ onApri }: { onApri: () => void }) {
  const { catalogo, add } = useCart();
  const { lang, t } = useLingua();
  const pathname = usePathname();
  const [aperta, setAperta] = useState(false);
  const [domanda, setDomanda] = useState("");
  const lente = useRef<HTMLButtonElement>(null);
  const campo = useRef<HTMLInputElement>(null);
  const pannello = useRef<HTMLDivElement>(null);

  const risultati = useMemo(() => trova(catalogo, domanda), [catalogo, domanda]);
  const vuota = !domanda.trim();

  useEffect(() => {
    setAperta(false);
  }, [pathname]);

  // pannello aperto: il cursore va nella casella, Esc chiude, il tasto Tab resta dentro e la pagina sotto non scorre
  useEffect(() => {
    if (!aperta) return;
    campo.current?.focus();
    campo.current?.select();
    const tasti = (e: KeyboardEvent) => {
      if (e.key === "Escape") return setAperta(false);
      if (e.key !== "Tab" || !pannello.current) return;
      const cliccabili = [...pannello.current.querySelectorAll<HTMLElement>("input, button:not([disabled]), a[href]")];
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
    const lenteOra = lente.current;
    document.addEventListener("keydown", tasti);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", tasti);
      document.body.style.overflow = "";
      lenteOra?.focus();
    };
  }, [aperta]);

  const stato = vuota ? t.cerca.esempio : risultati.length ? t.cerca.trovati(risultati.length) : t.cerca.nessuno(domanda.trim());

  return (
    <>
      <button
        ref={lente}
        className="icon-btn"
        type="button"
        aria-label={t.cerca.apri}
        aria-haspopup="dialog"
        onClick={() => {
          onApri();
          setAperta(true);
        }}
      >
        <Search size={22} strokeWidth={2} />
      </button>
      {aperta && (
        <div className="cerca-sfondo" onClick={() => setAperta(false)}>
          <div ref={pannello} className="cerca" role="dialog" aria-modal="true" aria-label={t.cerca.titolo} onClick={(e) => e.stopPropagation()}>
            <div className="cerca-testa">
              <Search size={20} strokeWidth={2.2} aria-hidden="true" />
              <input
                ref={campo}
                type="search"
                value={domanda}
                onChange={(e) => setDomanda(e.target.value)}
                placeholder={t.cerca.campo}
                aria-label={t.cerca.campo}
                aria-describedby="cerca-stato"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                maxLength={60}
              />
              <button className="icon-btn" type="button" aria-label={t.cerca.chiudi} onClick={() => setAperta(false)}>
                <X size={22} strokeWidth={2} />
              </button>
            </div>
            <p className="cerca-stato" id="cerca-stato" role="status">
              {stato}
            </p>
            {/* niente risultati: lo chiede su WhatsApp con quello che aveva cercato */}
            {!vuota && risultati.length === 0 && (
              <div className="cerca-niente">
                <p>{t.cerca.nonTrovi}</p>
                <div className="cerca-niente-tasti">
                  <a className="btn btn--primary btn--sm" href={linkWhatsApp(t.cerca.messaggio(domanda.trim()))} target="_blank" rel="noopener noreferrer">
                    {t.cerca.chiedi}
                  </a>
                  <button
                    className="btn btn--ghost btn--sm"
                    type="button"
                    onClick={() => {
                      setDomanda("");
                      campo.current?.focus();
                    }}
                  >
                    {t.cerca.cancella}
                  </button>
                </div>
              </div>
            )}
            {risultati.length > 0 && (
              <ul className="cerca-righe">
                {risultati.map(({ p, i }) => {
                  const sold = p.stato === "soldout";
                  const pre = p.stato === "preordine";
                  const ris = p.stato === "riscatto";
                  return (
                    <li key={`${p.codice}-${i}`} className={sold ? "sold" : undefined}>
                      <span className={`carrello-foto${p.immagine ? "" : " carrello-foto--vuota"}`} aria-hidden="true">
                        {p.immagine ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.immagine} alt="" loading="lazy" referrerPolicy="no-referrer" />
                        ) : (
                          p.codice
                        )}
                      </span>
                      <div className="cerca-nome">
                        <span className="label">
                          {p.linea} · {p.codice}
                        </span>
                        <strong>
                          <Link href={linkProdotto(lang, p.codice)} onClick={() => setAperta(false)}>
                            {p.nome}
                          </Link>
                        </strong>
                        <span className="cerca-info">
                          <span className={`badge ${classi[p.stato]}`}>{t.stati[p.stato]}</span>
                          {pre && <span className="uscita">{p.uscita ? t.card.esce(giorno(p.uscita, lang)) : t.card.daConfermare}</span>}
                        </span>
                      </div>
                      <div className="cerca-azione">
                        <span className="price">{euro(p.prezzo, lang)}</span>
                        {sold ? (
                          <button className="btn btn--sm" type="button" disabled>
                            {t.card.soldout}
                          </button>
                        ) : (
                          <button
                            className={`btn btn--sm ${pre || ris ? "btn--dark" : "btn--primary"}`}
                            type="button"
                            aria-label={`${pre ? t.card.preordina : ris ? t.card.riscatta : t.card.aggiungi}: ${p.nome}`}
                            onClick={() => add(p)}
                          >
                            {pre ? t.card.preordina : ris ? t.card.riscatta : t.card.aggiungi}
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
