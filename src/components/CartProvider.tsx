"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { Prodotto } from "@/data/demo";

// Carrello di prova.
// Preordini e riscatti app non si uniscono ad altri prodotti.
// I preordini tra loro solo se hanno la stessa data.

type Cart = { righe: Prodotto[] };

type CartContextValue = {
  count: number;
  add: (p: Prodotto) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fuori da CartProvider");
  return ctx;
}

export function motivoBlocco(righe: Prodotto[], p: Prodotto): string | null {
  if (p.stato === "soldout") return "Prodotto sold out.";
  const primo = righe[0];
  if (!primo) return null;
  if (primo.stato !== p.stato) {
    if (p.stato === "preordine") return "I preordini vanno in un ordine a parte.";
    if (p.stato === "riscatto") return "I riscatti app vanno in un ordine a parte.";
    if (primo.stato === "preordine") return "Hai un preordine nel carrello: questo va in un ordine a parte.";
    return "Hai un riscatto app nel carrello: questo va in un ordine a parte.";
  }
  if (p.stato === "preordine" && primo.uscita !== p.uscita) {
    return `Puoi unire solo preordini con la stessa data (${primo.uscita}).`;
  }
  return null;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ righe: [] });
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const add = useCallback(
    (p: Prodotto) => {
      const blocco = motivoBlocco(cart.righe, p);
      if (blocco) {
        show(blocco);
        return;
      }
      setCart({ righe: [...cart.righe, p] });
      show(`${p.codice} aggiunto al carrello`);
    },
    [cart.righe, show],
  );

  const clear = useCallback(() => {
    if (!cart.righe.length) {
      show("Il carrello è vuoto");
      return;
    }
    setCart({ righe: [] });
    show("Carrello svuotato");
  }, [cart.righe.length, show]);

  return (
    <CartContext.Provider value={{ count: cart.righe.length, add, clear }}>
      {children}
      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>
    </CartContext.Provider>
  );
}
