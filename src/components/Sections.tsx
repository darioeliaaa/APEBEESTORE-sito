import Image from "next/image";
import Link from "next/link";
import { percorso, testi, type Lingua } from "@/i18n/testi";
import type { FotoBanner } from "@/lib/sheet";
import { linkWhatsApp } from "@/lib/whatsapp";
import { Banner } from "./Banner";
import { HoneycombCanvas } from "./HoneycombCanvas";

export function DemoBanner({ lang, dalFoglio }: { lang: Lingua; dalFoglio: boolean }) {
  const t = testi[lang].demo;
  return (
    <div className="demo">
      <div className="wrap">
        <span>{t.prova}</span>
        <span>{dalFoglio ? t.foglio : t.finti}</span>
      </div>
    </div>
  );
}

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

export function PageHead({ label, titolo, testo, stretto }: { label: string; titolo: string; testo?: string; stretto?: boolean }) {
  return (
    <section className="page-head">
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
        <a className="btn" href="https://chat.whatsapp.com/LF8noghO9bWJ9KwvwKApue" target="_blank" rel="noopener noreferrer">
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
          <h3>{t.footer.negozio}</h3>
          <ul>
            <li><Link href={p("/catalogo")}>{t.nav.catalogo}</Link></li>
            <li><Link href={p("/preordini")}>{t.nav.preordini}</Link></li>
            <li><Link href={p("/riscatti")}>{t.nav.riscatti}</Link></li>
          </ul>
        </div>
        <div>
          <h3>{t.footer.info}</h3>
          <ul>
            <li><Link href={p("/chi-siamo")}>{t.nav.chiSiamo}</Link></li>
            <li><Link href={`${p("/faq")}#come-ordinare`}>{t.nav.comeOrdinare}</Link></li>
            <li><Link href={p("/recensioni")}>{t.nav.recensioni}</Link></li>
            <li><Link href={p("/faq")}>{t.nav.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h3>{t.footer.contatti}</h3>
          <ul>
            <li><a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://chat.whatsapp.com/LF8noghO9bWJ9KwvwKApue" target="_blank" rel="noopener noreferrer">Community</a></li>
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
