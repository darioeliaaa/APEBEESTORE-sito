"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { ProductCard } from "./ProductCard";

const categorie = ["Beyblade", "Arene", "Accessori"] as const;

const ordini = [
  { id: "consigliati", label: "Consigliati" },
  { id: "prezzo-su", label: "Prezzo crescente" },
  { id: "prezzo-giu", label: "Prezzo decrescente" },
  { id: "nome", label: "Nome A–Z" },
] as const;

const fasce = [
  { id: "tutte", label: "Tutti i prezzi", min: 0, max: Infinity },
  { id: "0-30", label: "Fino a € 30", min: 0, max: 30 },
  { id: "30-60", label: "€ 30 – 60", min: 30, max: 60 },
  { id: "60-100", label: "€ 60 – 100", min: 60, max: 100 },
  { id: "100", label: "Oltre € 100", min: 100, max: Infinity },
] as const;

type Ordine = (typeof ordini)[number]["id"];
type Fascia = (typeof fasce)[number]["id"];
type Pannello = "filtri" | "ordina" | null;

export function CatalogoLista({ prodotti }: { prodotti: Prodotto[] }) {
  const [scelte, setScelte] = useState<string[]>([]);
  const [noSoldOut, setNoSoldOut] = useState(false);
  const [ordine, setOrdine] = useState<Ordine>("consigliati");
  const [fascia, setFascia] = useState<Fascia>("tutte");
  const [aperto, setAperto] = useState<Pannello>(null);
  const barra = useRef<HTMLDivElement>(null);

  // chiude i pannelli con un clic fuori o con Esc
  useEffect(() => {
    if (!aperto) return;
    const fuori = (e: MouseEvent) => {
      if (barra.current && !barra.current.contains(e.target as Node)) setAperto(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAperto(null);
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", fuori);
      document.removeEventListener("keydown", esc);
    };
  }, [aperto]);

  const f = fasce.find((x) => x.id === fascia)!;
  const lista = prodotti
    .filter((p) => scelte.length === 0 || scelte.includes(p.categoria))
    .filter((p) => !noSoldOut || p.stato !== "soldout")
    .filter((p) => (f.min === 0 || p.prezzo > f.min) && p.prezzo <= f.max)
    .sort((a, b) => {
      if (ordine === "prezzo-su") return a.prezzo - b.prezzo;
      if (ordine === "prezzo-giu") return b.prezzo - a.prezzo;
      if (ordine === "nome") return a.nome.localeCompare(b.nome, "it");
      return 0;
    });

  const nFiltri = scelte.length + (noSoldOut ? 1 : 0);
  const nOrdina = (ordine !== "consigliati" ? 1 : 0) + (fascia !== "tutte" ? 1 : 0);
  const cambia = (c: string) => setScelte((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const azzeraFiltri = () => {
    setScelte([]);
    setNoSoldOut(false);
  };
  const azzeraTutto = () => {
    azzeraFiltri();
    setOrdine("consigliati");
    setFascia("tutte");
  };
  const apri = (p: Exclude<Pannello, null>) => setAperto((a) => (a === p ? null : p));

  return (
    <>
      <div className="toolbar" ref={barra}>
        <button
          type="button"
          className="tb-btn"
          aria-expanded={aperto === "filtri"}
          aria-controls="pannello-filtri"
          onClick={() => apri("filtri")}
        >
          <SlidersHorizontal size={18} strokeWidth={2.2} />
          Filtri{nFiltri > 0 && <span className="tb-n">{nFiltri}</span>}
        </button>

        <span className="tb-count">{lista.length} prodotti</span>

        <button
          type="button"
          className="tb-btn"
          aria-expanded={aperto === "ordina"}
          aria-controls="pannello-ordina"
          onClick={() => apri("ordina")}
        >
          <ArrowUpDown size={18} strokeWidth={2.2} />
          Ordina per{nOrdina > 0 && <span className="tb-n">{nOrdina}</span>}
          <ChevronDown size={16} strokeWidth={2.4} />
        </button>

        {aperto === "filtri" && (
          <div className="pop pop--left" id="pannello-filtri" role="dialog" aria-label="Filtri">
            <fieldset>
              <legend>Categoria</legend>
              <label className="opt">
                <input type="checkbox" checked={scelte.length === 0} onChange={() => setScelte([])} />
                Tutti
              </label>
              {categorie.map((c) => (
                <label className="opt" key={c}>
                  <input type="checkbox" checked={scelte.includes(c)} onChange={() => cambia(c)} />
                  {c}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Disponibilità</legend>
              <label className="opt">
                <input type="checkbox" checked={noSoldOut} onChange={() => setNoSoldOut(!noSoldOut)} />
                Nascondi i sold out
              </label>
            </fieldset>
            <div className="pop-foot">
              <button type="button" className="link" onClick={azzeraFiltri}>
                Azzera
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setAperto(null)}>
                Mostra {lista.length} prodotti
              </button>
            </div>
          </div>
        )}

        {aperto === "ordina" && (
          <div className="pop pop--right" id="pannello-ordina" role="dialog" aria-label="Ordina per">
            <fieldset>
              <legend>Ordina per</legend>
              {ordini.map((o) => (
                <label className="opt" key={o.id}>
                  <input type="radio" name="ordine" checked={ordine === o.id} onChange={() => setOrdine(o.id)} />
                  {o.label}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>Fascia di prezzo</legend>
              {fasce.map((x) => (
                <label className="opt" key={x.id}>
                  <input type="radio" name="fascia" checked={fascia === x.id} onChange={() => setFascia(x.id)} />
                  {x.label}
                </label>
              ))}
            </fieldset>
            <div className="pop-foot">
              <button
                type="button"
                className="link"
                onClick={() => {
                  setOrdine("consigliati");
                  setFascia("tutte");
                }}
              >
                Azzera
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setAperto(null)}>
                Mostra {lista.length} prodotti
              </button>
            </div>
          </div>
        )}
      </div>

      {lista.length > 0 ? (
        <div className="grid">
          {lista.map((p) => (
            <ProductCard key={p.codice} p={p} />
          ))}
        </div>
      ) : (
        <div className="vuoto">
          <p>Nessun prodotto con questi filtri.</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={azzeraTutto}>
            Azzera i filtri
          </button>
        </div>
      )}
    </>
  );
}
