import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Community, Hero } from "@/components/Sections";
import { catalogo } from "@/data/demo";

export default function Home() {
  return (
    <>
      <Hero />

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
          <div className="grid">
            {catalogo.slice(0, 4).map((p) => (
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
