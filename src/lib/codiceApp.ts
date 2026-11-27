// Il codice dei riscatti dell'app Beyblade X: 12 lettere o numeri in tre gruppi da 4, tipo AB12-CD34-EF56.
// Va bene anche scritto in minuscolo, con gli spazi o senza trattini: lo rimetto nel formato giusto.
// Se non è un codice valido torna null.
export function sistemaCodiceApp(v: string) {
  const s = v.toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z0-9]{12}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}` : null;
}
