import { AtSign, Mail, MessageCircle } from "lucide-react";
import { Community, PageHead } from "@/components/Sections";
import type { Lingua } from "@/i18n/testi";
import { ORGANIZZAZIONE } from "@/pagine/meta";
import { EMAIL, NUMERO_LEGGIBILE, linkWhatsApp } from "@/lib/whatsapp";

const jsonLd = { "@context": "https://schema.org", ...ORGANIZZAZIONE };

const testa = {
  it: { titolo: "Chi siamo", testo: "Giocattoli, Beyblade X Takara Tomy e giochi di carte collezionabili, dal Giappone in Italia." },
  en: { titolo: "About us", testo: "Toys, Takara Tomy Beyblade X and trading card games, from Japan to Italy." },
};

export function ChiSiamo({ lang }: { lang: Lingua }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHead label="APEBEESTORE" titolo={testa[lang].titolo} testo={testa[lang].testo} stretto />
      {lang === "en" ? <TestoEn /> : <TestoIt />}
      <Contatti lang={lang} />
      <Community lang={lang} />
    </>
  );
}

function TestoIt() {
  return (
    <section className="block block--top">
      <div className="wrap narrow text">
        <p>
          APEBEESTORE è un negozio online con base a Milano / Como specializzato in giocattoli, Beyblade X Takara Tomy e
          giochi di carte collezionabili, importati direttamente dal Giappone. Siamo specializzati nella vendita di
          Beyblade, lanciatori, stadi e accessori della linea Beyblade X nella versione giapponese, quella usata nei tornei
          ufficiali in tutto il mondo.
        </p>

        <div className="stats">
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
            <span className="label">Prodotti originali</span>
          </div>
        </div>

        <h2>Come siamo nati</h2>
        <p>
          Abbiamo cominciato a novembre 2025 per un motivo semplice: in Italia i Beyblade X giapponesi originali erano
          difficili da trovare. Abbiamo iniziato a importarli dal Giappone e le richieste sono cresciute in fretta. Oggi
          abbiamo venduto più di 900 pezzi e la nostra community WhatsApp conta oltre 200 appassionati.
        </p>

        <h2>Cosa trovi</h2>
        <ul>
          <li>Beyblade X Takara Tomy delle serie BX, UX e CX</li>
          <li>Lanciatori, grip e accessori originali</li>
          <li>Stadi Beyblade X, come lo Xtreme Stadium</li>
          <li>Giocattoli</li>
          <li>Giochi di carte collezionabili</li>
          <li>Preordini delle nuove uscite giapponesi</li>
        </ul>

        <h2>Come lavoriamo</h2>
        <p>
          Ogni prodotto viene acquistato in Giappone e spedito in Italia da noi. Ordini quello che vuoi e lo facciamo
          arrivare apposta, in circa 3–4 settimane. Per le novità apriamo i preordini prima dell&apos;uscita, così ti
          assicuri il pezzo della prima ondata.
        </p>
        <p>
          Il prezzo che vedi sul sito è quello finale: spedizione dal Giappone e dogana sono già comprese, e non ti arriva
          nessun costo a sorpresa alla consegna.
        </p>

        <h2>Dove consegniamo</h2>
        <ul>
          <li>Consegna a mano a Milano, Como e Varese</li>
          <li>Spedizione in tutta Italia a € 8</li>
          <li>Spedizione in Europa a € 15</li>
          <li>Spedizione nel resto del mondo a € 50</li>
        </ul>

        <h2>Perché fidarsi</h2>
        <p>
          Vendiamo solo prodotti originali, mai copie o versioni non ufficiali. Su Instagram pubblichiamo le
          foto dei prodotti arrivati e i feedback di chi ha già comprato da noi. Ci trovi anche di persona in alcune fiere
          del fumetto e del collezionismo, con i prodotti sul banco.
        </p>
        <p>
          Seguici su Instagram{" "}
          <a href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
            @apebeestore
          </a>{" "}
          o entra nella community WhatsApp per vedere le nuove uscite appena le annunciamo.
        </p>
      </div>
    </section>
  );
}

function TestoEn() {
  return (
    <section className="block block--top">
      <div className="wrap narrow text">
        <p>
          APEBEESTORE is an online shop based in Milan / Como that specialises in toys, Takara Tomy Beyblade X and trading
          card games, imported directly from Japan. We specialise in Beyblade, launchers, stadiums and accessories from the
          Beyblade X line in their Japanese version, the one used in official tournaments around the world.
        </p>

        <div className="stats">
          <div>
            <strong>900+</strong>
            <span className="label">Items sold</span>
          </div>
          <div>
            <strong>200+</strong>
            <span className="label">Bladers in the community</span>
          </div>
          <div>
            <strong>100%</strong>
            <span className="label">Original products</span>
          </div>
        </div>

        <h2>How we started</h2>
        <p>
          We started in November 2025 for a simple reason: original Japanese Beyblade X were hard to find in Italy. We began
          importing them from Japan and requests grew quickly. Today we have sold more than 900 items and our WhatsApp
          community has over 200 fans.
        </p>

        <h2>What you&apos;ll find</h2>
        <ul>
          <li>Takara Tomy Beyblade X from the BX, UX and CX series</li>
          <li>Original launchers, grips and accessories</li>
          <li>Beyblade X stadiums, like the Xtreme Stadium</li>
          <li>Toys</li>
          <li>Trading card games</li>
          <li>Pre-orders for new Japanese releases</li>
        </ul>

        <h2>How we work</h2>
        <p>
          Every product is bought in Japan and shipped to Italy by us. You order what you want and we bring it in just for
          you, in about 3–4 weeks. For new releases we open pre-orders
          before launch, so you can secure a piece from the first batch.
        </p>
        <p>
          The price you see on the site is the final price: shipping from Japan and customs are already included, and there
          are no surprise costs on delivery.
        </p>

        <h2>Where we deliver</h2>
        <ul>
          <li>Hand delivery in Milan, Como and Varese</li>
          <li>Shipping anywhere in Italy for €8</li>
          <li>Shipping to Europe for €15</li>
          <li>Shipping to the rest of the world for €50</li>
        </ul>

        <h2>Why trust us</h2>
        <p>
          We only sell original products, never copies or unofficial versions. On Instagram we post photos of
          the products we receive and feedback from people who have already bought from us. You can also meet us in person
          at some comic and collectibles fairs, with our products on the stand.
        </p>
        <p>
          Follow us on Instagram{" "}
          <a href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
            @apebeestore
          </a>{" "}
          or join the WhatsApp community to see new releases as soon as we announce them.
        </p>
      </div>
    </section>
  );
}

const contatti = {
  it: {
    titolo: "Contatti",
    testo: "Hai una domanda prima di ordinare? Scrivici su WhatsApp, rispondiamo lì.",
    whatsapp: "Scrivici su WhatsApp",
    messaggio: "Ciao, ho una domanda su ",
    numero: "Numero WhatsApp",
    email: "Email",
    instagram: "Instagram",
  },
  en: {
    titolo: "Contact",
    testo: "Got a question before ordering? Message us on WhatsApp, we reply there.",
    whatsapp: "Message us on WhatsApp",
    messaggio: "Hi, I have a question about ",
    numero: "WhatsApp number",
    email: "Email",
    instagram: "Instagram",
  },
};

// contatti scritti per intero, così si possono copiare anche se il link non si apre
function Contatti({ lang }: { lang: Lingua }) {
  const t = contatti[lang];
  return (
    <section className="block contatti" id="contatti">
      <div className="wrap narrow">
        <div className="sec-head">
          <div>
            <span className="label">APEBEESTORE</span>
            <h2>{t.titolo}</h2>
            <p>{t.testo}</p>
          </div>
        </div>
        <a className="btn btn--primary contatti-wa" href={linkWhatsApp(t.messaggio)} target="_blank" rel="noopener noreferrer">
          <MessageCircle size={20} strokeWidth={2.2} aria-hidden="true" />
          {t.whatsapp}
        </a>
        <dl className="contatti-lista">
          <div>
            <dt>
              <MessageCircle size={18} strokeWidth={2} aria-hidden="true" /> {t.numero}
            </dt>
            <dd>
              <a href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                {NUMERO_LEGGIBILE}
              </a>
            </dd>
          </div>
          <div>
            <dt>
              <Mail size={18} strokeWidth={2} aria-hidden="true" /> {t.email}
            </dt>
            <dd>
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            </dd>
          </div>
          <div>
            <dt>
              <AtSign size={18} strokeWidth={2} aria-hidden="true" /> {t.instagram}
            </dt>
            <dd>
              <a href="https://www.instagram.com/apebeestore" target="_blank" rel="noopener noreferrer">
                @apebeestore
              </a>
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
