import { Home } from "@/pagine/Home";
import { metaPagina } from "@/pagine/meta";

export const revalidate = 300;
export const metadata = metaPagina("it", "/");

export default function Pagina() {
  return <Home lang="it" />;
}
