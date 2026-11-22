import type { Metadata } from "next";
import { PageHead } from "@/components/Sections";

export const metadata: Metadata = { title: "Recensioni" };

export default function Recensioni() {
  return (
    <>
      <PageHead label="I nostri clienti" titolo="Recensioni" testo="Alcuni messaggi di chi ha già ordinato da noi." />
      <section className="block block--top">
        <div className="wrap">
          <div className="shots">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div className="shot" key={n}>
                Recensione
              </div>
            ))}
          </div>
          <div>
            <a className="btn btn--ghost" href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
              Altre su Instagram
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
