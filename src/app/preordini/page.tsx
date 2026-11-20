import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { PageHead, Passi } from "@/components/Sections";
import { preordini } from "@/data/demo";

export const metadata: Metadata = { title: "Preordini" };

const comeFunziona = [
  { titolo: "Ordina", testo: "I preordini si ordinano da soli, senza altri prodotti." },
  { titolo: "Acconto", testo: "Paghi il 40% subito su WhatsApp." },
  { titolo: "Saldo", testo: "Paghi il resto quando il prodotto arriva." },
];

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
      <section className="block raised">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Come funziona</span>
              <h2>Il preordine</h2>
            </div>
          </div>
          <Passi lista={comeFunziona} />
        </div>
      </section>
    </>
  );
}
