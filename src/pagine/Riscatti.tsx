import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import { leggiCatalogo, perStato } from "@/lib/sheet";

export async function Riscatti({ lang }: { lang: Lingua }) {
  const t = testi[lang].riscatti;
  const riscatti = perStato((await leggiCatalogo()).prodotti, "riscatto");
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          <div className="notice">
            <strong>{t.avvisoTitolo}</strong>
            <span>{t.avviso}</span>
          </div>
          {riscatti.length > 0 ? (
            <div className="grid grid--3">
              <h2 className="sr-only">{testi[lang].card.elenco}</h2>
              {riscatti.map((p) => (
                <ProductCard key={p.codice} p={p} />
              ))}
            </div>
          ) : (
            <p className="vuoto">{t.vuoto}</p>
          )}
          <Link className="info-link" href={`${percorso(lang, "/faq")}#riscatti-app`}>
            <span>
              <strong>{t.comeTitolo}</strong>
              {t.come}
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
