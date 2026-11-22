import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { leggiCatalogo, perStato } from "@/lib/sheet";

export const metadata: Metadata = { title: "Riscatti app" };
export const revalidate = 300;

export default async function Riscatti() {
  const riscatti = perStato((await leggiCatalogo()).prodotti, "riscatto");
  return (
    <>
      <PageHead
        label="Cambiano ogni mese"
        titolo="Riscatti app"
        testo="I premi da riscattare con il codice dell'app Beyblade X."
      />
      <section className="block block--top">
        <div className="wrap">
          <div className="notice">
            <strong>Si ordinano da soli.</strong>
            <span>Non si possono unire ad altri prodotti o preordini.</span>
          </div>
          {riscatti.length > 0 ? (
            <div className="grid grid--3">
              {riscatti.map((p) => (
                <ProductCard key={p.codice} p={p} />
              ))}
            </div>
          ) : (
            <p className="vuoto">I premi di questo mese arrivano a breve.</p>
          )}
          <Link className="info-link" href="/faq#riscatti-app">
            <span>
              <strong>Come funziona il riscatto</strong>
              Scegli il premio, inserisci il codice dell&apos;app quando ordini, ti arriva a casa.
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
