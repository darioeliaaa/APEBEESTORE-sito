import { Ordine } from "@/components/Ordine";
import { PageHead } from "@/components/Sections";
import { testi, type Lingua } from "@/i18n/testi";

export function OrdinePagina({ lang }: { lang: Lingua }) {
  const t = testi[lang].ordine;
  return (
    <>
      <PageHead label={t.label} titolo={t.titolo} testo={t.testo} />
      <section className="block block--top">
        <div className="wrap">
          <Ordine />
        </div>
      </section>
    </>
  );
}
