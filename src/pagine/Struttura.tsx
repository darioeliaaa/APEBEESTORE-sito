import { Archivo, JetBrains_Mono, Montserrat } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { Footer, TastoCommunity } from "@/components/Sections";
import { LinguaProvider } from "@/i18n/LinguaProvider";
import type { Lingua } from "@/i18n/testi";
import { leggiCatalogo, lineeCatalogo } from "@/lib/sheet";
import "@/app/globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-montserrat" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains" });

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

// la struttura comune a tutte le pagine, in italiano (src/app/(it)) e in inglese (src/app/en)
export async function Struttura({ lang, nonTrovata, children }: { lang: Lingua; nonTrovata?: boolean; children: React.ReactNode }) {
  // se il foglio ha un problema l'errore lo gestisce la pagina (che resta all'ultima versione buona):
  // qui il catalogo serve solo a carrello e menu, così anche /controllo si apre lo stesso
  const catalogo = await leggiCatalogo().catch(() => null);
  // al carrello serve il catalogo di adesso per aggiornare prezzi, disponibilità e foto
  // (senza descrizioni e foto in più, che servono solo nella pagina del prodotto)
  const perCarrello = catalogo ? catalogo.prodotti.map(({ foto, descrizione, evidenza, ...p }) => p) : null;
  // le linee del catalogo (Beyblade X, Pokémon...) per il menu a tendina
  const linee = catalogo ? lineeCatalogo(catalogo.prodotti).map(({ nome, slug }) => ({ nome, slug })) : [];
  return (
    <html lang={lang} suppressHydrationWarning className={`${montserrat.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <LinguaProvider lang={lang}>
          <CartProvider catalogo={perCarrello}>
            <Header linee={linee} nonTrovata={nonTrovata} />
            <main>{children}</main>
            <Footer lang={lang} />
            <TastoCommunity lang={lang} />
          </CartProvider>
        </LinguaProvider>
      </body>
    </html>
  );
}
