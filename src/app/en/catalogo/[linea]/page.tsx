import type { Metadata } from "next";
import { CatalogoLinea, lineePerPagine, nomeDellaLinea } from "@/pagine/Catalogo";
import { metaPagina } from "@/pagine/meta";

type Props = { params: Promise<{ linea: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return lineePerPagine();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { linea } = await params;
  return metaPagina("en", `/catalogo/${linea}`, await nomeDellaLinea(linea));
}

export default async function Pagina({ params }: Props) {
  const { linea } = await params;
  return <CatalogoLinea lang="en" slug={linea} />;
}
