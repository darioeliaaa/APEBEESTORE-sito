import type { Metadata } from "next";
import Link from "next/link";
import { PageHead } from "@/components/Sections";
import { euro } from "@/lib/format";
import { chiamaScript, scriptPronto, type Riepilogo } from "@/lib/ordini";

// Riepilogo di un ordine: ci si arriva dal link nell'email che manda lo script (…/riepilogo?order=ORD-0188&t=…).
// I dati li legge lo script dalla scheda Ordini, solo se il codice nel link (t) è giusto.

export const metadata: Metadata = { title: "Riepilogo ordine", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ order?: string; t?: string }> };

async function leggi(order?: string, token?: string): Promise<Riepilogo | null> {
  if (!order || !token || !scriptPronto()) return null;
  try {
    const r = await chiamaScript({ azione: "riepilogo", order: order.slice(0, 20), token: token.slice(0, 40) });
    return r.success && r.recap ? r.recap : null;
  } catch {
    return null;
  }
}

export default async function Pagina({ searchParams }: Props) {
  const { order, t } = await searchParams;
  const r = await leggi(order, t);

  if (!r) {
    return (
      <>
        <PageHead label="Riepilogo ordine" titolo="Link non valido" testo="Questo link non è valido o è scaduto. Se hai bisogno, scrivici su WhatsApp." stretto />
        <section className="block block--top">
          <div className="wrap narrow">
            <Link className="btn btn--primary" href="/">
              Torna alla home
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead label={`Ordine ${r.orderNumber}`} titolo="Riepilogo ordine" testo={`Ciao ${r.customerName}, ecco il tuo ordine del ${r.date}.`} stretto />
      <section className="block block--top">
        <div className="wrap narrow">
          <div className="ordine-riepilogo riepilogo-email">
            <ul>
              {r.items.map((i) => (
                <li key={i.name}>
                  <span className="ordine-nome">
                    <strong>{i.name}</strong>
                    <span className="label">x{i.qty}</span>
                  </span>
                  <span className="ordine-prezzo">{euro(i.subtotal)}</span>
                </li>
              ))}
              {r.redemptions.map((x) => (
                <li key={x.code}>
                  <span className="ordine-nome">
                    <strong>{x.prize || "Riscatto app"}</strong>
                    <span className="label">Codice {x.code}</span>
                  </span>
                  <span className="ordine-prezzo">{euro(r.redemptionCost / Math.max(r.redemptionCount, 1))}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>Prodotti</dt>
                <dd>{euro(r.subtotal)}</dd>
              </div>
              <div>
                <dt>Consegna</dt>
                <dd>{r.shipping ? euro(r.shipping) : "Gratis"}</dd>
              </div>
              <div className="ordine-totale">
                <dt>Totale</dt>
                <dd>{euro(r.total)}</dd>
              </div>
            </dl>
            <p>
              <strong>Consegna:</strong> {r.deliveryMethod}
              {r.address ? ` · ${r.address}` : ""}
            </p>
            {r.requests && (
              <p>
                <strong>Note:</strong> {r.requests}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
