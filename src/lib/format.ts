const numero = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// € 147,00
export function euro(valore: number): string {
  return `€ ${numero.format(valore)}`;
}
