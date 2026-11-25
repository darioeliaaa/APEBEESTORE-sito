import { Preordini } from "@/pagine/Preordini";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("en", "/preordini", testi.en.titoli.preordini);

export default function Pagina() {
  return <Preordini lang="en" />;
}
