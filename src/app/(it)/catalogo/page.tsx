import { Catalogo } from "@/pagine/Catalogo";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/catalogo", testi.it.titoli.catalogo);

export default function Pagina() {
  return <Catalogo lang="it" />;
}
