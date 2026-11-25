"use client";

import { useState } from "react";

// screenshot della recensione: se il link è rotto la foto sparisce, resta il resto della recensione
export function RecensioneFoto({ src, alt, etichetta }: { src: string; alt: string; etichetta: string }) {
  const [rotta, setRotta] = useState(false);
  if (rotta) return null;
  return (
    <a className="recensione-foto" href={src} target="_blank" rel="noopener noreferrer" aria-label={etichetta}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading="lazy" referrerPolicy="no-referrer" onError={() => setRotta(true)} />
    </a>
  );
}
