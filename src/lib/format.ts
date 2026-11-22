const numero = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// € 147,00
export function euro(valore: number): string {
  return `€ ${numero.format(valore)}`;
}

// "2026-12-26" -> "26/12"
export function giorno(iso?: string): string {
  if (!iso) return "";
  const [, m, g] = iso.split("-");
  return `${g}/${m}`;
}
