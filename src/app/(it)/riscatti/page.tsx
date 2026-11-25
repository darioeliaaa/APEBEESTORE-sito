import { Riscatti } from "@/pagine/Riscatti";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/riscatti", testi.it.titoli.riscatti);

export default function Pagina() {
  return <Riscatti lang="it" />;
}
