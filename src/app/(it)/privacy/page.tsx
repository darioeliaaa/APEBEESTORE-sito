import { Privacy } from "@/pagine/Legale";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

// anche qui il carrello usa il catalogo di adesso
export const revalidate = 300;
export const metadata = metaPagina("it", "/privacy", testi.it.titoli.privacy);

export default function Pagina() {
  return <Privacy lang="it" />;
}
