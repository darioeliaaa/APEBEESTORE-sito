import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Community, Hero } from "@/components/Sections";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import { leggiBanner, leggiCatalogo, perStato } from "@/lib/sheet";

export async function Home({ lang }: { lang: Lingua }) {
  const t = testi[lang].home;
  const [catalogo, foto] = await Promise.all([leggiCatalogo(), leggiBanner()]);
  const inEvidenza = perStato(catalogo.prodotti, "ordinazione").slice(0, 4);
  return (
    <>
      <Hero lang={lang} foto={foto} />

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
              <ProductCard key={p.codice} p={p} />
            ))}
          </div>
        </div>
      </section>

      <Community lang={lang} />
    </>
  );
}
