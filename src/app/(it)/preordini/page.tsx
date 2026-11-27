import { Preordini } from "@/pagine/Preordini";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/preordini", testi.it.titoli.preordini, testi.it.meta.pagine.preordini);

export default function Pagina() {
  return <Preordini lang="it" />;
}
