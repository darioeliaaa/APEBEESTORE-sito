import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/Sections";
import { faq } from "@/data/demo";

export const metadata: Metadata = { title: "FAQ" };

export default function Faq() {
  return (
    <>
      <PageHead label="Domande frequenti" titolo="FAQ" />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="faq faq--one">
            {faq.map((f) => (
              <details key={f.domanda}>
                <summary>{f.domanda}</summary>
                <p>{f.risposta}</p>
              </details>
            ))}
          </div>
          <p className="small-print">
            Non trovi la risposta? Scrivici su WhatsApp. Oppure guarda <Link href="/come-ordinare">come ordinare</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
