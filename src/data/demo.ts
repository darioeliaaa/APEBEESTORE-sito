// Dati di prova. Poi arriveranno dal Google Sheet.

export type Stato = "ordinazione" | "preordine" | "riscatto" | "soldout";

export type Prodotto = {
  codice: string;
  nome: string;
  categoria: "Arene" | "Beyblade" | "Accessori" | "Premi";
  prezzo: number;
  stato: Stato;
  uscita?: string; // gg/mm, solo preordini
};


export const preordini: Prodotto[] = [
  { codice: "BX-54", nome: "Sieg Superion 0-70LP", categoria: "Beyblade", prezzo: 35, stato: "preordine", uscita: "12/12" },
  { codice: "CX-20", nome: "Customize Set C", categoria: "Beyblade", prezzo: 100, stato: "preordine", uscita: "12/12" },
  { codice: "BX-56", nome: "String Launcher L White × Violet", categoria: "Accessori", prezzo: 25, stato: "preordine", uscita: "19/12" },
];

// Premi da riscattare con il codice dell'app. Cambiano ogni mese.
export const riscatti: Prodotto[] = [
  { codice: "PREMIO 1", nome: "Premio di novembre 1", categoria: "Premi", prezzo: 35, stato: "riscatto" },
  { codice: "PREMIO 2", nome: "Premio di novembre 2", categoria: "Premi", prezzo: 35, stato: "riscatto" },
  { codice: "PREMIO 3", nome: "Premio di novembre 3", categoria: "Premi", prezzo: 35, stato: "riscatto" },
];

export const catalogo: Prodotto[] = [
  { codice: "BX-46", nome: "Stadium Infinity", categoria: "Arene", prezzo: 122, stato: "ordinazione" },
  { codice: "UX-17", nome: "Meteor Dragoon 3-70J", categoria: "Beyblade", prezzo: 33, stato: "ordinazione" },
  { codice: "CX-13", nome: "Bahamut Blitz BK1-50I", categoria: "Beyblade", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-52", nome: "Luster Dragoon 6-60LC", categoria: "Beyblade", prezzo: 40, stato: "ordinazione" },
  { codice: "UX-15", nome: "Shark Scale Deck Set", categoria: "Beyblade", prezzo: 87, stato: "ordinazione" },
  { codice: "CX-11", nome: "Emperor Might Deck Set", categoria: "Beyblade", prezzo: 105, stato: "soldout" },
  { codice: "BX-25", nome: "Gear Case", categoria: "Accessori", prezzo: 39, stato: "ordinazione" },
  { codice: "BX-51", nome: "String Launcher nero / verde", categoria: "Accessori", prezzo: 34, stato: "ordinazione" },
  { codice: "BX-10", nome: "Xtreme Stadium", categoria: "Arene", prezzo: 58, stato: "ordinazione" },
  { codice: "UX-01", nome: "Dran Buster 1-60A", categoria: "Beyblade", prezzo: 29, stato: "ordinazione" },
  { codice: "BX-01", nome: "Dran Sword 3-60F", categoria: "Beyblade", prezzo: 28, stato: "soldout" },
  { codice: "BX-11", nome: "Launcher Grip", categoria: "Accessori", prezzo: 18, stato: "ordinazione" },
];

// FAQ dal documento di Nicholas.
export type Faq = { domanda: string; risposta: string };

export const faq: { gruppo: string; domande: Faq[] }[] = [
  {
    gruppo: "Prodotti",
    domande: [
      { domanda: "Cos'è APEBEESTORE?", risposta: "Un negozio online con base a Milano che vende Beyblade X originali Takara Tomy importati dal Giappone: trottole, lanciatori, stadi e accessori." },
      { domanda: "I vostri Beyblade X sono originali?", risposta: "Sì. Vendiamo solo Beyblade X originali Takara Tomy, acquistati in Giappone. Su Instagram e sul sito trovi le foto dei prodotti arrivati e i feedback dei clienti." },
      { domanda: "Che differenza c'è tra Beyblade X Takara Tomy e Hasbro?", risposta: "Takara Tomy è il produttore giapponese di Beyblade X. Hasbro distribuisce una versione propria in Europa e negli Stati Uniti, con confezioni, catalogo e alcuni componenti diversi. Noi vendiamo solo la versione giapponese Takara Tomy." },
      { domanda: "Quali prodotti Beyblade X vendete?", risposta: "Trottole delle serie BX, UX e CX, lanciatori, grip, stadi (come lo Xtreme Stadium) e accessori. Per ora trattiamo solo la linea Beyblade X, non Burst né Metal." },
    ],
  },
  {
    gruppo: "Ordini e preordini",
    domande: [
      { domanda: "I prodotti sono disponibili in pronta consegna?", risposta: "No. Per il momento tutti i prodotti sono su ordinazione: li acquistiamo in Giappone dopo il tuo ordine." },
      { domanda: "Quanto tempo ci vuole per ricevere un ordine?", risposta: "Circa 3–4 settimane dall'ordine." },
      { domanda: "Come funzionano i preordini?", risposta: "Per le nuove uscite giapponesi apriamo i preordini prima della data di lancio. Il prodotto arriva circa 3–4 settimane dopo l'uscita in Giappone. I preordini si ordinano a parte dagli altri prodotti." },
      { domanda: "Posso annullare un ordine o un preordine?", risposta: "Sì. Puoi annullarlo scrivendoci su WhatsApp: ti restituiamo quanto hai versato entro 14 giorni. Se il prodotto è già stato spedito, valgono le regole del recesso qui sotto." },
      { domanda: "Accettate resi?", risposta: "Sì. Hai 14 giorni dalla consegna per recedere dall'acquisto, senza dover indicare il motivo. Scrivici su WhatsApp e ti diciamo dove rispedire il prodotto, integro e nella confezione originale; le spese di restituzione sono a tuo carico. Ti rimborsiamo entro 14 giorni con lo stesso metodo di pagamento, comprese le spese di spedizione standard pagate all'ordine. Possiamo attendere di aver ricevuto il prodotto prima di rimborsarti." },
      { domanda: "Il prodotto è arrivato danneggiato o difettoso: cosa faccio?", risposta: "Scrivici su WhatsApp entro 24 ore dalla consegna con le foto della confezione e del pezzo, così apriamo subito la pratica con il corriere. Dopo le 24 ore resta comunque valida la garanzia legale di 2 anni per i difetti." },
    ],
  },
  {
    gruppo: "Riscatti app",
    domande: [
      { domanda: "Cosa sono i riscatti app?", risposta: "Sono premi che si ottengono con un codice dell'app Beyblade X. Ogni mese ci sono premi nuovi: li trovi nella pagina Riscatti app." },
      { domanda: "Come funziona il riscatto?", risposta: "Scegli il premio, lo metti nel carrello e quando ordini inserisci il codice dell'app. Al resto pensiamo noi e ti mandiamo il premio a casa." },
      { domanda: "Posso ordinare un riscatto insieme ad altri prodotti?", risposta: "No, i riscatti app si ordinano a parte, perché hanno tempi di spedizione diversi." },
    ],
  },
  {
    gruppo: "Pagamenti e prezzi",
    domande: [
      { domanda: "Come si paga?", risposta: "Dopo aver completato l'ordine sul sito vieni reindirizzato su WhatsApp, dove concordiamo il pagamento. Accettiamo PayPal, Revolut e bonifico bancario." },
      { domanda: "Il prezzo include la dogana?", risposta: "Sì. Il prezzo sul sito è tutto incluso: spedizione dal Giappone e dogana sono già comprese. Alla consegna non paghi nulla in più." },
    ],
  },
  {
    gruppo: "Spedizioni e consegne",
    domande: [
      { domanda: "Quanto costa la spedizione?", risposta: "Italia € 8, Europa € 15, resto del mondo da € 50." },
      { domanda: "Fate consegne a mano?", risposta: "Sì, consegniamo a mano a Milano, Como e Varese. Il punto d'incontro si concorda su WhatsApp." },
      { domanda: "Spedite all'estero?", risposta: "Sì, in tutta Europa a € 15 e nel resto del mondo a partire da € 50." },
      { domanda: "Dove si trova APEBEESTORE?", risposta: "Siamo a Milano. Non abbiamo un negozio fisico: vendiamo online, consegniamo a mano a Milano, Como e Varese e portiamo i prodotti in alcune fiere." },
    ],
  },
  {
    gruppo: "Community",
    domande: [
      { domanda: "Come resto aggiornato sulle nuove uscite?", risposta: "Seguici su Instagram @apebeestore o entra nella nostra community WhatsApp, con oltre 200 appassionati di Beyblade X." },
    ],
  },
];
