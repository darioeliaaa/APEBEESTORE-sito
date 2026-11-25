"use client";

import { useState } from "react";

// screenshot della recensione: se il link è rotto la foto sparisce e resta il resto della recensione;
// se la recensione era solo la foto (niente testo), sparisce tutta, così non resta un riquadro vuoto
export function RecensioneFoto({ src, alt, etichetta, sola }: { src: string; alt: string; etichetta: string; sola?: boolean }) {
  const [rotta, setRotta] = useState(false);
  if (rotta) return null;
  return (
    <a className="recensione-foto" href={src} target="_blank" rel="noopener noreferrer" aria-label={etichetta}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={(e) => {
          if (sola) e.currentTarget.closest("li")?.setAttribute("hidden", "");
          setRotta(true);
        }}
      />
    </a>
  );
}
