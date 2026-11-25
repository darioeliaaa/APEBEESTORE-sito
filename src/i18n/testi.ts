// Tutti i testi del sito in italiano e in inglese.
// L'italiano sta agli indirizzi di sempre (/catalogo), l'inglese sotto /en (/en/catalogo).

export type Lingua = "it" | "en";

// "/catalogo" in italiano resta così, in inglese diventa "/en/catalogo"
export function percorso(lang: Lingua, p: string) {
  if (lang === "it") return p;
  return p === "/" ? "/en" : `/en${p}`;
}

// la stessa pagina nell'altra lingua: "/en/faq" -> "/faq" e viceversa
export function inLingua(pathname: string, lang: Lingua) {
  const base = pathname === "/en" ? "/" : pathname.startsWith("/en/") ? pathname.slice(3) : pathname;
  return percorso(lang, base);
}

const quantiIt = (n: number) => `${n} ${n === 1 ? "prodotto" : "prodotti"}`;
const quantiEn = (n: number) => `${n} ${n === 1 ? "product" : "products"}`;

const it = {
  sigla: "IT",
  nome: "Italiano",
  meta: {
    titolo: "APEBEESTORE · Originali dal Giappone",
    descrizione:
      "Giochi e collezionabili originali importati dal Giappone, a partire dai Beyblade X Takara Tomy. Spedizione e dogana incluse nel prezzo.",
    immagine: "APEBEESTORE, originali dal Giappone. Bee ready to spin.",
    locale: "it_IT",
  },
  titoli: {
    catalogo: "Catalogo",
    preordini: "Preordini",
    riscatti: "Riscatti app",
    recensioni: "Recensioni",
    faq: "FAQ",
    chiSiamo: "Chi siamo",
    nonTrovata: "Pagina non trovata",
  },
  demo: { prova: "Versione di prova", foglio: "Prodotti presi dal Google Sheet", finti: "Prodotti e prezzi non reali" },
  header: {
    home: "APEBEESTORE, home",
    menu: "Menu principale",
    info: "Info",
    tema: "Cambia tema chiaro o scuro",
    apriMenu: "Apri il menu",
    chiudiMenu: "Chiudi il menu",
    carrello: (n: number) => `Carrello, ${quantiIt(n)}`,
    lingua: "Lingua",
  },
  nav: {
    catalogo: "Catalogo",
    preordini: "Preordini",
    riscatti: "Riscatti app",
    recensioni: "Recensioni",
    faq: "FAQ",
    chiSiamo: "Chi siamo",
    comeOrdinare: "Come ordinare",
  },
  hero: {
    label: "Originali dal Giappone",
    lead: "Giochi e collezionabili originali, importati dal Giappone. Spedizione e dogana incluse nel prezzo.",
    catalogo: "Vai al catalogo",
    preordini: "Preordini",
    tag: "Dal Giappone in",
    tempo: "3–4 settimane",
  },
  home: { label: "Su ordinazione · 3–4 settimane", titolo: "In evidenza", tutto: "Vedi tutto" },
  community: {
    label: "Community WhatsApp",
    titolo: "Entra nella community",
    testo: "Più di 200 appassionati. Nuove uscite, preordini e tornei li annunciamo prima lì.",
    entra: "Entra",
  },
  footer: {
    negozio: "Negozio",
    info: "Info",
    contatti: "Contatti",
    legale: "Ragione sociale · Sede · P.IVA · Email",
    condizioni: "Condizioni di vendita · Privacy",
  },
  passi: [
    { titolo: "Scegli", testo: "Metti nel carrello quello che vuoi." },
    { titolo: "Ordina", testo: "Inserisci i tuoi dati. L'ordine arriva su WhatsApp." },
    { titolo: "Paga", testo: "Su WhatsApp con PayPal, Revolut o bonifico." },
    { titolo: "Ricevi", testo: "In 3–4 settimane a casa, o a mano a Milano, Como e Varese." },
  ],
  stati: { ordinazione: "Su ordinazione", preordine: "Preordine", riscatto: "Riscatto app", soldout: "Sold out" },
  // le categorie arrivano dal foglio in italiano: qui solo come si chiamano nell'altra lingua
  categorie: {} as Record<string, string>,
  card: {
    esce: (giorno: string) => `Esce il ${giorno}`,
    daConfermare: "Data da confermare",
    aggiungi: "Aggiungi",
    preordina: "Preordina",
    riscatta: "Riscatta",
    soldout: "Sold out",
    codiceApp: "Serve il codice dell'app",
  },
  catalogo: {
    label: "Su ordinazione · 3–4 settimane",
    titolo: "Catalogo",
    testo: "Spedizione e dogana incluse in tutti i prezzi.",
  },
  filtri: {
    filtri: "Filtri",
    ordinaPer: "Ordina per",
    quanti: quantiIt,
    mostra: (n: number) => `Mostra ${quantiIt(n)}`,
    categorie: "Categorie",
    tutto: "Tutto",
    disponibilita: "Disponibilità",
    nascondiSoldOut: "Nascondi i sold out",
    azzera: "Azzera",
    fascia: "Fascia di prezzo",
    ordini: { consigliati: "Consigliati", "prezzo-su": "Prezzo crescente", "prezzo-giu": "Prezzo decrescente", nome: "Nome A–Z" },
    fasce: { tutte: "Tutti i prezzi", "0-30": "Fino a € 30", "30-60": "€ 30 – 60", "60-100": "€ 60 – 100", "100": "Oltre € 100" },
    nessuno: "Nessun prodotto con questi filtri.",
    azzeraFiltri: "Azzera i filtri",
  },
  carrello: {
    titolo: "Carrello",
    chiudi: "Chiudi il carrello",
    vuoto: "Il carrello è vuoto.",
    togli: (codice: string) => `Togli un ${codice}`,
    aggiungiUno: (codice: string) => `Aggiungi un ${codice}`,
    quantita: (n: number) => `Quantità ${n}`,
    totale: "Totale",
    incluse: "Spedizione dal Giappone e dogana incluse",
    concludi: "Concludi l'ordine",
    presto: "Presto potrai concludere l'ordine direttamente qui.",
    aggiunto: (codice: string) => `${codice} aggiunto al carrello`,
    massimo: (n: number) => `Puoi ordinarne al massimo ${n}.`,
    aggiornato: "Il carrello è stato aggiornato: aprilo per vedere cosa è cambiato.",
    blocchi: {
      soldout: "Prodotto sold out.",
      preordine: "I preordini vanno in un ordine a parte.",
      riscatto: "I riscatti app vanno in un ordine a parte.",
      hoPreordine: "Hai un preordine nel carrello: questo va in un ordine a parte.",
      hoRiscatto: "Hai un riscatto app nel carrello: questo va in un ordine a parte.",
      data: (giorno?: string) =>
        giorno ? `Puoi unire solo preordini con la stessa data (${giorno}).` : "Puoi unire solo preordini con la stessa data.",
    },
    avvisi: {
      sparito: (codice: string) => `${codice} non è più in catalogo ed è stato tolto.`,
      soldout: (codice: string) => `${codice} è sold out ed è stato tolto.`,
      aParte: (codice: string) => `${codice} va in un ordine a parte ed è stato tolto.`,
      prezzo: (codice: string, prezzo: string) => `Il prezzo di ${codice} è cambiato: ora è ${prezzo}.`,
    },
  },
  banner: {
    regione: "Novità",
    di: (i: number, n: number) => `${i} di ${n}`,
    apri: (i: number) => `Apri la foto ${i}`,
    foto: (i: number, n: number) => `Foto ${i} di ${n}`,
    prec: "Foto precedente",
    succ: "Foto successiva",
  },
  preordini: {
    label: "Nuove uscite",
    titolo: "Preordini",
    testo: "Prenota le nuove uscite dal Giappone.",
    avvisoTitolo: "Si ordinano da soli.",
    avviso: "Insieme puoi mettere solo preordini con la stessa data di uscita.",
    vuoto: "Al momento non ci sono preordini aperti. Li annunciamo prima nella community.",
  },
  riscatti: {
    label: "Cambiano ogni mese",
    titolo: "Riscatti app",
    testo: "I premi da riscattare con il codice dell'app Beyblade X.",
    avvisoTitolo: "Si ordinano da soli.",
    avviso: "Non si possono unire ad altri prodotti o preordini.",
    vuoto: "I premi di questo mese arrivano a breve.",
    comeTitolo: "Come funziona il riscatto",
    come: "Scegli il premio, inserisci il codice dell'app quando ordini, ti arriva a casa.",
  },
  recensioni: {
    label: "I nostri clienti",
    titolo: "Recensioni",
    testo: "Alcuni messaggi di chi ha già ordinato da noi.",
    segnaposto: "Recensione",
    instagram: "Altre su Instagram",
  },
  faq: {
    label: "Domande frequenti",
    titolo: "FAQ",
    comeOrdinare: "Come ordinare",
    altro: "Non trovi la risposta? Scrivici su WhatsApp.",
    descrizione:
      "Tempi di consegna, costi di spedizione, preordini e pagamenti: tutte le risposte su come acquistare Beyblade X Takara Tomy originali su APEBEESTORE.",
  },
  chiSiamo: {
    descrizione:
      "APEBEESTORE è il negozio di Milano che importa Beyblade X originali Takara Tomy dal Giappone. Oltre 900 pezzi venduti, spedizione in Italia ed Europa.",
  },
  nonTrovata: {
    label: "Errore 404",
    titolo: "Pagina non trovata",
    testo: "La pagina che cerchi non esiste o è stata spostata.",
    catalogo: "Vai al catalogo",
    home: "Torna alla home",
  },
};

export type Testi = typeof it;

const en: Testi = {
  sigla: "EN",
  nome: "English",
  meta: {
    titolo: "APEBEESTORE · Originals from Japan",
    descrizione:
      "Original toys and collectibles imported from Japan, starting with Takara Tomy Beyblade X. Shipping and customs included in the price.",
    immagine: "APEBEESTORE, originals from Japan. Bee ready to spin.",
    locale: "en_GB",
  },
  titoli: {
    catalogo: "Catalogue",
    preordini: "Pre-orders",
    riscatti: "App rewards",
    recensioni: "Reviews",
    faq: "FAQ",
    chiSiamo: "About us",
    nonTrovata: "Page not found",
  },
  demo: { prova: "Preview version", foglio: "Products from the Google Sheet", finti: "Sample products and prices" },
  header: {
    home: "APEBEESTORE, home",
    menu: "Main menu",
    info: "Info",
    tema: "Switch between light and dark theme",
    apriMenu: "Open the menu",
    chiudiMenu: "Close the menu",
    carrello: (n: number) => `Cart, ${quantiEn(n)}`,
    lingua: "Language",
  },
  nav: {
    catalogo: "Catalogue",
    preordini: "Pre-orders",
    riscatti: "App rewards",
    recensioni: "Reviews",
    faq: "FAQ",
    chiSiamo: "About us",
    comeOrdinare: "How to order",
  },
  hero: {
    label: "Originals from Japan",
    lead: "Original toys and collectibles, imported from Japan. Shipping and customs included in the price.",
    catalogo: "Shop the catalogue",
    preordini: "Pre-orders",
    tag: "From Japan in",
    tempo: "3–4 weeks",
  },
  home: { label: "Special order · 3–4 weeks", titolo: "Featured", tutto: "See all" },
  community: {
    label: "WhatsApp community",
    titolo: "Join the community",
    testo: "More than 200 fans. We announce new releases, pre-orders and tournaments there first.",
    entra: "Join",
  },
  footer: {
    negozio: "Shop",
    info: "Info",
    contatti: "Contact",
    legale: "Company name · Address · VAT number · Email",
    condizioni: "Terms of sale · Privacy",
  },
  passi: [
    { titolo: "Choose", testo: "Add what you want to your cart." },
    { titolo: "Order", testo: "Enter your details. Your order reaches us on WhatsApp." },
    { titolo: "Pay", testo: "On WhatsApp with PayPal, Revolut or bank transfer." },
    { titolo: "Receive", testo: "At home in 3–4 weeks, or by hand in Milan, Como and Varese." },
  ],
  stati: { ordinazione: "Special order", preordine: "Pre-order", riscatto: "App reward", soldout: "Sold out" },
  categorie: {
    Trottole: "Beyblades",
    Arene: "Stadiums",
    Accessori: "Accessories",
    Premi: "Prizes",
    Altro: "Other",
    Carte: "Cards",
    Figure: "Figures",
    Lanciatori: "Launchers",
  },
  card: {
    esce: (giorno: string) => `Out ${giorno}`,
    daConfermare: "Date to be confirmed",
    aggiungi: "Add",
    preordina: "Pre-order",
    riscatta: "Redeem",
    soldout: "Sold out",
    codiceApp: "App code required",
  },
  catalogo: {
    label: "Special order · 3–4 weeks",
    titolo: "Catalogue",
    testo: "Shipping and customs included in every price.",
  },
  filtri: {
    filtri: "Filters",
    ordinaPer: "Sort by",
    quanti: quantiEn,
    mostra: (n: number) => `Show ${quantiEn(n)}`,
    categorie: "Categories",
    tutto: "All",
    disponibilita: "Availability",
    nascondiSoldOut: "Hide sold out",
    azzera: "Reset",
    fascia: "Price range",
    ordini: { consigliati: "Recommended", "prezzo-su": "Price: low to high", "prezzo-giu": "Price: high to low", nome: "Name A–Z" },
    fasce: { tutte: "All prices", "0-30": "Up to €30", "30-60": "€30 – 60", "60-100": "€60 – 100", "100": "Over €100" },
    nessuno: "No products match these filters.",
    azzeraFiltri: "Reset filters",
  },
  carrello: {
    titolo: "Cart",
    chiudi: "Close the cart",
    vuoto: "Your cart is empty.",
    togli: (codice: string) => `Remove one ${codice}`,
    aggiungiUno: (codice: string) => `Add one ${codice}`,
    quantita: (n: number) => `Quantity ${n}`,
    totale: "Total",
    incluse: "Shipping from Japan and customs included",
    concludi: "Checkout",
    presto: "Soon you'll be able to complete your order right here.",
    aggiunto: (codice: string) => `${codice} added to your cart`,
    massimo: (n: number) => `You can order up to ${n}.`,
    aggiornato: "Your cart has been updated: open it to see what changed.",
    blocchi: {
      soldout: "This product is sold out.",
      preordine: "Pre-orders go in a separate order.",
      riscatto: "App rewards go in a separate order.",
      hoPreordine: "You have a pre-order in your cart: this goes in a separate order.",
      hoRiscatto: "You have an app reward in your cart: this goes in a separate order.",
      data: (giorno?: string) =>
        giorno ? `You can only combine pre-orders with the same release date (${giorno}).` : "You can only combine pre-orders with the same release date.",
    },
    avvisi: {
      sparito: (codice: string) => `${codice} is no longer in the catalogue and has been removed.`,
      soldout: (codice: string) => `${codice} is sold out and has been removed.`,
      aParte: (codice: string) => `${codice} goes in a separate order and has been removed.`,
      prezzo: (codice: string, prezzo: string) => `The price of ${codice} has changed: it's now ${prezzo}.`,
    },
  },
  banner: {
    regione: "News",
    di: (i: number, n: number) => `${i} of ${n}`,
    apri: (i: number) => `Open photo ${i}`,
    foto: (i: number, n: number) => `Photo ${i} of ${n}`,
    prec: "Previous photo",
    succ: "Next photo",
  },
  preordini: {
    label: "New releases",
    titolo: "Pre-orders",
    testo: "Reserve the new releases from Japan.",
    avvisoTitolo: "Ordered on their own.",
    avviso: "You can only combine pre-orders with the same release date.",
    vuoto: "There are no open pre-orders right now. We announce them first in the community.",
  },
  riscatti: {
    label: "New every month",
    titolo: "App rewards",
    testo: "Prizes you can redeem with a code from the Beyblade X app.",
    avvisoTitolo: "Ordered on their own.",
    avviso: "They can't be combined with other products or pre-orders.",
    vuoto: "This month's prizes are coming soon.",
    comeTitolo: "How redeeming works",
    come: "Pick the prize, enter your app code when you order, and it arrives at your home.",
  },
  recensioni: {
    label: "Our customers",
    titolo: "Reviews",
    testo: "Some messages from people who have already ordered from us.",
    segnaposto: "Review",
    instagram: "More on Instagram",
  },
  faq: {
    label: "Frequently asked questions",
    titolo: "FAQ",
    comeOrdinare: "How to order",
    altro: "Can't find the answer? Message us on WhatsApp.",
    descrizione:
      "Delivery times, shipping costs, pre-orders and payments: all the answers on buying original Takara Tomy Beyblade X from APEBEESTORE.",
  },
  chiSiamo: {
    descrizione:
      "APEBEESTORE is the Milan shop that imports original Takara Tomy Beyblade X from Japan. Over 900 items sold, shipping across Italy and Europe.",
  },
  nonTrovata: {
    label: "Error 404",
    titolo: "Page not found",
    testo: "The page you're looking for doesn't exist or has been moved.",
    catalogo: "Shop the catalogue",
    home: "Back to home",
  },
};

export const testi: Record<Lingua, Testi> = { it, en };

// nome della categoria nella lingua giusta (se non c'è una traduzione resta com'è nel foglio)
export const nomeCategoria = (lang: Lingua, categoria: string) => testi[lang].categorie[categoria] ?? categoria;
