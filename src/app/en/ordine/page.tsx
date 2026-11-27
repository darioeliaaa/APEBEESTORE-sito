import { testi } from "@/i18n/testi";
import { metaPagina } from "@/pagine/meta";
import { OrdinePagina } from "@/pagine/OrdinePagina";

// la pagina con i dati del cliente non serve su Google
export const metadata = { ...metaPagina("en", "/ordine", testi.en.titoli.ordine), robots: { index: false, follow: false } };

export default function Pagina() {
  return <OrdinePagina />;
}
