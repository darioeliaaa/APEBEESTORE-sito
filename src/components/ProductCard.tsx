"use client";

import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { euro, giorno } from "@/lib/format";
import { useState } from "react";
import { useCart } from "./CartProvider";

const classi = {
  ordinazione: "badge--order",
  preordine: "badge--pre",
  riscatto: "badge--redeem",
  soldout: "badge--sold",
};

export function ProductCard({ p }: { p: Prodotto }) {
  const { add } = useCart();
  const { lang, t } = useLingua();
  const [fotoRotta, setFotoRotta] = useState(false);
  const foto = p.immagine && !fotoRotta;
  const sold = p.stato === "soldout";
  const pre = p.stato === "preordine";
  const ris = p.stato === "riscatto";

  return (
    <article className={`card${sold ? " sold" : ""}`}>
      <div className={`media${foto ? " media--foto" : ""}`}>
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.immagine} alt={p.nome} loading="lazy" referrerPolicy="no-referrer" onError={() => setFotoRotta(true)} />
        ) : (
          <span className="ph" aria-hidden="true">{p.codice}</span>
        )}
      </div>
      <div className="info">
        <span className={`badge ${classi[p.stato]}`}>{t.stati[p.stato]}</span>
        <div className="cat">
          <span className="label">{p.linea} ·</span>
          <span className="label">{p.codice}</span>
        </div>
        <h3>{p.nome}</h3>
        {pre && <span className="uscita">{p.uscita ? t.card.esce(giorno(p.uscita, lang)) : t.card.daConfermare}</span>}
        <div className="row">
          <span className="price">{euro(p.prezzo, lang)}</span>
          {sold ? (
            <button className="btn btn--sm" type="button" disabled>
              {t.card.soldout}
            </button>
          ) : (
            <button className={`btn btn--sm ${pre || ris ? "btn--dark" : "btn--primary"}`} type="button" onClick={() => add(p)}>
              {pre ? t.card.preordina : ris ? t.card.riscatta : t.card.aggiungi}
            </button>
          )}
        </div>
        {ris && <span className="incl">{t.card.codiceApp}</span>}
      </div>
    </article>
  );
}
