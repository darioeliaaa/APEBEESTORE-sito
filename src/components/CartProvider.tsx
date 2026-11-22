"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Minus, Plus, Trash2, X } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { euro, giorno } from "@/lib/format";

// Carrello di prova.
// Preordini e riscatti app non si uniscono ad altri prodotti.
// I preordini tra loro solo se hanno la stessa data.

type Riga = { p: Prodotto; qta: number };

type CartContextValue = {
  count: number;
  add: (p: Prodotto) => void;
  apri: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuori da CartProvider");
  return ctx;
}

export function motivoBlocco(nelCarrello: Prodotto[], p: Prodotto): string | null {
  if (p.stato === "soldout") return "Prodotto sold out.";
  const primo = nelCarrello[0];
  if (!primo) return null;
  if (primo.stato !== p.stato) {
    if (p.stato === "preordine") return "I preordini vanno in un ordine a parte.";
    if (p.stato === "riscatto") return "I riscatti app vanno in un ordine a parte.";
    if (primo.stato === "preordine") return "Hai un preordine nel carrello: questo va in un ordine a parte.";
    return "Hai un riscatto app nel carrello: questo va in un ordine a parte.";
  }
  // confronto la data intera (anno compreso), così 26/12/2026 e 26/12/2027 non si mischiano
  if (p.stato === "preordine" && primo.uscita !== p.uscita) {
    return primo.uscita
      ? `Puoi unire solo preordini con la stessa data (${giorno(primo.uscita)}).`
      : "Puoi unire solo preordini con la stessa data.";
  }
  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [righe, setRighe] = useState<Riga[]>([]);
  const [aperto, setAperto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const chiudiBtn = useRef<HTMLButtonElement>(null);

  const show = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  // pannello aperto: Esc chiude e la pagina sotto non scorre
  useEffect(() => {
    if (!aperto) return;
    chiudiBtn.current?.focus();
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAperto(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [aperto]);

  const add = useCallback(
    (p: Prodotto) => {
      const blocco = motivoBlocco(righe.map((r) => r.p), p);
      if (blocco) {
        show(blocco);
        return;
      }
      setRighe((rr) =>
        rr.some((r) => r.p.codice === p.codice)
          ? rr.map((r) => (r.p.codice === p.codice ? { ...r, qta: r.qta + 1 } : r))
          : [...rr, { p, qta: 1 }],
      );
      show(`${p.codice} aggiunto al carrello`);
    },
    [righe, show],
  );

  const cambia = (codice: string, di: number) =>
    setRighe((rr) => rr.map((r) => (r.p.codice === codice ? { ...r, qta: r.qta + di } : r)).filter((r) => r.qta > 0));

  const count = righe.reduce((n, r) => n + r.qta, 0);
  const totale = righe.reduce((n, r) => n + r.p.prezzo * r.qta, 0);

  return (
    <CartContext.Provider value={{ count, add, apri: () => setAperto(true) }}>
      {children}
      {aperto && (
        <div className="carrello-sfondo" onClick={() => setAperto(false)}>
          <aside
            className="carrello"
            role="dialog"
            aria-modal="true"
            aria-labelledby="carrello-titolo"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="carrello-testa">
              <h2 id="carrello-titolo">Carrello</h2>
              <button ref={chiudiBtn} className="icon-btn" type="button" aria-label="Chiudi il carrello" onClick={() => setAperto(false)}>
                <X size={22} strokeWidth={2} />
              </button>
            </div>

            {righe.length === 0 ? (
              <p className="carrello-vuoto">Il carrello è vuoto.</p>
            ) : (
              <>
                <ul className="carrello-righe">
                  {righe.map(({ p, qta }) => (
                    <li key={p.codice}>
                      <div className="carrello-nome">
                        <span className="label">{p.codice}</span>
                        <strong>{p.nome}</strong>
                        {p.stato === "preordine" && p.uscita && <span className="uscita">Esce il {giorno(p.uscita)}</span>}
                      </div>
                      <div className="carrello-qta">
                        <button type="button" aria-label={`Togli un ${p.codice}`} onClick={() => cambia(p.codice, -1)}>
                          {qta > 1 ? <Minus size={16} strokeWidth={2.4} /> : <Trash2 size={16} strokeWidth={2.2} />}
                        </button>
                        <span aria-label={`Quantità ${qta}`}>{qta}</span>
                        <button type="button" aria-label={`Aggiungi un ${p.codice}`} onClick={() => cambia(p.codice, 1)}>
                          <Plus size={16} strokeWidth={2.4} />
                        </button>
                      </div>
                      <span className="carrello-prezzo">{euro(p.prezzo * qta)}</span>
                    </li>
                  ))}
                </ul>
                <div className="carrello-piede">
                  <div className="carrello-totale">
                    <span>Totale</span>
                    <strong>{euro(totale)}</strong>
                  </div>
                  <span className="incl">Spedizione dal Giappone e dogana incluse</span>
                  <button className="btn btn--primary" type="button" disabled>
                    Concludi l&apos;ordine
                  </button>
                  <span className="carrello-nota">Presto potrai concludere l&apos;ordine direttamente qui.</span>
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
