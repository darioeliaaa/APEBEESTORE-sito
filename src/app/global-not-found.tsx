import type { Metadata } from "next";
import { metaSito } from "@/pagine/meta";
import { NonTrovataDoppia } from "@/pagine/NonTrovata";
import { Struttura } from "@/pagine/Struttura";

// pagina 404 per tutti gli indirizzi che non esistono, sia in italiano che in inglese
export const metadata: Metadata = { ...metaSito("it"), title: { absolute: "Pagina non trovata · Page not found · APEBEESTORE" } };

export default function GlobalNotFound() {
  return (
    <Struttura lang="it" nonTrovata>
      <NonTrovataDoppia />
    </Struttura>
  );
}
