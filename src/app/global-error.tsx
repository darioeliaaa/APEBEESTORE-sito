"use client";

import "@/app/globals.css";
import { linkWhatsApp } from "@/lib/whatsapp";

// se si rompe anche la struttura del sito (header, footer...): pagina minima, in tutte e due le lingue
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="it">
      <body>
        <section className="page-head">
          <div className="wrap narrow">
            <span className="label">APEBEESTORE</span>
            <h1>Qualcosa è andato storto</h1>
            <p>Riprova tra un attimo. Se il problema continua, scrivici su WhatsApp.</p>
            <p lang="en">Something went wrong. Try again in a moment, or message us on WhatsApp.</p>
            <div className="ctas">
              <button className="btn btn--primary" type="button" onClick={() => reset()}>
                Riprova · Try again
              </button>
              <a className="btn btn--ghost" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
