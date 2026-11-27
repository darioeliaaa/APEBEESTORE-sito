// WhatsApp di APEBEESTORE (Nicholas): qui arrivano gli ordini dal sito
export const NUMERO_WHATSAPP = "393200893153";
// come si scrive sul sito: +39 320 089 3153
export const NUMERO_LEGGIBILE = `+${NUMERO_WHATSAPP.slice(0, 2)} ${NUMERO_WHATSAPP.slice(2, 5)} ${NUMERO_WHATSAPP.slice(5, 8)} ${NUMERO_WHATSAPP.slice(8)}`;
// gruppo della community WhatsApp (tasto "Entra", tasto fisso in basso a destra, recensioni)
export const COMMUNITY = "https://chat.whatsapp.com/LF8noghO9bWJ9KwvwKApue";
// email del negozio (quella dove arrivano gli ordini)
export const EMAIL = "apebeestore@gmail.com";

export const linkWhatsApp = (testo?: string) =>
  `https://wa.me/${NUMERO_WHATSAPP}${testo ? `?text=${encodeURIComponent(testo)}` : ""}`;
