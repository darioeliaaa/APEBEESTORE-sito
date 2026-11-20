import type { Metadata } from "next";
import { PageHead, RiscattoBox } from "@/components/Sections";
import { faq } from "@/data/demo";

export const metadata: Metadata = { title: "Riscatto codici" };

export default function Riscatto() {
  const domanda = faq.find((f) => f.domanda.includes("riscatto"));
  return (
    <>
      <PageHead label="Codici premio" titolo="Riscatto codici" testo="Le confezioni giapponesi hanno dei codici premio. Li riscattiamo noi per te." />
      <RiscattoBox />
      {domanda && (
        <section className="block">
          <div className="wrap narrow">
            <div className="faq faq--one">
              <details open>
                <summary>{domanda.domanda}</summary>
                <p>{domanda.risposta}</p>
              </details>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
