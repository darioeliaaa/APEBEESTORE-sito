import Link from "next/link";
import { redirect } from "next/navigation";
import { CatalogoLista } from "@/components/CatalogoLista";
import { PageHead } from "@/components/Sections";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import { leggiCatalogo, lineeCatalogo, perStato, slugLinea } from "@/lib/sheet";

// /catalogo: si sceglie la linea (Beyblade X, Pokémon...). Ogni linea ha la sua pagina /catalogo/<linea>
export async function Catalogo({ lang }: { lang: Lingua }) {
  const t = testi[lang].catalogo;
  const linee = lineeCatalogo((await leggiCatalogo()).prodotti);
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.scegli} />
      <section className="block block--top">
        <div className="wrap">
          <div className="linee">
            {linee.map((l) => (
              <Link className="linea-card" key={l.slug} href={percorso(lang, `/catalogo/${l.slug}`)}>
                <span className={`linea-foto${l.foto ? "" : " linea-foto--vuota"}`}>
                  {l.foto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.foto} alt="" loading="lazy" referrerPolicy="no-referrer" />
                  ) : (
                    <span aria-hidden="true">{l.nome}</span>
                  )}
                </span>
                <span className="linea-testo">
                  <strong>{l.nome}</strong>
                  <span className="label">{testi[lang].filtri.quanti(l.quanti)}</span>
                </span>
                <span className="linea-freccia" aria-hidden="true">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// /catalogo/<linea>: solo i prodotti di quella linea, con i suoi filtri
export async function CatalogoLinea({ lang, slug }: { lang: Lingua; slug: string }) {
  const t = testi[lang].catalogo;
  const prodotti = perStato((await leggiCatalogo()).prodotti, "ordinazione", "soldout").filter((p) => slugLinea(p.linea) === slug);
  // una linea che non esiste (o non ha più prodotti): si torna alla scelta delle linee
  if (!prodotti.length) redirect(percorso(lang, "/catalogo"));
  const nome = prodotti[0].linea;
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <Link className="label torna" href={percorso(lang, "/catalogo")}>
            ← {t.tutteLeLinee}
          </Link>
          <h1>{nome}</h1>
          <p>{t.testo}</p>
        </div>
      </section>
      <section className="block block--top">
        <div className="wrap">
          <CatalogoLista prodotti={prodotti} />
        </div>
      </section>
    </>
  );
}

// per generare in anticipo le pagine delle linee che ci sono adesso (quelle nuove si creano alla prima visita)
export async function lineePerPagine() {
  return lineeCatalogo((await leggiCatalogo()).prodotti).map((l) => ({ linea: l.slug }));
}

export async function nomeDellaLinea(slug: string) {
  return lineeCatalogo((await leggiCatalogo()).prodotti).find((l) => l.slug === slug)?.nome;
}
