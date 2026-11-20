import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHead, Passi } from "@/components/Sections";
import { riscatti } from "@/data/demo";

export const metadata: Metadata = { title: "Riscatti app" };

const comeFunziona = [
  { titolo: "Scegli", testo: "Scegli il premio di questo mese." },
  { titolo: "Codice", testo: "Quando ordini inserisci il codice dell'app Beyblade X." },
  { titolo: "Ricevi", testo: "Ti mandiamo il premio a casa." },
];

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
        </div>
      </section>
      <section className="block raised">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Come funziona</span>
              <h2>Il riscatto</h2>
            </div>
          </div>
          <Passi lista={comeFunziona} />
        </div>
      </section>
    </>
  );
}
