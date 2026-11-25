// WhatsApp di APEBEESTORE (Nicholas): qui arrivano gli ordini dal sito
export const NUMERO_WHATSAPP = "393200893153";

export const linkWhatsApp = (testo?: string) =>
  `https://wa.me/${NUMERO_WHATSAPP}${testo ? `?text=${encodeURIComponent(testo)}` : ""}`;
