import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { leggiCatalogo, perStato } from "@/lib/sheet";

export const metadata: Metadata = { title: "Preordini" };
export const revalidate = 300;

export default async function Preordini() {
  const preordini = perStato((await leggiCatalogo()).prodotti, "preordine");
  return (
    <>
      <PageHead label="Nuove uscite" titolo="Preordini" testo="Prenota le nuove uscite dal Giappone." />
      <section className="block block--top">
        <div className="wrap">
          <div className="notice">
            <strong>Si ordinano da soli.</strong>
            <span>Insieme puoi mettere solo preordini con la stessa data di uscita.</span>
          </div>
          {preordini.length > 0 ? (
            <div className="grid grid--3">
              {preordini.map((p) => (
                <ProductCard key={p.codice} p={p} />
              ))}
            </div>
          ) : (
            <p className="vuoto">Al momento non ci sono preordini aperti. Li annunciamo prima nella community.</p>
          )}
        </div>
      </section>
    </>
  );
}
