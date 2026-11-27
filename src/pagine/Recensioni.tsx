import { RecensioneCard } from "@/components/RecensioneCard";
import { ScriviRecensione } from "@/components/ScriviRecensione";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";
import { leggiCatalogo, leggiRecensioni } from "@/lib/sheet";
import { COMMUNITY } from "@/lib/whatsapp";

// Pagina Recensioni: in alto i link ai feedback su Instagram e nella community, poi il modulo
// per lasciarne una (con le stelle) e sotto tutte le recensioni della scheda RECENSIONI, dalla più recente.

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
                {recensioni.map((r, i) => (
                  <RecensioneCard key={i} r={r} lang={lang} prodotti={prodotti} />
                ))}
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
