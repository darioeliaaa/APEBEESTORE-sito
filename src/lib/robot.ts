// Verifica sul server del controllo anti-robot di Cloudflare (Turnstile).
// Senza TURNSTILE_SECRET_KEY il controllo è spento e passa tutto (in locale e finché non c'è l'account).
// Se Cloudflare non risponde lascio passare: meglio un ordine in più che un cliente vero bloccato.

export async function nonRobot(codice: unknown, ip: string) {
  const segreto = process.env.TURNSTILE_SECRET_KEY;
  if (!segreto) return true;
  if (typeof codice !== "string" || !codice || codice.length > 2048) return false;
  try {
    const corpo = new URLSearchParams({ secret: segreto, response: codice });
    if (ip !== "sconosciuto") corpo.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: corpo,
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const r = await res.json();
    return r.success === true;
  } catch (e) {
    console.error("[robot] Cloudflare non risponde:", (e as Error).message);
    return true;
  }
}
