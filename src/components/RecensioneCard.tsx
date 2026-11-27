import Link from "next/link";
import { Star } from "lucide-react";
import type { Prodotto } from "@/data/demo";
import { RecensioneFoto } from "@/components/RecensioneFoto";
import { testi, type Lingua } from "@/i18n/testi";
import { linkProdotto, slugCodice } from "@/lib/prodotto";
import type { Recensione } from "@/lib/sheet";

// una recensione: stelle, screenshot, frase, nome e prodotto (usata nella pagina Recensioni e in home)

function Stelle({ voto, etichetta }: { voto: number; etichetta: string }) {
  return (
    <span className="stelle" role="img" aria-label={etichetta}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={18} strokeWidth={1.8} className={n <= voto ? "piena" : undefined} aria-hidden="true" />
      ))}
    </span>
  );
}

export function RecensioneCard({ r, lang, prodotti }: { r: Recensione; lang: Lingua; prodotti: Prodotto[] }) {
  const t = testi[lang].recensioni;
  // il codice del prodotto diventa il link alla sua pagina (se è ancora nel catalogo)
  const p = r.prodotto ? prodotti.find((x) => slugCodice(x.codice) === slugCodice(r.prodotto!)) : undefined;
  return (
    <li className="recensione">
      {r.voto && <Stelle voto={r.voto} etichetta={t.stelle(r.voto)} />}
      {r.foto && <RecensioneFoto src={r.foto} alt={t.screenshot(r.nome)} etichetta={t.apri} sola={!r.frase} />}
      {r.frase && (
        <blockquote>
          <p>“{r.frase}”</p>
        </blockquote>
      )}
      {(r.nome || r.citta) && (
        <p className="recensione-chi">
          {r.nome && <strong>{r.nome}</strong>}
          {r.nome && r.citta && " · "}
          {r.citta}
        </p>
      )}
      {r.prodotto &&
        (p ? (
          <Link className="label recensione-prodotto" href={linkProdotto(lang, p.codice)}>
            {p.codice} {p.nome !== p.codice ? p.nome : ""}
          </Link>
        ) : (
          <span className="label recensione-prodotto">{r.prodotto}</span>
        ))}
    </li>
  );
}
