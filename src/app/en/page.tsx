import { Home } from "@/pagine/Home";
import { metaPagina } from "@/pagine/meta";

export const revalidate = 300;
export const metadata = metaPagina("en", "/");

export default function Pagina() {
  return <Home lang="en" />;
}
