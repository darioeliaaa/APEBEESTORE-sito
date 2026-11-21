import type { Metadata } from "next";
import { Community, PageHead } from "@/components/Sections";

export const metadata: Metadata = {
  title: { absolute: "Chi siamo – APEBEESTORE | Beyblade X Takara Tomy originali" },
  description:
    "APEBEESTORE è il negozio di Milano che importa Beyblade X originali Takara Tomy dal Giappone. Oltre 900 pezzi venduti, spedizione in Italia ed Europa.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "APEBEESTORE",
  address: { "@type": "PostalAddress", addressLocality: "Milano", addressCountry: "IT" },
  sameAs: ["https://www.instagram.com/apebeestore"],
};

export default function ChiSiamo() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHead
        label="APEBEESTORE"
        titolo="Chi siamo"
        testo="Beyblade X originali Takara Tomy dal Giappone, da Milano."
        stretto
      />
      <section className="block block--top">
        <div className="wrap narrow text">
          <p>
            APEBEESTORE è un negozio online con base a Milano specializzato in Beyblade X originali Takara Tomy, importati
            direttamente dal Giappone. Vendiamo trottole, lanciatori, stadi e accessori della linea Beyblade X nella versione
            giapponese, quella usata nei tornei ufficiali in Giappone e in tutto il mondo, e diversa dalla linea Hasbro
            distribuita in Europa.
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
              <span className="label">Originali Takara Tomy</span>
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
            <li>Trottole Beyblade X Takara Tomy delle serie BX, UX e CX</li>
            <li>Lanciatori, grip e accessori originali</li>
            <li>Stadi Beyblade X, come lo Xtreme Stadium</li>
            <li>Preordini delle nuove uscite giapponesi</li>
          </ul>

          <h2>Come lavoriamo</h2>
          <p>
            Ogni prodotto viene acquistato in Giappone e spedito in Italia da noi. Per il momento non teniamo un magazzino di
            pronta consegna: ordini quello che vuoi e lo facciamo arrivare apposta, in circa 3–4 settimane. Per le novità
            apriamo i preordini prima dell&apos;uscita, così ti assicuri il pezzo della prima ondata.
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
            <li>Spedizione nel resto del mondo a partire da € 50</li>
          </ul>

          <h2>Perché fidarsi</h2>
          <p>
            Vendiamo solo prodotti originali Takara Tomy, mai copie o versioni non ufficiali. Su Instagram pubblichiamo le
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
      <Community />
    </>
  );
}
