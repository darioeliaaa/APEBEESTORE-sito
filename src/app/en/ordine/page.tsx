import { testi } from "@/i18n/testi";
import { metaPagina } from "@/pagine/meta";
import { OrdinePagina } from "@/pagine/OrdinePagina";

export const metadata = metaPagina("en", "/ordine", testi.en.titoli.ordine);

export default function Pagina() {
  return <OrdinePagina />;
}
