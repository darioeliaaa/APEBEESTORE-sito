import { Recensioni } from "@/pagine/Recensioni";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/recensioni", testi.it.titoli.recensioni, testi.it.meta.pagine.recensioni);

export default function Pagina() {
  return <Recensioni lang="it" />;
}
