import type { Metadata } from "next";
import { testi } from "@/i18n/testi";
import { NonCe } from "@/pagine/Prodotto";

// prodotto che non c'è più: stesso messaggio di prima, ma con risposta 404
export const metadata: Metadata = { title: testi.it.prodotto.nonCeTitolo, robots: { index: false, follow: false } };

export default function NotFound() {
  return <NonCe lang="it" />;
}
