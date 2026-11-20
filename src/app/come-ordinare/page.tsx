import type { Metadata } from "next";
import Link from "next/link";
import { PageHead, Passi, passi } from "@/components/Sections";

export const metadata: Metadata = { title: "Come ordinare" };

export default function ComeOrdinare() {
  return (
    <>
      <PageHead label="Come funziona" titolo="Come ordinare" testo="Quattro passi, dal carrello a casa tua." />
      <section className="block block--top">
        <div className="wrap">
          <Passi lista={passi} />
          <div>
            <Link className="btn btn--primary" href="/catalogo">
              Vai al catalogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
