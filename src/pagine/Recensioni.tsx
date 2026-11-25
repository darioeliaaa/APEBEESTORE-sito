import Link from "next/link";
import { RecensioneFoto } from "@/components/RecensioneFoto";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";
import { linkProdotto, slugCodice } from "@/lib/prodotto";
import { leggiCatalogo, leggiRecensioni } from "@/lib/sheet";

// le recensioni arrivano dalla scheda RECENSIONI del foglio, dalla più recente
export async function Recensioni({ lang }: { lang: Lingua }) {
  const t = testi[lang].recensioni;
  const [recensioni, catalogo] = await Promise.all([leggiRecensioni(), leggiCatalogo().catch(() => null)]);
  const prodotti = catalogo?.prodotti ?? [];

  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          {recensioni.length > 0 ? (
            <ul className="recensioni">
              {recensioni.map((r, i) => {
                // il codice del prodotto diventa il link alla sua pagina (se è ancora nel catalogo)
                const p = r.prodotto ? prodotti.find((x) => slugCodice(x.codice) === slugCodice(r.prodotto!)) : undefined;
                return (
                  <li className="recensione" key={i}>
                    {r.foto && <RecensioneFoto src={r.foto} alt={t.screenshot(r.nome)} etichetta={t.apri} />}
                    {r.frase && (
                      <blockquote>
                        <p>“{r.frase}”</p>
                      </blockquote>
                    )}
                    {(r.nome || r.citta) && (
                      <p className="recensione-chi">
                        {r.nome && <strong>{r.nome}</strong>}
                        {r.nome && r.citta && " · "}
                        {r.citta}
                      </p>
                    )}
                    {r.prodotto &&
                      (p ? (
                        <Link className="label recensione-prodotto" href={linkProdotto(lang, p.codice)}>
                          {p.codice} {p.nome !== p.codice ? p.nome : ""}
                        </Link>
                      ) : (
                        <span className="label recensione-prodotto">{r.prodotto}</span>
                      ))}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="vuoto">{t.vuoto}</p>
          )}
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
