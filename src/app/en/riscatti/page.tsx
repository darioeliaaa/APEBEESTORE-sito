import { Riscatti } from "@/pagine/Riscatti";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("en", "/riscatti", testi.en.titoli.riscatti, testi.en.meta.pagine.riscatti);

export default function Pagina() {
  return <Riscatti lang="en" />;
}
