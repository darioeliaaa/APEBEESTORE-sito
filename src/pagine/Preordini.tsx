import { ProductCard } from "@/components/ProductCard";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";
import { leggiCatalogo, perStato } from "@/lib/sheet";
import { perCard } from "@/lib/prodotto";

export async function Preordini({ lang }: { lang: Lingua }) {
  const t = testi[lang].preordini;
  const preordini = perStato((await leggiCatalogo()).prodotti, "preordine");
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          <div className="notice">
            <strong>{t.avvisoTitolo}</strong>
            <span>{t.avviso}</span>
          </div>
          {preordini.length > 0 ? (
            <div className="grid grid--3">
              <h2 className="sr-only">{testi[lang].card.elenco}</h2>
              {preordini.map((p) => (
                <ProductCard key={p.codice} p={perCard(p)} />
              ))}
            </div>
          ) : (
            <p className="vuoto">{t.vuoto}</p>
          )}
        </div>
      </section>
    </>
  );
}
