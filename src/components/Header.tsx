"use client";

import Image from "next/image";
import { Menu, Search, ShoppingBag, SunMoon } from "lucide-react";
import { useCart } from "./CartProvider";

const links = [
  { href: "#catalogo", label: "Catalogo" },
  { href: "#preordini", label: "Preordini" },
  { href: "#riscatto", label: "Riscatto codici" },
  { href: "#community", label: "Community" },
  { href: "#faq", label: "FAQ" },
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
  const { count, clear } = useCart();
  return (
    <header className="top">
      <div className="wrap">
        <a className="logo" href="#" aria-label="APEBEESTORE, home">
          <Image className="logo-white" src="/brand/logo-orizzontale.png" alt="APEBEESTORE" width={736} height={188} priority />
        </a>
        <nav className="nav" aria-label="Menu principale">
          {links.map((l, i) => (
            <a key={l.href} href={l.href} aria-current={i === 0 ? "page" : undefined}>
              {l.label}
            </a>
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
          <button className="icon-btn" type="button" aria-label={`Carrello, ${count} prodotti`} onClick={clear}>
            <ShoppingBag size={22} strokeWidth={2} />
            {count > 0 && <span className="count">{count}</span>}
          </button>
          <button className="icon-btn menu-btn" type="button" aria-label="Apri il menu">
            <Menu size={22} strokeWidth={2} />
          </button>
        </div>
      </div>
      <div className="stripe" aria-hidden="true" />
    </header>
  );
}
