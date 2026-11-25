import { CondizioniVendita } from "@/pagine/Legale";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

// anche qui il carrello usa il catalogo di adesso
export const revalidate = 300;
export const metadata = metaPagina("en", "/condizioni-di-vendita", testi.en.titoli.condizioni);

export default function Pagina() {
  return <CondizioniVendita lang="en" />;
}
