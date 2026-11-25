import type { Lingua } from "@/i18n/testi";

const numero = new Intl.NumberFormat("it-IT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const numeroEn = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });
const giornoEn = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

// € 147,00 in italiano, €147.00 in inglese
export function euro(valore: number, lang: Lingua = "it"): string {
  return lang === "en" ? numeroEn.format(valore) : `€ ${numero.format(valore)}`;
}

// "2026-12-26" -> "26/12" in italiano, "26 Dec" in inglese
export function giorno(iso?: string, lang: Lingua = "it"): string {
  if (!iso) return "";
  if (lang === "en") return giornoEn.format(new Date(`${iso}T00:00:00Z`));
  const [, m, g] = iso.split("-");
  return `${g}/${m}`;
}
