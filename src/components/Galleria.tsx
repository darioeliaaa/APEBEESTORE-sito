"use client";

import { useState } from "react";
import { useLingua } from "@/i18n/LinguaProvider";

// foto del prodotto: una grande e, se ce n'è più di una, le miniature sotto per cambiarla
export function Galleria({ foto, nome, codice }: { foto: string[]; nome: string; codice: string }) {
  const { t } = useLingua();
  const [scelta, setScelta] = useState(0);
  const [rotte, setRotte] = useState<string[]>([]);
  const buone = foto.filter((f) => !rotte.includes(f));
  const attuale = buone[Math.min(scelta, buone.length - 1)];
  const rompi = (f: string) => setRotte((r) => (r.includes(f) ? r : [...r, f]));

  return (
    <div className="galleria">
      <div className={`galleria-foto${attuale ? "" : " galleria-foto--vuota"}`}>
        {attuale ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={attuale} src={attuale} alt={nome} referrerPolicy="no-referrer" onError={() => rompi(attuale)} />
        ) : (
          <span className="ph" aria-hidden="true">
            {codice}
          </span>
        )}
      </div>
      {buone.length > 1 && (
        <div className="galleria-miniature">
          {buone.map((f, i) => (
            <button
              key={f}
              type="button"
              aria-label={t.prodotto.foto(i + 1)}
              aria-pressed={f === attuale}
              onClick={() => setScelta(i)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => rompi(f)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
