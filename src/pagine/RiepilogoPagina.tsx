import Link from "next/link";
import { PageHead } from "@/components/Sections";
import { percorso, type Lingua } from "@/i18n/testi";
import { euro } from "@/lib/format";
import { chiamaScript, scriptPronto, type Riepilogo } from "@/lib/ordini";

// Riepilogo di un ordine: ci si arriva dal link nell'email che manda lo script (…/riepilogo?order=ORD-0188&t=…).
// I dati li legge lo script dalla scheda Ordini, solo se il codice nel link (t) è giusto.

const testi = {
  it: {
    label: "Riepilogo ordine",
    nonValido: "Link non valido",
    nonValidoTesto: "Questo link non è valido o è scaduto. Se hai bisogno, scrivici su WhatsApp.",
    home: "Torna alla home",
    ordine: (n: string) => `Ordine ${n}`,
    titolo: "Riepilogo ordine",
    ciao: (nome: string, data: string) => `Ciao ${nome}, ecco il tuo ordine del ${data}.`,
    riscatto: "Riscatto app",
    codice: (c: string) => `Codice ${c}`,
    prodotti: "Prodotti",
    consegna: "Consegna",
    gratis: "Gratis",
    totale: "Totale",
    note: "Note",
  },
  en: {
    label: "Order summary",
    nonValido: "Invalid link",
    nonValidoTesto: "This link is not valid or has expired. If you need help, message us on WhatsApp.",
    home: "Back to home",
    ordine: (n: string) => `Order ${n}`,
    titolo: "Order summary",
    ciao: (nome: string, data: string) => `Hi ${nome}, here is your order from ${data}.`,
    riscatto: "App reward",
    codice: (c: string) => `Code ${c}`,
    prodotti: "Products",
    consegna: "Delivery",
    gratis: "Free",
    totale: "Total",
    note: "Notes",
  },
};

async function leggi(order?: string, token?: string): Promise<Riepilogo | null> {
  // il link dell'email è sempre ORD-0188 e 20 lettere/numeri: tutto il resto non lo mando neanche allo script
  if (!order || !token || !scriptPronto()) return null;
  if (!/^ORD-\d{4,8}$/.test(order) || !/^[0-9a-f]{20}$/.test(token)) return null;
  try {
    const r = await chiamaScript({ azione: "riepilogo", order, token });
    return r.success && r.recap ? r.recap : null;
  } catch {
    return null;
  }
}

export async function RiepilogoPagina({ lang, order, token }: { lang: Lingua; order?: string; token?: string }) {
  const t = testi[lang];
  const r = await leggi(order, token);
  const soldi = (n: number) => euro(n, lang);

  if (!r) {
    return (
      <>
        <PageHead label={t.label} titolo={t.nonValido} testo={t.nonValidoTesto} stretto />
        <section className="block block--top">
          <div className="wrap narrow">
            <Link className="btn btn--primary" href={percorso(lang, "/")}>
              {t.home}
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <PageHead label={t.ordine(r.orderNumber)} titolo={t.titolo} testo={t.ciao(r.customerName, r.date)} stretto />
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
                  <span className="ordine-prezzo">{soldi(i.subtotal)}</span>
                </li>
              ))}
              {r.redemptions.map((x) => (
                <li key={x.code}>
                  <span className="ordine-nome">
                    <strong>{x.prize || t.riscatto}</strong>
                    <span className="label">{t.codice(x.code)}</span>
                  </span>
                  <span className="ordine-prezzo">{soldi(r.redemptionCost / Math.max(r.redemptionCount, 1))}</span>
                </li>
              ))}
            </ul>
            <dl>
              <div>
                <dt>{t.prodotti}</dt>
                <dd>{soldi(r.subtotal)}</dd>
              </div>
              <div>
                <dt>{t.consegna}</dt>
                <dd>{r.shipping ? soldi(r.shipping) : t.gratis}</dd>
              </div>
              <div className="ordine-totale">
                <dt>{t.totale}</dt>
                <dd>{soldi(r.total)}</dd>
              </div>
            </dl>
            <p>
              <strong>{t.consegna}:</strong> {r.deliveryMethod}
              {r.address ? ` · ${r.address}` : ""}
            </p>
            {r.requests && (
              <p>
                <strong>{t.note}:</strong> {r.requests}
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
