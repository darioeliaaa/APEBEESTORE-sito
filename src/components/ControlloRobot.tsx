"use client";

import { useEffect, useImperativeHandle, useRef, type Ref } from "react";
import type { Lingua } from "@/i18n/testi";

// Controllo anti-robot di Cloudflare (Turnstile) nei moduli di ordine e recensione.
// Di solito non si vede niente: compare una casella solo se Cloudflare ha dei dubbi.
// Senza NEXT_PUBLIC_TURNSTILE_SITE_KEY non fa niente (in locale e finché non c'è l'account Cloudflare).

export const CHIAVE_ROBOT = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Turnstile = {
  render: (el: HTMLElement, opzioni: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export type Robot = {
  // il codice del controllo: aspetta qualche secondo se Cloudflare non ha ancora finito
  aspetta: () => Promise<string>;
  // ogni codice vale una volta sola: dopo ogni invio se ne prende uno nuovo
  reset: () => void;
};

let caricamento: Promise<void> | null = null;
function carica() {
  if (window.turnstile) return Promise.resolve();
  caricamento ??= new Promise<void>((ok, ko) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => ok();
    s.onerror = () => {
      caricamento = null;
      ko(new Error("Turnstile non caricato"));
    };
    document.head.appendChild(s);
  });
  return caricamento;
}

export function ControlloRobot({ lang, ref }: { lang: Lingua; ref: Ref<Robot> }) {
  const box = useRef<HTMLDivElement>(null);
  const id = useRef("");
  const codice = useRef("");

  useImperativeHandle(ref, () => ({
    aspetta: async () => {
      if (!CHIAVE_ROBOT) return "";
      // 10 secondi; se Cloudflare mostra la casella da spuntare, si aspetta fino a 45 secondi
      const visibile = () => (box.current?.offsetHeight ?? 0) > 0;
      for (let i = 0; !codice.current && (i < 40 || (visibile() && i < 180)); i++) await new Promise((r) => setTimeout(r, 250));
      return codice.current;
    },
    reset: () => {
      codice.current = "";
      if (id.current) window.turnstile?.reset(id.current);
    },
  }));

  useEffect(() => {
    if (!CHIAVE_ROBOT) return;
    let chiuso = false;
    carica()
      .then(() => {
        if (chiuso || !box.current || !window.turnstile) return;
        id.current = window.turnstile.render(box.current, {
          sitekey: CHIAVE_ROBOT,
          language: lang,
          theme: "auto",
          appearance: "interaction-only",
          callback: (c: string) => (codice.current = c),
          "expired-callback": () => (codice.current = ""),
          "error-callback": () => {
            codice.current = "";
          },
        });
      })
      .catch(() => {});
    return () => {
      chiuso = true;
      if (id.current) window.turnstile?.remove(id.current);
      id.current = "";
      codice.current = "";
    };
  }, [lang]);

  if (!CHIAVE_ROBOT) return null;
  return <div ref={box} className="robot" />;
}
