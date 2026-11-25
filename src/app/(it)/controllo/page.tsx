import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHead } from "@/components/Sections";
import { controllaFoglio } from "@/lib/sheet";

// Pagina nascosta: dice cosa non va nel foglio CATALOGO.
// È protetta dalla parola d'ordine (vedi src/proxy.ts) e rilegge il foglio ogni volta che la apri.

export const metadata: Metadata = { title: "Controllo foglio", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function Controllo() {
  if (!process.env.CONTROLLO_PASSWORD) notFound();
  const { prodotti, problemi, errore } = await controllaFoglio();
  const scartati = problemi.filter((p) => p.scartato);
  const avvisi = problemi.filter((p) => !p.scartato);

  return (
    <>
      <PageHead label="Solo per noi" titolo="Controllo foglio" testo="Le righe delle schede CATALOGO e BANNER che hanno qualcosa che non va." stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          {errore ? (
            <p className="esito esito--errore">
              {errore}. Il sito non si aggiorna e continua a mostrare l&apos;ultima versione buona finché non si sistema.
            </p>
          ) : problemi.length === 0 ? (
            <p className="esito esito--ok">Tutto a posto: {prodotti} prodotti sul sito, nessun problema.</p>
          ) : (
            <p className="esito">
              {prodotti} prodotti sul sito. {scartati.length} righe non sono sul sito, {avvisi.length} avvisi.
            </p>
          )}

          {problemi.length > 0 && (
            <table className="controllo">
              <thead>
                <tr>
                  <th>Riga</th>
                  <th>Codice</th>
                  <th>Cosa non va</th>
                  <th>Sul sito</th>
                </tr>
              </thead>
              <tbody>
                {problemi.map((p, i) => (
                  <tr key={i}>
                    <td>{p.riga}</td>
                    <td>{p.codice || "—"}</td>
                    <td>{p.motivo}</td>
                    <td>{p.scartato ? "No" : "Sì"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </>
  );
}
