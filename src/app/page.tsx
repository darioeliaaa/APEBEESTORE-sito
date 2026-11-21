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

      <Community />
    </>
  );
}
