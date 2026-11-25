"use client";

import { Errore } from "@/components/Errore";

export default function Pagina(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <Errore {...props} />;
}
