import { PageHead, Passi } from "@/components/Sections";
import { faqEn, faqIt } from "@/i18n/faq";
import { testi, type Lingua } from "@/i18n/testi";

export function Faq({ lang }: { lang: Lingua }) {
  const t = testi[lang];
  const gruppi = lang === "en" ? faqEn : faqIt;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: gruppi.flatMap((g) =>
      g.domande.map((f) => ({
        "@type": "Question",
        name: f.domanda,
        acceptedAnswer: { "@type": "Answer", text: f.risposta },
      })),
    ),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHead label={t.faq.label} titolo={t.faq.titolo} stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="faq-group" id="come-ordinare">
            <h2>{t.faq.comeOrdinare}</h2>
            <Passi lista={t.passi} />
          </div>
          {gruppi.map((g) => (
            <div className="faq-group" key={g.id} id={g.id}>
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
          <p className="small-print">{t.faq.altro}</p>
        </div>
      </section>
    </>
  );
}
