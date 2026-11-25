import { Faq } from "@/pagine/Faq";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/faq", testi.it.titoli.faq, testi.it.faq.descrizione);

export default function Pagina() {
  return <Faq lang="it" />;
}
