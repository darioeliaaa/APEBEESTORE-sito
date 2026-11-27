"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpDown, ChevronDown, SlidersHorizontal } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { useLingua } from "@/i18n/LinguaProvider";
import { nomeCategoria } from "@/i18n/testi";
import { ProductCard } from "./ProductCard";

// le linee e le categorie si creano da sole dai prodotti:
// una linea o una categoria nuova nel foglio compare qui senza toccare il codice
function albero(prodotti: Prodotto[]) {
  const linee = new Map<string, string[]>();
  for (const p of prodotti) {
    const cat = linee.get(p.linea) ?? [];
    if (!cat.includes(p.categoria)) cat.push(p.categoria);
    linee.set(p.linea, cat);
  }
  return [...linee].map(([linea, categorie]) => ({ linea, categorie }));
}

const chiave = (linea: string, categoria: string) => `${linea}/${categoria}`;

// i nomi da mostrare sono nel dizionario (src/i18n/testi.ts)
const ordini = [{ id: "consigliati" }, { id: "uscita" }, { id: "prezzo-su" }, { id: "prezzo-giu" }, { id: "nome" }] as const;

const fasce = [
  { id: "tutte", min: 0, max: Infinity },
  { id: "0-30", min: 0, max: 30 },
  { id: "30-60", min: 30, max: 60 },
  { id: "60-100", min: 60, max: 100 },
  { id: "100", min: 100, max: Infinity },
] as const;

type Ordine = (typeof ordini)[number]["id"];
type Fascia = (typeof fasce)[number]["id"];
type Pannello = "filtri" | "ordina" | null;

export function CatalogoLista({ prodotti }: { prodotti: Prodotto[] }) {
  const { lang, t } = useLingua();
  const quanti = t.filtri.quanti;
  const [scelte, setScelte] = useState<string[]>([]);
  const [noSoldOut, setNoSoldOut] = useState(false);
  const [ordine, setOrdine] = useState<Ordine>("consigliati");
  const [fascia, setFascia] = useState<Fascia>("tutte");
  const [aperto, setAperto] = useState<Pannello>(null);
  const [pronto, setPronto] = useState(false);
  const barra = useRef<HTMLDivElement>(null);

  // le scelte restano nell'indirizzo (es. /catalogo?ordine=prezzo-su):
  // tornando indietro o condividendo il link si ritrova il catalogo come lo si era lasciato
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const esistono = new Set(prodotti.map((p) => chiave(p.linea, p.categoria)));
    const o = q.get("ordine");
    const fz = q.get("prezzo");
    setScelte(q.getAll("cat").filter((c) => esistono.has(c)));
    setNoSoldOut(q.get("soldout") === "no");
    if (ordini.some((x) => x.id === o)) setOrdine(o as Ordine);
    if (fasce.some((x) => x.id === fz)) setFascia(fz as Fascia);
    setPronto(true);
  }, [prodotti]);

  useEffect(() => {
    if (!pronto) return;
    const q = new URLSearchParams();
    for (const c of scelte) q.append("cat", c);
    if (noSoldOut) q.set("soldout", "no");
    if (ordine !== "consigliati") q.set("ordine", ordine);
    if (fascia !== "tutte") q.set("prezzo", fascia);
    const cerca = q.toString() ? `?${q}` : "";
    if (cerca !== window.location.search) window.history.replaceState(null, "", window.location.pathname + cerca);
  }, [pronto, scelte, noSoldOut, ordine, fascia]);

  // chiude i pannelli con un clic fuori o con Esc; sul telefono il pannello sale dal basso e la pagina sotto non scorre
  useEffect(() => {
    if (!aperto) return;
    const fuori = (e: MouseEvent) => {
      if (barra.current && !barra.current.contains(e.target as Node)) setAperto(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAperto(null);
    const telefono = window.matchMedia("(max-width: 520px)").matches;
    document.addEventListener("mousedown", fuori);
    document.addEventListener("keydown", esc);
    if (telefono) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("mousedown", fuori);
      document.removeEventListener("keydown", esc);
      if (telefono) document.body.style.overflow = "";
    };
  }, [aperto]);

  const f = fasce.find((x) => x.id === fascia)!;
  const lista = prodotti
    .filter((p) => scelte.length === 0 || scelte.includes(chiave(p.linea, p.categoria)))
    .filter((p) => !noSoldOut || p.stato !== "soldout")
    .filter((p) => (f.min === 0 || p.prezzo > f.min) && p.prezzo <= f.max)
    .sort((a, b) => {
      if (ordine === "prezzo-su") return a.prezzo - b.prezzo;
      if (ordine === "prezzo-giu") return b.prezzo - a.prezzo;
      if (ordine === "nome") return a.nome.localeCompare(b.nome, lang);
      // dalla data di uscita più recente; i prodotti senza data vanno in fondo, nell'ordine del foglio
      if (ordine === "uscita") return a.rilascio && b.rilascio ? b.rilascio.localeCompare(a.rilascio) : a.rilascio ? -1 : b.rilascio ? 1 : 0;
      return 0;
    });

  const nFiltri = (scelte.length ? 1 : 0) + (noSoldOut ? 1 : 0);
  const nOrdina = (ordine !== "consigliati" ? 1 : 0) + (fascia !== "tutte" ? 1 : 0);
  const linee = albero(prodotti);
  const cambia = (c: string) => setScelte((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));
  const cambiaLinea = (linea: string, categorie: string[]) => {
    const tutte = categorie.map((c) => chiave(linea, c));
    const piena = tutte.every((k) => scelte.includes(k));
    setScelte((s) => (piena ? s.filter((k) => !tutte.includes(k)) : [...new Set([...s, ...tutte])]));
  };
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
          {t.filtri.filtri}
          {nFiltri > 0 && <span className="tb-n">{nFiltri}</span>}
        </button>

        <span className="tb-count">{quanti(lista.length)}</span>

        <button
          type="button"
          className="tb-btn"
          aria-expanded={aperto === "ordina"}
          aria-controls="pannello-ordina"
          onClick={() => apri("ordina")}
        >
          <ArrowUpDown size={18} strokeWidth={2.2} />
          {t.filtri.ordinaPer}
          {nOrdina > 0 && <span className="tb-n">{nOrdina}</span>}
          <ChevronDown size={16} strokeWidth={2.4} />
        </button>

        {aperto && <div className="pop-sfondo" aria-hidden="true" onClick={() => setAperto(null)} />}

        {aperto === "filtri" && (
          <div className="pop pop--left" id="pannello-filtri" role="dialog" aria-label={t.filtri.filtri}>
            <fieldset>
              <legend>{t.filtri.categorie}</legend>
              <label className="opt">
                <input type="checkbox" checked={scelte.length === 0} onChange={() => setScelte([])} />
                {t.filtri.tutto}
              </label>
              {linee.map(({ linea, categorie }) => (
                <div className="linea" key={linea}>
                  {/* nella pagina di una sola linea (es. /catalogo/pokemon) basta l'elenco delle categorie */}
                  {linee.length > 1 && (
                    <label className="opt opt--linea">
                      <input
                        type="checkbox"
                        checked={categorie.every((c) => scelte.includes(chiave(linea, c)))}
                        onChange={() => cambiaLinea(linea, categorie)}
                      />
                      {linea}
                    </label>
                  )}
                  {categorie.map((c) => (
                    <label className={linee.length > 1 ? "opt opt--sub" : "opt"} key={c}>
                      <input type="checkbox" checked={scelte.includes(chiave(linea, c))} onChange={() => cambia(chiave(linea, c))} />
                      {nomeCategoria(lang, c)}
                    </label>
                  ))}
                </div>
              ))}
            </fieldset>
            <fieldset>
              <legend>{t.filtri.disponibilita}</legend>
              <label className="opt">
                <input type="checkbox" checked={noSoldOut} onChange={() => setNoSoldOut(!noSoldOut)} />
                {t.filtri.nascondiSoldOut}
              </label>
            </fieldset>
            <div className="pop-foot">
              <button type="button" className="link" onClick={azzeraFiltri}>
                {t.filtri.azzera}
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setAperto(null)}>
                {t.filtri.mostra(lista.length)}
              </button>
            </div>
          </div>
        )}

        {aperto === "ordina" && (
          <div className="pop pop--right" id="pannello-ordina" role="dialog" aria-label={t.filtri.ordinaPer}>
            <fieldset>
              <legend>{t.filtri.ordinaPer}</legend>
              {ordini.map((o) => (
                <label className="opt" key={o.id}>
                  <input type="radio" name="ordine" checked={ordine === o.id} onChange={() => setOrdine(o.id)} />
                  {t.filtri.ordini[o.id]}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>{t.filtri.fascia}</legend>
              {fasce.map((x) => (
                <label className="opt" key={x.id}>
                  <input type="radio" name="fascia" checked={fascia === x.id} onChange={() => setFascia(x.id)} />
                  {t.filtri.fasce[x.id]}
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
                {t.filtri.azzera}
              </button>
              <button type="button" className="btn btn--primary btn--sm" onClick={() => setAperto(null)}>
                {t.filtri.mostra(lista.length)}
              </button>
            </div>
          </div>
        )}
      </div>

      {lista.length > 0 ? (
        <div className="grid">
          {/* titolo solo per i lettori di schermo, così i titoli delle card non saltano un livello */}
          <h2 className="sr-only">{t.card.elenco}</h2>
          {lista.map((p) => (
            <ProductCard key={p.codice} p={p} />
          ))}
        </div>
      ) : (
        <div className="vuoto">
          <p>{t.filtri.nessuno}</p>
          <button type="button" className="btn btn--ghost btn--sm" onClick={azzeraTutto}>
            {t.filtri.azzeraFiltri}
          </button>
        </div>
      )}
    </>
  );
}
