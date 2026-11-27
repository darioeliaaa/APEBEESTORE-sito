import { Recensioni } from "@/pagine/Recensioni";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("en", "/recensioni", testi.en.titoli.recensioni, testi.en.meta.pagine.recensioni);

export default function Pagina() {
  return <Recensioni lang="en" />;
}
