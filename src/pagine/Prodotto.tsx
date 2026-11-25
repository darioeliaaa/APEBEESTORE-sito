import type { Metadata } from "next";
import Link from "next/link";
import { Acquisto } from "@/components/Acquisto";
import { Galleria } from "@/components/Galleria";
import { ProductCard } from "@/components/ProductCard";
import type { Prodotto } from "@/data/demo";
import { nomeCategoria, percorso, testi, type Lingua } from "@/i18n/testi";
import { euro, giorno } from "@/lib/format";
import { classiStato, slugCodice } from "@/lib/prodotto";
import { leggiCatalogo, slugLinea } from "@/lib/sheet";
import { metaPagina } from "./meta";

// /prodotto/<codice>: la scheda di un prodotto (catalogo, preordini e premi dei riscatti)

async function trova(slug: string) {
  const { prodotti } = await leggiCatalogo();
  return { prodotti, p: prodotti.find((x) => slugCodice(x.codice) === slug) };
}

const beyblade = (p: Prodotto) => slugLinea(p.linea) === "beyblade-x";

// "BX-46 Stadium Infinity" (se nel foglio il nome manca resta solo il codice)
const titolo = (p: Prodotto) => (p.nome === p.codice ? p.codice : `${p.codice} ${p.nome}`);

// per Google e per l'anteprima dei link: "Beyblade X BX-46 Stadium Infinity – Takara Tomy"
const nomeCompleto = (p: Prodotto) => (beyblade(p) ? `Beyblade X ${titolo(p)} – Takara Tomy` : `${p.linea} ${titolo(p)}`);

// prima quelli della stessa categoria, poi il resto della linea; i sold out mai
function correlati(prodotti: Prodotto[], p: Prodotto) {
  const stato = p.stato === "soldout" ? "ordinazione" : p.stato;
  const simili = prodotti.filter((x) => x.codice !== p.codice && x.stato === stato && (stato !== "ordinazione" || x.linea === p.linea));
  return [...simili.filter((x) => x.categoria === p.categoria), ...simili.filter((x) => x.categoria !== p.categoria)].slice(0, 4);
}

// dove si torna: la linea del catalogo, oppure Preordini / Riscatti app
function indietro(lang: Lingua, p: Prodotto) {
  const nav = testi[lang].nav;
  if (p.stato === "preordine") return { href: percorso(lang, "/preordini"), testo: nav.preordini };
  if (p.stato === "riscatto") return { href: percorso(lang, "/riscatti"), testo: nav.riscatti };
  return { href: percorso(lang, `/catalogo/${slugLinea(p.linea)}`), testo: p.linea };
}

export async function prodottiPerPagine() {
  return (await leggiCatalogo()).prodotti.map((p) => ({ codice: slugCodice(p.codice) }));
}

export async function metaProdotto(lang: Lingua, slug: string): Promise<Metadata> {
  const t = testi[lang].prodotto;
  const { p } = await trova(slug);
  if (!p) return { title: t.nonCeTitolo, robots: { index: false, follow: false } };
  const nome = nomeCompleto(p);
  const descrizione = t.meta(nome, euro(p.prezzo, lang));
  const immagini = p.immagine ? [{ url: p.immagine, alt: nome }] : undefined;
  return {
    ...metaPagina(lang, `/prodotto/${slug}`, nome, descrizione),
    // senza foto resta l'immagine del brand
    ...(immagini
      ? {
          openGraph: { type: "website", siteName: "APEBEESTORE", locale: testi[lang].meta.locale, title: nome, description: descrizione, images: immagini },
          twitter: { card: "summary_large_image", images: [p.immagine!] },
        }
      : {}),
  };
}

export async function ProdottoPagina({ lang, slug }: { lang: Lingua; slug: string }) {
  const t = testi[lang];
  const { prodotti, p } = await trova(slug);
  if (!p) return <NonCe lang={lang} />;

  const pre = p.stato === "preordine";
  const ris = p.stato === "riscatto";
  const sold = p.stato === "soldout";
  const torna = indietro(lang, p);
  const altri = correlati(prodotti, p);
  const foto = p.foto ?? (p.immagine ? [p.immagine] : []);
  const descrizione = lang === "en" ? p.descrizione?.en ?? p.descrizione?.it : p.descrizione?.it ?? p.descrizione?.en;

  // dati per Google: nome, foto, prezzo e disponibilità
  const disponibilita = { ordinazione: "BackOrder", preordine: "PreOrder", riscatto: "InStock", soldout: "SoldOut" }[p.stato];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: nomeCompleto(p),
    sku: p.codice,
    ...(foto.length ? { image: foto } : {}),
    ...(beyblade(p) ? { brand: { "@type": "Brand", name: "Takara Tomy" } } : {}),
    category: nomeCategoria(lang, p.categoria),
    ...(descrizione ? { description: descrizione } : {}),
    offers: { "@type": "Offer", price: p.prezzo.toFixed(2), priceCurrency: "EUR", availability: `https://schema.org/${disponibilita}` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="block block--top prodotto-blocco">
        <div className="wrap">
          <Link className="label torna" href={torna.href}>
            ← {torna.testo}
          </Link>
          <div className={`prodotto${sold ? " sold" : ""}`}>
            <Galleria foto={foto} nome={titolo(p)} codice={p.codice} />
            <div className="prodotto-info">
              <span className={`badge ${classiStato[p.stato]}`}>{t.stati[p.stato]}</span>
              <span className="label">{beyblade(p) ? "Beyblade X · Takara Tomy" : p.linea}</span>
              <h1>{titolo(p)}</h1>
              {pre && <span className="uscita">{p.uscita ? t.card.esce(giorno(p.uscita, lang)) : t.card.daConfermare}</span>}
              <span className="price">{euro(p.prezzo, lang)}</span>
              <ul className="prodotto-note">
                {sold ? (
                  <li>{t.prodotto.soldoutTesto}</li>
                ) : (
                  <>
                    <li>{t.prodotto.incluso}</li>
                    {ris ? <li>{t.card.codiceApp}</li> : <li>{pre ? t.prodotto.arrivoPreordine : t.prodotto.arrivo}</li>}
                  </>
                )}
                <li>{beyblade(p) ? t.prodotto.originaleTT : t.prodotto.originale}</li>
              </ul>
              <Acquisto p={p} />
              {descrizione && (
                <div className="prodotto-testo">
                  <h2>{t.prodotto.descrizione}</h2>
                  {descrizione.split(/\n+/).map((riga, i) => (
                    <p key={i}>{riga}</p>
                  ))}
                </div>
              )}
              <dl className="prodotto-dettagli">
                <div>
                  <dt>{t.prodotto.codice}</dt>
                  <dd>{p.codice}</dd>
                </div>
                <div>
                  <dt>{t.prodotto.linea}</dt>
                  <dd>{p.linea}</dd>
                </div>
                <div>
                  <dt>{t.prodotto.categoria}</dt>
                  <dd>{nomeCategoria(lang, p.categoria)}</dd>
                </div>
                <div>
                  <dt>{t.prodotto.stato}</dt>
                  <dd>{t.stati[p.stato]}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
      {altri.length > 0 && (
        <section className="block raised">
          <div className="wrap">
            <div className="sec-head">
              <h2>{t.prodotto.correlati}</h2>
            </div>
            <div className="grid">
              {altri.map((x) => (
                <ProductCard key={x.codice} p={x} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// link vecchio o prodotto tolto dal foglio: niente errore tecnico, una pagina normale
function NonCe({ lang }: { lang: Lingua }) {
  const t = testi[lang];
  return (
    <section className="page-head">
      <div className="wrap narrow">
        <span className="label">404</span>
        <h1>{t.prodotto.nonCeTitolo}</h1>
        <p>{t.prodotto.nonCeTesto}</p>
        <div className="ctas">
          <Link className="btn btn--primary" href={percorso(lang, "/catalogo")}>
            {t.ordine.vaiCatalogo}
          </Link>
          <Link className="btn btn--ghost" href={percorso(lang, "/")}>
            Home
          </Link>
        </div>
      </div>
    </section>
  );
}
