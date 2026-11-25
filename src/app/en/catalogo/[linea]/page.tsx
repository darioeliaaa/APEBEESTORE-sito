import type { Metadata } from "next";
import { CatalogoLinea, lineePerPagine, metaLinea } from "@/pagine/Catalogo";

type Props = { params: Promise<{ linea: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return lineePerPagine();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { linea } = await params;
  return metaLinea("en", linea);
}

export default async function Pagina({ params }: Props) {
  const { linea } = await params;
  return <CatalogoLinea lang="en" slug={linea} />;
}
