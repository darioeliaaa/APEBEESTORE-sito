import Link from "next/link";
import { PageHead } from "@/components/Sections";
import { percorso, testi, type Lingua } from "@/i18n/testi";

export function NonTrovata({ lang }: { lang: Lingua }) {
  const t = testi[lang].nonTrovata;
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="ctas">
            <Link className="btn btn--primary" href={percorso(lang, "/catalogo")}>
              {t.catalogo}
            </Link>
            <Link className="btn btn--ghost" href={percorso(lang, "/")}>
              {t.home}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// la 404 per gli indirizzi che non esistono: non sappiamo in che lingua stava navigando, quindi è in tutte e due
export function NonTrovataDoppia() {
  const it = testi.it.nonTrovata;
  const en = testi.en.nonTrovata;
  return (
    <>
      <PageHead label={it.label} titolo={it.titolo} testo={it.testo} stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="ctas">
            <Link className="btn btn--primary" href="/catalogo">
              {it.catalogo}
            </Link>
            <Link className="btn btn--ghost" href="/">
              {it.home}
            </Link>
          </div>
          <div className="nontrovata-en" lang="en">
            <strong>{en.titolo}</strong>
            <span>{en.testo}</span>
            <Link className="link" href="/en">
              {en.home}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
