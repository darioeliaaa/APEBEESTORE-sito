import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Montserrat } from "next/font/google";
import { CartProvider } from "@/components/CartProvider";
import { Header } from "@/components/Header";
import { DemoBanner, Footer } from "@/components/Sections";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700", "800", "900"], variable: "--font-montserrat" });
const archivo = Archivo({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-archivo" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: ["500"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: { default: "APEBEESTORE · Beyblade X originali dal Giappone", template: "%s · APEBEESTORE" },
  description: "Beyblade X originali Takara Tomy importati dal Giappone. Spedizione dal Giappone e dogana incluse nel prezzo.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0e0e0c",
  viewportFit: "cover",
};

const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning className={`${montserrat.variable} ${archivo.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <CartProvider>
          <DemoBanner />
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
