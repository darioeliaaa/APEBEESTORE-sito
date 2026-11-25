import type { Metadata, Viewport } from "next";
import { metaSito } from "@/pagine/meta";
import { Struttura } from "@/pagine/Struttura";

// tutte le pagine in italiano
export const metadata: Metadata = metaSito("it");

export const viewport: Viewport = {
  themeColor: "#0e0e0c",
  viewportFit: "cover",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Struttura lang="it">{children}</Struttura>;
}
