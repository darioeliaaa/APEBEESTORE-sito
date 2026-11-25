"use client";

import { createContext, useContext } from "react";
import { testi, type Lingua } from "./testi";

// la lingua della pagina, per le parti del sito che girano nel browser (header, carrello, filtri...)
const LinguaContext = createContext<Lingua>("it");

export function LinguaProvider({ lang, children }: { lang: Lingua; children: React.ReactNode }) {
  return <LinguaContext.Provider value={lang}>{children}</LinguaContext.Provider>;
}

export function useLingua() {
  const lang = useContext(LinguaContext);
  return { lang, t: testi[lang] };
}
