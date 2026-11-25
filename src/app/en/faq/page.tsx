import { Faq } from "@/pagine/Faq";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("en", "/faq", testi.en.titoli.faq, testi.en.faq.descrizione);

export default function Pagina() {
  return <Faq lang="en" />;
}
