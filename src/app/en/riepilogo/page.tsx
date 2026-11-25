import type { Metadata } from "next";
import { RiepilogoPagina } from "@/pagine/RiepilogoPagina";

// ci si arriva dal link nell'email dello script (…/riepilogo?order=ORD-0188&t=…)
export const metadata: Metadata = { title: "Order summary", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ order?: string; t?: string }> };

export default async function Pagina({ searchParams }: Props) {
  const { order, t } = await searchParams;
  return <RiepilogoPagina lang="en" order={order} token={t} />;
}
