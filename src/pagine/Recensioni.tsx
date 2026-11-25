import Link from "next/link";
import { Star } from "lucide-react";
import { RecensioneFoto } from "@/components/RecensioneFoto";
import { ScriviRecensione } from "@/components/ScriviRecensione";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";
import { linkProdotto, slugCodice } from "@/lib/prodotto";
import { leggiCatalogo, leggiRecensioni } from "@/lib/sheet";

// Pagina Recensioni: in alto i link ai feedback su Instagram e nella community, poi il modulo
// per lasciarne una (con le stelle) e sotto tutte le recensioni della scheda RECENSIONI, dalla più recente.

const COMMUNITY = "https://chat.whatsapp.com/LF8noghO9bWJ9KwvwKApue";

function Stelle({ voto, etichetta }: { voto: number; etichetta: string }) {
  return (
    <span className="stelle" role="img" aria-label={etichetta}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={18} strokeWidth={1.8} className={n <= voto ? "piena" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}

export async function Recensioni({ lang }: { lang: Lingua }) {
  const t = testi[lang].recensioni;
  const [recensioni, catalogo] = await Promise.all([leggiRecensioni(), leggiCatalogo().catch(() => null)]);
  const prodotti = catalogo?.prodotti ?? [];

  return (
    <>
      {/* pagina tutta centrata: titolo, tasti, modulo e recensioni */}
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} centro />
      <section className="block block--top recensioni-pagina">
        <div className="wrap">
          {/* sopra ogni tasto lo screenshot di dove si trovano i feedback; tutta la scheda è il link */}
          <div className="recensioni-link">
            <a className="recensioni-fonte" href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/recensioni/instagram.jpg" alt={t.fotoInstagram} width={1000} height={1560} loading="lazy" />
              <span className="btn btn--ghost">{t.instagram}</span>
            </a>
            <a className="recensioni-fonte" href={COMMUNITY} target="_blank" rel="noopener noreferrer">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/recensioni/community.jpg" alt={t.fotoWhatsapp} width={674} height={1408} loading="lazy" />
              <span className="btn btn--ghost">{t.whatsapp}</span>
            </a>
          </div>

          <ScriviRecensione />

          <div className="recensioni-elenco">
            <h2>{t.lista}</h2>
            {recensioni.length > 0 ? (
              <ul className="recensioni">
                {recensioni.map((r, i) => {
                  // il codice del prodotto diventa il link alla sua pagina (se è ancora nel catalogo)
                  const p = r.prodotto ? prodotti.find((x) => slugCodice(x.codice) === slugCodice(r.prodotto!)) : undefined;
                  return (
                    <li className="recensione" key={i}>
                      {r.voto && <Stelle voto={r.voto} etichetta={t.stelle(r.voto)} />}
                      {r.foto && <RecensioneFoto src={r.foto} alt={t.screenshot(r.nome)} etichetta={t.apri} sola={!r.frase} />}
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
          </div>
        </div>
      </section>
    </>
  );
}
