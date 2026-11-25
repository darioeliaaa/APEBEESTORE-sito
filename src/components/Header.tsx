"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, ShoppingBag, SunMoon, X } from "lucide-react";
import { useLingua } from "@/i18n/LinguaProvider";
import { inLingua, percorso, testi, type Lingua } from "@/i18n/testi";
import { useCart } from "./CartProvider";
import { Ricerca } from "./Ricerca";

// "Catalogo" è un menu a tendina con le linee (Beyblade X, Pokémon...), le altre voci sono link normali
const negozio = [
  { href: "/preordini", voce: "preordini" },
  { href: "/riscatti", voce: "riscatti" },
  { href: "/recensioni", voce: "recensioni" },
] as const;

const info = [
  { href: "/faq", voce: "faq" },
  { href: "/chi-siamo", voce: "chiSiamo" },
] as const;

function toggleTheme() {
  const root = document.documentElement;
  const attuale = root.getAttribute("data-theme");
  const scuro = attuale ? attuale === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  const nuovo = scuro ? "light" : "dark";
  root.setAttribute("data-theme", nuovo);
  try {
    localStorage.setItem("theme", nuovo);
  } catch {}
}

// IT / EN: porta alla stessa pagina nell'altra lingua, tenendo anche i filtri del catalogo (?ordine=...)
function Lingue({ className }: { className: string }) {
  const { lang, t } = useLingua();
  const pathname = usePathname();
  return (
    <div className={className} role="group" aria-label={t.header.lingua}>
      {(["it", "en"] as Lingua[]).map((l, i) => (
        <Fragment key={l}>
          {i > 0 && <span aria-hidden="true">/</span>}
          <a
            href={inLingua(pathname, l)}
            hrefLang={l}
            lang={l}
            aria-label={testi[l].nome}
            aria-current={l === lang ? "true" : undefined}
            onClick={(e) => {
              if (l === lang) return e.preventDefault();
              e.preventDefault();
              window.location.href = inLingua(window.location.pathname, l) + window.location.search + window.location.hash;
            }}
          >
            {testi[l].sigla}
          </a>
        </Fragment>
      ))}
    </div>
  );
}

export function Header({ linee }: { linee: { nome: string; slug: string }[] }) {
  const { count, apri } = useCart();
  const { lang, t } = useLingua();
  const pathname = usePathname();
  const [aperto, setAperto] = useState(false);
  const [tendina, setTendina] = useState(false);
  const testata = useRef<HTMLElement>(null);
  const menu = useRef<HTMLElement>(null);
  const voceCatalogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAperto(false);
    setTendina(false);
  }, [pathname]);

  // tendina del catalogo aperta: si chiude con Esc o cliccando fuori
  useEffect(() => {
    if (!tendina) return;
    // con Esc il cursore della tastiera torna su "Catalogo"
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setTendina(false);
      voceCatalogo.current?.querySelector("button")?.focus();
    };
    const fuori = (e: PointerEvent) => {
      if (voceCatalogo.current && !voceCatalogo.current.contains(e.target as Node)) setTendina(false);
    };
    document.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", fuori);
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("pointerdown", fuori);
    };
  }, [tendina]);

  // menu del telefono aperto: si chiude con Esc, toccando fuori o allargando la finestra,
  // la pagina sotto non scorre e il menu non va oltre lo schermo
  useEffect(() => {
    if (!aperto) return;
    const chiudi = () => setAperto(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && chiudi();
    const fuori = (e: PointerEvent) => {
      if (testata.current && !testata.current.contains(e.target as Node)) chiudi();
    };
    const largo = window.matchMedia("(min-width: 1101px)");
    const nav = menu.current;
    if (nav && testata.current) nav.style.maxHeight = `${window.innerHeight - testata.current.getBoundingClientRect().bottom}px`;
    document.addEventListener("keydown", esc);
    document.addEventListener("pointerdown", fuori);
    largo.addEventListener("change", chiudi);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.removeEventListener("pointerdown", fuori);
      largo.removeEventListener("change", chiudi);
      document.body.style.overflow = "";
      if (nav) nav.style.maxHeight = "";
    };
  }, [aperto]);

  const chiudiTutto = () => {
    setAperto(false);
    setTendina(false);
  };
  const catalogo = percorso(lang, "/catalogo");
  const nelCatalogo = pathname === catalogo || pathname.startsWith(`${catalogo}/`);

  // toccando una voce il menu si chiude, anche se è la pagina in cui sei già
  const voce = (l: { href: string; voce: keyof typeof t.nav }, cls?: string) => {
    const href = percorso(lang, l.href);
    return (
      <Link key={l.href} className={cls} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setAperto(false)}>
        {t.nav[l.voce]}
      </Link>
    );
  };

  return (
    <header className="top" ref={testata}>
      <div className="wrap">
        <Link className="logo" href={percorso(lang, "/")} aria-label={t.header.home} onClick={() => setAperto(false)}>
          <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} priority />
        </Link>
        <nav className={`nav${aperto ? " open" : ""}`} id="menu" aria-label={t.header.menu} ref={menu}>
          <div
            className="voce-tendina"
            ref={voceCatalogo}
            onBlur={(e) => {
              // uscendo dalla tendina con Tab si chiude
              if (!e.currentTarget.contains(e.relatedTarget as Node)) setTendina(false);
            }}
          >
            <button
              type="button"
              aria-expanded={tendina}
              aria-controls="tendina-catalogo"
              data-attivo={nelCatalogo || undefined}
              onClick={() => setTendina(!tendina)}
            >
              {t.nav.catalogo}
              <ChevronDown size={16} strokeWidth={2.4} aria-hidden="true" />
            </button>
            {tendina && (
              <div className="tendina" id="tendina-catalogo" role="group" aria-label={t.header.linee}>
                {linee.map((l) => {
                  const href = percorso(lang, `/catalogo/${l.slug}`);
                  return (
                    <Link key={l.slug} href={href} aria-current={pathname === href ? "page" : undefined} onClick={chiudiTutto}>
                      {l.nome}
                    </Link>
                  );
                })}
                <Link className="tendina-tutte" href={catalogo} aria-current={pathname === catalogo ? "page" : undefined} onClick={chiudiTutto}>
                  {testi[lang].catalogo.tutteLeLinee}
                </Link>
              </div>
            )}
          </div>
          {negozio.map((l) => voce(l))}
          <span className="nav-label">{t.header.info}</span>
          {info.map((l) => voce(l, "nav-info"))}
          <Lingue className="lang lang--menu" />
        </nav>
        <div className="tools">
          <Lingue className="lang lang--barra" />
          <Ricerca onApri={chiudiTutto} />
          <button className="icon-btn" type="button" aria-label={t.header.tema} onClick={toggleTheme}>
            <SunMoon size={22} strokeWidth={2} />
          </button>
          <button
            className="icon-btn"
            type="button"
            aria-label={t.header.carrello(count)}
            onClick={() => {
              setAperto(false);
              apri();
            }}
          >
            <ShoppingBag size={22} strokeWidth={2} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-label={aperto ? t.header.chiudiMenu : t.header.apriMenu}
            aria-expanded={aperto}
            aria-controls="menu"
            onClick={() => setAperto(!aperto)}
          >
            {aperto ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>
      <div className="stripe" aria-hidden="true" />
    </header>
  );
}
