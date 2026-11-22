import type { Metadata } from "next";
import { CatalogoLista } from "@/components/CatalogoLista";
import { PageHead } from "@/components/Sections";
import { leggiCatalogo, perStato } from "@/lib/sheet";

export const metadata: Metadata = { title: "Catalogo" };
export const revalidate = 300;

export default async function Catalogo() {
  const { prodotti } = await leggiCatalogo();
  return (
    <>
      <PageHead label="Su ordinazione · 3–4 settimane" titolo="Catalogo" testo="Spedizione e dogana incluse in tutti i prezzi." />
      <section className="block block--top">
        <div className="wrap">
          <CatalogoLista prodotti={perStato(prodotti, "ordinazione", "soldout")} />
        </div>
      </section>
    </>
  );
}
