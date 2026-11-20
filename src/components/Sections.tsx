import Image from "next/image";
import { RISCATTO_CODICE, faq, inEvidenza, preordini } from "@/data/demo";
import { euro } from "@/lib/format";
import { HoneycombCanvas } from "./HoneycombCanvas";
import { ProductCard } from "./ProductCard";

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
          <p className="lead">
            Beyblade X originali dal Giappone. <b>Spedizione e dogana incluse nel prezzo.</b> Arrivano in 3–4 settimane.
          </p>
          <div className="ctas">
            <a className="btn btn--primary" href="#catalogo">
              Vai al catalogo
            </a>
            <a className="btn btn--ghost" href="#preordini">
              Preordini
            </a>
          </div>
          <div className="facts">
            <div>
              <strong>900+</strong>
              <span className="label">Pezzi venduti</span>
            </div>
            <div>
              <strong>200+</strong>
              <span className="label">Blader nella community</span>
            </div>
            <div>
              <strong>100%</strong>
              <span className="label">Originali</span>
            </div>
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

export function Preordini() {
  return (
    <section className="block" id="preordini">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">Nuove uscite</span>
            <h2>Preordini</h2>
            <p>Prenota le nuove uscite dal Giappone.</p>
          </div>
          <a className="more" href="#">
            Vedi tutti
          </a>
        </div>
        <div className="notice">
          <strong>I preordini si ordinano da soli.</strong>
          <span>Non si possono unire ad altri prodotti. Acconto del 40%.</span>
        </div>
        <div className="grid grid--3">
          {preordini.map((p) => (
            <ProductCard key={p.codice} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function InEvidenza() {
  return (
    <section className="block" id="catalogo">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">Su ordinazione · 3–4 settimane</span>
            <h2>In evidenza</h2>
          </div>
          <a className="more" href="#">
            Vedi tutto
          </a>
        </div>
        <div className="grid">
          {inEvidenza.map((p) => (
            <ProductCard key={p.codice} p={p} />
          ))}
        </div>
        <p className="small-print">Spedizione e dogana incluse in tutti i prezzi.</p>
      </div>
    </section>
  );
}

const passi = [
  { titolo: "Scegli", testo: "Metti nel carrello quello che vuoi." },
  { titolo: "Ordina", testo: "Inserisci i tuoi dati. L'ordine arriva su WhatsApp." },
  { titolo: "Paga", testo: "Su WhatsApp con PayPal, Revolut o bonifico." },
  { titolo: "Ricevi", testo: "In 3–4 settimane a casa, o a mano a Milano, Como e Varese." },
];

export function ComeSiOrdina() {
  return (
    <section className="block raised">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">Come funziona</span>
            <h2>Come ordinare</h2>
          </div>
        </div>
        <ol className="steps">
          {passi.map((s, i) => (
            <li className="step" key={s.titolo}>
              <span className="n">{i + 1}</span>
              <h3>{s.titolo}</h3>
              <p>{s.testo}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Riscatto() {
  return (
    <section className="redeem" id="riscatto">
      <div className="wrap">
        <div className="col">
          <span className="label">Riscatto codici</span>
          <h2>
            Hai dei codici premio? <span>Li riscattiamo noi.</span>
          </h2>
          <p>Mandaci i codici delle confezioni: li riscattiamo in Giappone e ti mandiamo i premi.</p>
        </div>
        <div className="ticket">
          <span className="label">A codice</span>
          <span className="big">{euro(RISCATTO_CODICE).replace(",00", "")}</span>
          <ol>
            <li>Aggiungi il riscatto al carrello</li>
            <li>Scrivi codice e premio</li>
            <li>Ricevi il premio con l&apos;ordine</li>
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Feedback() {
  return (
    <section className="block">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">I nostri clienti</span>
            <h2>Feedback</h2>
          </div>
          <a className="more" href="#">
            Vedi tutti
          </a>
        </div>
        <div className="grid">
          {[1, 2, 3, 4].map((n) => (
            <div className="shot" key={n}>
              Feedback
            </div>
          ))}
        </div>
      </div>
    </section>
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

export function Faq() {
  return (
    <section className="block" id="faq">
      <div className="wrap">
        <div className="sec-head">
          <div>
            <span className="label">Domande frequenti</span>
            <h2>FAQ</h2>
          </div>
          <a className="more" href="#">
            Vedi tutte
          </a>
        </div>
        <div className="faq">
          {faq.map((f, i) => (
            <details key={f.domanda} open={i === 0}>
              <summary>{f.domanda}</summary>
              <p>{f.risposta}</p>
            </details>
          ))}
        </div>
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
          <a className="logo" href="#" aria-label="APEBEESTORE">
            <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} />
          </a>
          <p className="tagline">Bee ready to spin.</p>
        </div>
        <div>
          <h3>Negozio</h3>
          <ul>
            <li><a href="#catalogo">Catalogo</a></li>
            <li><a href="#preordini">Preordini</a></li>
            <li><a href="#riscatto">Riscatto codici</a></li>
          </ul>
        </div>
        <div>
          <h3>Info</h3>
          <ul>
            <li><a href="#">Chi siamo</a></li>
            <li><a href="#faq">FAQ</a></li>
            <li><a href="#">Spedizioni</a></li>
            <li><a href="#">Feedback</a></li>
          </ul>
        </div>
        <div>
          <h3>Contatti</h3>
          <ul>
            <li><a href="#">WhatsApp</a></li>
            <li><a href="https://www.instagram.com/apebeestore/" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="#community">Community</a></li>
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
