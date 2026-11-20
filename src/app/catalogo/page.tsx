import type { Metadata } from "next";
import { CatalogoLista } from "@/components/CatalogoLista";
import { PageHead } from "@/components/Sections";
import { catalogo } from "@/data/demo";

export const metadata: Metadata = { title: "Catalogo" };

export default function Catalogo() {
  return (
    <>
      <PageHead label="Su ordinazione · 3–4 settimane" titolo="Catalogo" testo="Spedizione e dogana incluse in tutti i prezzi." />
      <section className="block block--top">
        <div className="wrap">
          <CatalogoLista prodotti={catalogo} />
        </div>
      </section>
    </>
  );
}
