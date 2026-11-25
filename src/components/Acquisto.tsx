"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Share2 } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { copia } from "@/lib/copia";
import { useCart } from "./CartProvider";

// pagina del prodotto: quantità, tasto per il carrello e "Condividi"
export function Acquisto({ p }: { p: Prodotto }) {
  const { add } = useCart();
  const { t } = useLingua();
  const [qta, setQta] = useState(1);
  const [copiato, setCopiato] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const sold = p.stato === "soldout";
  const pre = p.stato === "preordine";
  const ris = p.stato === "riscatto";
  const max = ris ? 1 : 99;

  // sul telefono apre la condivisione del telefono (WhatsApp, Instagram...), sul computer copia il link
  const condividi = async () => {
    const url = window.location.href;
    if (navigator.share && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ title: document.title, url });
      } catch {}
      return;
    }
    if (!(await copia(url))) return;
    setCopiato(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiato(false), 2500);
  };

  return (
    <div className="acquisto">
      {!sold && !ris && (
        <div className="acquisto-qta">
          <span className="label">{t.prodotto.quantita}</span>
          <div className="carrello-qta">
            <button type="button" aria-label={t.prodotto.meno} disabled={qta <= 1} onClick={() => setQta((q) => Math.max(1, q - 1))}>
              <Minus size={16} strokeWidth={2.4} />
            </button>
            <span aria-live="polite">{qta}</span>
            <button type="button" aria-label={t.prodotto.piu} disabled={qta >= max} onClick={() => setQta((q) => Math.min(max, q + 1))}>
              <Plus size={16} strokeWidth={2.4} />
            </button>
          </div>
        </div>
      )}
      <div className="acquisto-tasti">
        {sold ? (
          <button className="btn" type="button" disabled>
            {t.card.soldout}
          </button>
        ) : (
          <button className={`btn ${pre || ris ? "btn--dark" : "btn--primary"}`} type="button" onClick={() => add(p, qta)}>
            {pre ? t.card.preordina : ris ? t.card.riscatta : t.card.aggiungi}
          </button>
        )}
        <button className="btn btn--ghost" type="button" onClick={condividi}>
          <Share2 size={18} strokeWidth={2.2} aria-hidden="true" />
          {t.prodotto.condividi}
        </button>
      </div>
      <span className="acquisto-copiato" role="status">
        {copiato ? t.prodotto.copiato : ""}
      </span>
    </div>
  );
}
