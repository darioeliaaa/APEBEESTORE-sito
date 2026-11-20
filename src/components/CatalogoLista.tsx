"use client";

import { useState } from "react";
import type { Prodotto } from "@/data/demo";
import { ProductCard } from "./ProductCard";

const categorie = ["Tutti", "Beyblade", "Arene", "Accessori"] as const;

export function CatalogoLista({ prodotti }: { prodotti: Prodotto[] }) {
  const [filtro, setFiltro] = useState<(typeof categorie)[number]>("Tutti");
  const lista = filtro === "Tutti" ? prodotti : prodotti.filter((p) => p.categoria === filtro);

  return (
    <>
      <div className="chips" role="group" aria-label="Filtra per categoria">
        {categorie.map((c) => (
          <button key={c} type="button" className="chip" aria-pressed={filtro === c} onClick={() => setFiltro(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid">
        {lista.map((p) => (
          <ProductCard key={p.codice} p={p} />
        ))}
      </div>
    </>
  );
}
