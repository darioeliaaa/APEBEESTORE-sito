import type { Metadata, Viewport } from "next";
import { metaSito } from "@/pagine/meta";
import { Struttura } from "@/pagine/Struttura";

// tutte le pagine in inglese
export const metadata: Metadata = metaSito("en");

export const viewport: Viewport = {
  themeColor: "#0e0e0c",
  viewportFit: "cover",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Struttura lang="en">{children}</Struttura>;
}
