import { Header } from "@/components/Header";
import {
  ComeSiOrdina,
  Community,
  DemoBanner,
  Faq,
  Feedback,
  Footer,
  Hero,
  InEvidenza,
  Preordini,
  Riscatto,
} from "@/components/Sections";

export default function Home() {
  return (
    <>
      <DemoBanner />
      <Header />
      <main>
        <Hero />
        <Preordini />
        <div className="stripe" aria-hidden="true" />
        <InEvidenza />
        <ComeSiOrdina />
        <Riscatto />
        <Feedback />
        <Community />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
