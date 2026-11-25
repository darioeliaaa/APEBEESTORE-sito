// Collegamento con lo script di Nicholas (Google Apps Script) che salva gli ordini nella scheda Ordini e manda le email.
// L'indirizzo dello script e la parola d'ordine stanno solo sul server (variabili ORDINI_URL e ORDINI_SEGRETO).

export const scriptPronto = () => !!(process.env.ORDINI_URL && process.env.ORDINI_SEGRETO);

export type RispostaScript = { success: boolean; error?: string; orderNumber?: string; total?: number; recap?: Riepilogo };

export type Riepilogo = {
  orderNumber: string;
  date: string;
  customerName: string;
  deliveryMethod: string;
  address: string;
  requests: string;
  items: { name: string; qty: number; price: number; subtotal: number }[];
  redemptions: { code: string; prize: string }[];
  redemptionCount: number;
  redemptionCost: number;
  subtotal: number;
  shipping: number;
  total: number;
};

export async function chiamaScript(corpo: Record<string, unknown>): Promise<RispostaScript> {
  const res = await fetch(process.env.ORDINI_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ segreto: process.env.ORDINI_SEGRETO, ...corpo }),
    cache: "no-store",
    signal: AbortSignal.timeout(25000),
  });
  const testo = await res.text();
  try {
    return JSON.parse(testo);
  } catch {
    throw new Error(`Risposta non valida dallo script (${res.status})`);
  }
}
