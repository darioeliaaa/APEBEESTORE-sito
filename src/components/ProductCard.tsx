"use client";

import type { Prodotto } from "@/data/demo";
import { euro, giorno } from "@/lib/format";
import { useState } from "react";
import { useCart } from "./CartProvider";

const badge = {
  ordinazione: { cls: "badge--order", testo: () => "Su ordinazione" },
  preordine: { cls: "badge--pre", testo: () => "Preordine" },
  riscatto: { cls: "badge--redeem", testo: () => "Riscatto app" },
  soldout: { cls: "badge--sold", testo: () => "Sold out" },
};

export function ProductCard({ p }: { p: Prodotto }) {
  const { add } = useCart();
  const [fotoRotta, setFotoRotta] = useState(false);
  const foto = p.immagine && !fotoRotta;
  const b = badge[p.stato];
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
        <span className={`badge ${b.cls}`}>{b.testo()}</span>
        <div className="cat">
          <span className="label">{p.linea} ·</span>
          <span className="label">{p.codice}</span>
        </div>
        <h3>{p.nome}</h3>
        {pre && <span className="uscita">{p.uscita ? `Esce il ${giorno(p.uscita)}` : "Data da confermare"}</span>}
        <div className="row">
          <span className="price">{euro(p.prezzo)}</span>
          {sold ? (
            <button className="btn btn--sm" type="button" disabled>
              Sold out
            </button>
          ) : (
            <button className={`btn btn--sm ${pre || ris ? "btn--dark" : "btn--primary"}`} type="button" onClick={() => add(p)}>
              {pre ? "Preordina" : ris ? "Riscatta" : "Aggiungi"}
            </button>
          )}
        </div>
        {ris && <span className="incl">Serve il codice dell&apos;app</span>}
      </div>
    </article>
  );
}
