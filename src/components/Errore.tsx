"use client";

import { useEffect } from "react";
import { PageHead } from "@/components/Sections";
import { useLingua } from "@/i18n/LinguaProvider";
import { linkWhatsApp } from "@/lib/whatsapp";

// quando una pagina si rompe: niente errore tecnico, un messaggio chiaro con "Riprova" e WhatsApp
export function Errore({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useLingua();
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <>
      <PageHead label={t.errore.label} titolo={t.errore.titolo} testo={t.errore.testo} stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="ctas">
            <button className="btn btn--primary" type="button" onClick={() => reset()}>
              {t.errore.riprova}
            </button>
            <a className="btn btn--ghost" href={linkWhatsApp()} target="_blank" rel="noopener noreferrer">
              {t.errore.whatsapp}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
