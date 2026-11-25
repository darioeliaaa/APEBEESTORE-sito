import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";

export function Recensioni({ lang }: { lang: Lingua }) {
  const t = testi[lang].recensioni;
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          <div className="shots">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div className="shot" key={n}>
                {t.segnaposto}
              </div>
            ))}
          </div>
          <div>
            <a className="btn btn--ghost" href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
              {t.instagram}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
