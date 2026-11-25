import type { Metadata } from "next";
import { ProdottoPagina, metaProdotto, prodottiPerPagine } from "@/pagine/Prodotto";

type Props = { params: Promise<{ codice: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  return prodottiPerPagine();
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return metaProdotto("en", (await params).codice);
}

export default async function Pagina({ params }: Props) {
  return <ProdottoPagina lang="en" slug={(await params).codice} />;
}
