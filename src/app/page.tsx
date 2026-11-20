import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Community, Hero, Tile } from "@/components/Sections";
import { catalogo } from "@/data/demo";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="block">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Il negozio</span>
              <h2>Cosa trovi</h2>
            </div>
          </div>
          <div className="tiles">
            <Tile href="/catalogo" label="Su ordinazione" titolo="Catalogo" testo="Tutti i Beyblade X, arene e accessori." />
            <Tile href="/preordini" label="Nuove uscite" titolo="Preordini" testo="Prenota le nuove uscite con un acconto del 40%." />
            <Tile href="/riscatti" label="Cambiano ogni mese" titolo="Riscatti app" testo="Riscatta i premi con il codice dell'app Beyblade X." />
            <Tile href="/recensioni" label="I nostri clienti" titolo="Recensioni" testo="Cosa dicono di noi i blader." />
          </div>
        </div>
      </section>

      <section className="block raised">
        <div className="wrap">
          <div className="sec-head">
            <div>
              <span className="label">Su ordinazione · 3–4 settimane</span>
              <h2>In evidenza</h2>
            </div>
            <Link className="more" href="/catalogo">
              Vedi tutto
            </Link>
          </div>
          <div className="grid grid--3">
            {catalogo.slice(0, 3).map((p) => (
              <ProductCard key={p.codice} p={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="numbers">
        <div className="wrap">
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
      </section>

      <Community />
    </>
  );
}
