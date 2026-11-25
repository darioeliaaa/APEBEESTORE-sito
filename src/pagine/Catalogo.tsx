import { CatalogoLista } from "@/components/CatalogoLista";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";
import { leggiCatalogo, perStato } from "@/lib/sheet";

export async function Catalogo({ lang }: { lang: Lingua }) {
  const t = testi[lang].catalogo;
  const { prodotti } = await leggiCatalogo();
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          <CatalogoLista prodotti={perStato(prodotti, "ordinazione", "soldout")} />
        </div>
      </section>
    </>
  );
}
