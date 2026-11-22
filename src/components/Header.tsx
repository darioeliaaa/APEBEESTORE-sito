"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, SunMoon, X } from "lucide-react";
import { useCart } from "./CartProvider";

const negozio = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/preordini", label: "Preordini" },
  { href: "/riscatti", label: "Riscatti app" },
  { href: "/recensioni", label: "Recensioni" },
];

const info = [
  { href: "/faq", label: "FAQ" },
  { href: "/chi-siamo", label: "Chi siamo" },
];

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

export function Header() {
  const { count, apri } = useCart();
  const pathname = usePathname();
  const [aperto, setAperto] = useState(false);

  useEffect(() => setAperto(false), [pathname]);

  return (
    <header className="top">
      <div className="wrap">
        <Link className="logo" href="/" aria-label="APEBEESTORE, home">
          <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} priority />
        </Link>
        <nav className={`nav${aperto ? " open" : ""}`} id="menu" aria-label="Menu principale">
          {negozio.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
          <span className="nav-label">Info</span>
          {info.map((l) => (
            <Link key={l.href} className="nav-info" href={l.href} aria-current={pathname === l.href ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="tools">
          <span className="lang">
            <b>IT</b> / EN
          </span>
          <button className="icon-btn" type="button" aria-label="Cambia tema chiaro o scuro" onClick={toggleTheme}>
            <SunMoon size={22} strokeWidth={2} />
          </button>
          <button className="icon-btn" type="button" aria-label="Cerca">
            <Search size={22} strokeWidth={2} />
          </button>
          <button className="icon-btn" type="button" aria-label={`Carrello, ${count} prodotti`} onClick={apri}>
            <ShoppingBag size={22} strokeWidth={2} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
          <button
            className="icon-btn menu-btn"
            type="button"
            aria-label={aperto ? "Chiudi il menu" : "Apri il menu"}
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
