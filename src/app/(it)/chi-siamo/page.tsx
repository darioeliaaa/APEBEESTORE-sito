import { ChiSiamo } from "@/pagine/ChiSiamo";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("it", "/chi-siamo", testi.it.titoli.chiSiamo, testi.it.chiSiamo.descrizione);

export default function Pagina() {
  return <ChiSiamo lang="it" />;
}
