import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { RecensioneCard } from "@/components/RecensioneCard";
import { Community, Hero } from "@/components/Sections";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import { leggiBanner, leggiCatalogo, leggiRecensioni, perStato } from "@/lib/sheet";
import { ORGANIZZAZIONE, SITO } from "./meta";
import { perCard } from "@/lib/prodotto";

// per Google: il nome del sito e chi lo gestisce
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [{ "@type": "WebSite", name: "APEBEESTORE", url: SITO, inLanguage: ["it", "en"] }, ORGANIZZAZIONE],
};

// Home: banner, prodotti in evidenza, preordini aperti, ultime recensioni, community.
// In evidenza vanno i prodotti con la spunta nella colonna "In evidenza" del foglio, nell'ordine del foglio.
// Se nessuno ha la spunta (o la colonna non c'è) vanno i primi 4 su ordinazione.

export async function Home({ lang }: { lang: Lingua }) {
  const t = testi[lang].home;
  const [catalogo, foto, recensioni] = await Promise.all([leggiCatalogo(), leggiBanner(), leggiRecensioni().catch(() => [])]);
  // se la scheda RECENSIONI non si legge, in home sparisce solo la fila delle recensioni
  const ordinabili = perStato(catalogo.prodotti, "ordinazione");
  const scelti = ordinabili.filter((p) => p.evidenza);
  const inEvidenza = scelti.length ? scelti.slice(0, 8) : ordinabili.slice(0, 4);
  // preordini: prima quelli con la spunta, poi gli altri; la fila sparisce se non ce ne sono
  const preordini = perStato(catalogo.prodotti, "preordine")
    .sort((a, b) => Number(!!b.evidenza) - Number(!!a.evidenza))
    .slice(0, 4);
  // le 3 più recenti, meglio se hanno il testo scritto
  const ultime = [...recensioni.filter((r) => r.frase), ...recensioni.filter((r) => !r.frase)].slice(0, 3);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero lang={lang} foto={foto} />

      {inEvidenza.length > 0 && (
        <section className="block raised">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="label">{t.label}</span>
                <h2>{t.titolo}</h2>
              </div>
              <Link className="more" href={percorso(lang, "/catalogo")}>
                {t.tutto}
              </Link>
            </div>
            <div className="grid">
              {inEvidenza.map((p) => (
                <ProductCard key={p.codice} p={perCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {preordini.length > 0 && (
        <section className="block">
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="label">{t.preordiniLabel}</span>
                <h2>{t.preordiniTitolo}</h2>
              </div>
              <Link className="more" href={percorso(lang, "/preordini")}>
                {t.preordiniTutti}
              </Link>
            </div>
            <div className="grid">
              {preordini.map((p) => (
                <ProductCard key={p.codice} p={perCard(p)} />
              ))}
            </div>
          </div>
        </section>
      )}

      {ultime.length > 0 && (
        // sfondo alternato: chiaro se sopra ci sono i preordini, altrimenti normale
        <section className={preordini.length > 0 ? "block raised" : "block"}>
          <div className="wrap">
            <div className="sec-head">
              <div>
                <span className="label">{t.recensioniLabel}</span>
                <h2>{t.recensioniTitolo}</h2>
              </div>
              <Link className="more" href={percorso(lang, "/recensioni")}>
                {t.recensioniTutte}
              </Link>
            </div>
            <ul className="recensioni recensioni--home">
              {ultime.map((r, i) => (
                <RecensioneCard key={i} r={r} lang={lang} prodotti={catalogo.prodotti} />
              ))}
            </ul>
          </div>
        </section>
      )}

      <Community lang={lang} />
    </>
  );
}
