import Image from "next/image";
import Link from "next/link";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import type { FotoBanner } from "@/lib/sheet";
import { COMMUNITY, linkWhatsApp } from "@/lib/whatsapp";
import { Banner } from "./Banner";
import { HoneycombCanvas } from "./HoneycombCanvas";

export function Hero({ lang, foto }: { lang: Lingua; foto: FotoBanner[] }) {
  const t = testi[lang].hero;
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-text">
          <span className="label">{t.label}</span>
          <h1>
            Bee ready <span className="hl">to spin.</span>
          </h1>
          <p className="lead">{t.lead}</p>
          <div className="ctas">
            <Link className="btn btn--primary" href={percorso(lang, "/catalogo")}>
              {t.catalogo}
            </Link>
            <Link className="btn btn--ghost" href={percorso(lang, "/preordini")}>
              {t.preordini}
            </Link>
          </div>
        </div>
        {/* le foto del banner arrivano dalla scheda BANNER del foglio; se non ce ne sono resta l'ape */}
        <Banner foto={foto}>
          <div className="hero-art">
            <HoneycombCanvas />
            <Image className="bee" src="/brand/icona.png" alt="" width={940} height={695} priority />
            <span className="tag">
              {t.tag} <b>{t.tempo}</b>
            </span>
          </div>
        </Banner>
      </div>
    </section>
  );
}

export function PageHead({ label, titolo, testo, stretto, centro }: { label: string; titolo: string; testo?: string; stretto?: boolean; centro?: boolean }) {
  return (
    <section className={centro ? "page-head page-head--centro" : "page-head"}>
      <div className={stretto ? "wrap narrow" : "wrap"}>
        <span className="label">{label}</span>
        <h1>{titolo}</h1>
        {testo && <p>{testo}</p>}
      </div>
    </section>
  );
}

export function Passi({ lista }: { lista: { titolo: string; testo: string }[] }) {
  return (
    <ol className="steps">
      {lista.map((s, i) => (
        <li className="step" key={s.titolo}>
          <span className="n">{i + 1}</span>
          <h3>{s.titolo}</h3>
          <p>{s.testo}</p>
        </li>
      ))}
    </ol>
  );
}

export function Community({ lang }: { lang: Lingua }) {
  const t = testi[lang].community;
  return (
    <section className="community" id="community">
      <div className="wrap">
        <div className="col">
          <span className="label">{t.label}</span>
          <h2>{t.titolo}</h2>
          <p>{t.testo}</p>
        </div>
        <a className="btn" href={COMMUNITY} target="_blank" rel="noopener noreferrer">
          {t.entra}
        </a>
      </div>
    </section>
  );
}

export function Footer({ lang }: { lang: Lingua }) {
  const t = testi[lang];
  const p = (href: string) => percorso(lang, href);
  return (
    <footer className="footer">
      <div className="stripe" aria-hidden="true" />
      <div className="wrap">
        <div className="brand">
          <Link className="logo" href={p("/")} aria-label="APEBEESTORE">
            <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} />
          </Link>
          <p className="tagline">Bee ready to spin.</p>
        </div>
        <div>
          <h2>{t.footer.negozio}</h2>
          <ul>
            <li><Link href={p("/catalogo")}>{t.nav.catalogo}</Link></li>
            <li><Link href={p("/preordini")}>{t.nav.preordini}</Link></li>
            <li><Link href={p("/riscatti")}>{t.nav.riscatti}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{t.footer.info}</h2>
          <ul>
            <li><Link href={p("/chi-siamo")}>{t.nav.chiSiamo}</Link></li>
            <li><Link href={`${p("/faq")}#come-ordinare`}>{t.nav.comeOrdinare}</Link></li>
            <li><Link href={p("/recensioni")}>{t.nav.recensioni}</Link></li>
            <li><Link href={p("/faq")}>{t.nav.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h2>{t.footer.contatti}</h2>
          <ul>
            <li><a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href={COMMUNITY} target="_blank" rel="noopener noreferrer">Community</a></li>
          </ul>
        </div>
        <div className="legal">
          <span>{t.footer.legale}</span>
          <span>
            <Link href={p("/condizioni-di-vendita")}>{t.titoli.condizioni}</Link> · <Link href={p("/privacy")}>{t.titoli.privacy}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

// tasto rotondo fisso in basso a destra, in tutte le pagine: porta al gruppo della community WhatsApp
// (l'icona di WhatsApp è l'unica icona piena del sito; colori del brand, niente verde)
export function TastoCommunity({ lang }: { lang: Lingua }) {
  const t = testi[lang].community;
  return (
    <a className="tasto-community" href={COMMUNITY} target="_blank" rel="noopener noreferrer" aria-label={t.fisso} title={t.fisso}>
      <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    </a>
  );
}
