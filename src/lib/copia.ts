// copia un testo; se il browser non lo permette usa il metodo vecchio, che funziona quasi ovunque
export async function copia(testo: string) {
  try {
    await navigator.clipboard.writeText(testo);
    return true;
  } catch {
    const prima = document.activeElement as HTMLElement | null;
    const campo = document.createElement("textarea");
    campo.value = testo;
    campo.setAttribute("readonly", "");
    campo.style.position = "fixed";
    campo.style.opacity = "0";
    document.body.appendChild(campo);
    campo.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {}
    campo.remove();
    prima?.focus();
    return ok;
  }
}
