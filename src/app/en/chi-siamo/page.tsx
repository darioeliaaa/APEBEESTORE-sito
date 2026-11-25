import { ChiSiamo } from "@/pagine/ChiSiamo";
import { metaPagina } from "@/pagine/meta";
import { testi } from "@/i18n/testi";

export const revalidate = 300;
export const metadata = metaPagina("en", "/chi-siamo", testi.en.titoli.chiSiamo, testi.en.chiSiamo.descrizione);

export default function Pagina() {
  return <ChiSiamo lang="en" />;
}
