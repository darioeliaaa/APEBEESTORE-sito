import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { preordini } from "@/data/demo";

export const metadata: Metadata = { title: "Preordini" };

export default function Preordini() {
  return (
    <>
      <PageHead label="Nuove uscite" titolo="Preordini" testo="Prenota le nuove uscite dal Giappone." />
      <section className="block block--top">
        <div className="wrap">
          <div className="notice">
            <strong>Si ordinano da soli.</strong>
            <span>Insieme puoi mettere solo preordini con la stessa data di uscita.</span>
          </div>
          <div className="grid grid--3">
            {preordini.map((p) => (
              <ProductCard key={p.codice} p={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
