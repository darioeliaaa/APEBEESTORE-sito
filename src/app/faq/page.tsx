import type { Metadata } from "next";
import { PageHead, Passi, passi } from "@/components/Sections";
import { faq } from "@/data/demo";

export const metadata: Metadata = {
  title: { absolute: "FAQ – APEBEESTORE | Ordini, spedizioni e preordini Beyblade X" },
  description:
    "Tempi di consegna, costi di spedizione, preordini e pagamenti: tutte le risposte su come acquistare Beyblade X Takara Tomy originali su APEBEESTORE.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.flatMap((g) =>
    g.domande.map((f) => ({
      "@type": "Question",
      name: f.domanda,
      acceptedAnswer: { "@type": "Answer", text: f.risposta },
    })),
  ),
};

const id = (testo: string) => testo.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function Faq() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead label="Domande frequenti" titolo="FAQ" stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="faq-group" id="come-ordinare">
            <h2>Come ordinare</h2>
            <Passi lista={passi} />
          </div>
          {faq.map((g) => (
            <div className="faq-group" key={g.gruppo} id={id(g.gruppo)}>
              <h2>{g.gruppo}</h2>
              <div className="faq faq--one">
                {g.domande.map((f) => (
                  <details key={f.domanda}>
                    <summary>{f.domanda}</summary>
                    <p>{f.risposta}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
          <p className="small-print">Non trovi la risposta? Scrivici su WhatsApp.</p>
        </div>
      </section>
    </>
  );
}
