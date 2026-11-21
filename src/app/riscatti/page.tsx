import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { riscatti } from "@/data/demo";

export const metadata: Metadata = { title: "Riscatti app" };

export default function Riscatti() {
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
          <div className="grid grid--3">
            {riscatti.map((p) => (
              <ProductCard key={p.codice} p={p} />
            ))}
          </div>
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
