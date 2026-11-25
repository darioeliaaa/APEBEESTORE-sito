import type { Metadata } from "next";
import { testi } from "@/i18n/testi";
import { NonTrovata } from "@/pagine/NonTrovata";

export const metadata: Metadata = { title: testi.it.titoli.nonTrovata };

export default function NotFound() {
  return <NonTrovata lang="it" />;
}
