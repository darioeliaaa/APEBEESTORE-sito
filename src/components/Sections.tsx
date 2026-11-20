import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HoneycombCanvas } from "./HoneycombCanvas";

export function DemoBanner() {
  return (
    <div className="demo">
      <div className="wrap">
        <span>Versione di prova</span>
        <span>Prodotti e prezzi non reali</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-text">
          <span className="label">Beyblade X originali Takara Tomy</span>
          <h1>
            Bee ready <span className="hl">to spin.</span>
          </h1>
          <p className="lead">Beyblade X originali dal Giappone. Spedizione e dogana incluse nel prezzo.</p>
          <div className="ctas">
            <Link className="btn btn--primary" href="/catalogo">
              Vai al catalogo
            </Link>
            <Link className="btn btn--ghost" href="/preordini">
              Preordini
            </Link>
          </div>
        </div>
        <div className="hero-art">
          <HoneycombCanvas />
          <Image className="bee" src="/brand/icona.png" alt="" width={940} height={695} priority />
          <span className="tag">
            Dal Giappone in <b>3–4 settimane</b>
          </span>
        </div>
      </div>
    </section>
  );
}

export function PageHead({ label, titolo, testo }: { label: string; titolo: string; testo?: string }) {
  return (
    <section className="page-head">
      <div className="wrap">
        <span className="label">{label}</span>
        <h1>{titolo}</h1>
        {testo && <p>{testo}</p>}
      </div>
    </section>
  );
}

export function Tile({ href, label, titolo, testo }: { href: string; label: string; titolo: string; testo: string }) {
  return (
    <Link className="tile" href={href}>
      <span className="label">{label}</span>
      <h3>{titolo}</h3>
      <p>{testo}</p>
      <ArrowRight className="arrow" size={28} strokeWidth={2.5} aria-hidden="true" />
    </Link>
  );
}

export const passi = [
  { titolo: "Scegli", testo: "Metti nel carrello quello che vuoi." },
  { titolo: "Ordina", testo: "Inserisci i tuoi dati. L'ordine arriva su WhatsApp." },
  { titolo: "Paga", testo: "Su WhatsApp con PayPal, Revolut o bonifico." },
  { titolo: "Ricevi", testo: "In 3–4 settimane a casa, o a mano a Milano, Como e Varese." },
];

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

export function Community() {
  return (
    <section className="community" id="community">
      <div className="wrap">
        <div className="col">
          <span className="label">Community WhatsApp</span>
          <h2>Entra nella community</h2>
          <p>Più di 200 blader. Nuove uscite, preordini e tornei li annunciamo prima lì.</p>
        </div>
        <a className="btn" href="#">
          Entra
        </a>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="stripe" aria-hidden="true" />
      <div className="wrap">
        <div className="brand">
          <Link className="logo" href="/" aria-label="APEBEESTORE">
            <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} />
          </Link>
          <p className="tagline">Bee ready to spin.</p>
        </div>
        <div>
          <h3>Negozio</h3>
          <ul>
            <li><Link href="/catalogo">Catalogo</Link></li>
            <li><Link href="/preordini">Preordini</Link></li>
            <li><Link href="/riscatti">Riscatti app</Link></li>
          </ul>
        </div>
        <div>
          <h3>Info</h3>
          <ul>
            <li><Link href="/come-ordinare">Come ordinare</Link></li>
            <li><Link href="/recensioni">Recensioni</Link></li>
            <li><Link href="/faq">FAQ</Link></li>
          </ul>
        </div>
        <div>
          <h3>Contatti</h3>
          <ul>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/apebeestore/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>
        <div className="legal">
          <span>Ragione sociale · Sede · P.IVA · Email</span>
          <span>Condizioni di vendita · Privacy</span>
        </div>
      </div>
    </footer>
  );
}
