"use client";

import type { Prodotto } from "@/data/demo";
import { euro } from "@/lib/format";
import { useCart } from "./CartProvider";

const badge = {
  ordinazione: { cls: "badge--order", testo: () => "Su ordinazione" },
  preordine: { cls: "badge--pre", testo: () => "Preordine" },
  riscatto: { cls: "badge--redeem", testo: () => "Riscatto app" },
  soldout: { cls: "badge--sold", testo: () => "Sold out" },
};

export function ProductCard({ p }: { p: Prodotto }) {
  const { add } = useCart();
  const b = badge[p.stato];
  const sold = p.stato === "soldout";
  const pre = p.stato === "preordine";
  const ris = p.stato === "riscatto";

  return (
    <article className={`card${sold ? " sold" : ""}`}>
      <div className="media">
        <span className="ph" aria-hidden="true">{p.codice}</span>
      </div>
      <div className="info">
        <span className={`badge ${b.cls}`}>{b.testo()}</span>
        <div className="cat">
          <span className="label">{p.categoria} ·</span>
          <span className="label">{p.codice}</span>
        </div>
        <h3>{p.nome}</h3>
        {pre && <span className="uscita">Esce il {p.uscita}</span>}
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
