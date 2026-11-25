// FAQ dal documento di Nicholas, in italiano e in inglese.
// L'id di ogni sezione è uguale nelle due lingue: i link tipo /faq#riscatti-app funzionano sempre.

export type Faq = { domanda: string; risposta: string };
export type GruppoFaq = { id: string; gruppo: string; domande: Faq[] };

export const faqIt: GruppoFaq[] = [
  {
    id: "prodotti",
    gruppo: "Prodotti",
    domande: [
      { domanda: "Cos'è APEBEESTORE?", risposta: "Un negozio online con base a Milano che vende Beyblade X originali Takara Tomy importati dal Giappone: trottole, lanciatori, stadi e accessori." },
      { domanda: "I vostri Beyblade X sono originali?", risposta: "Sì. Vendiamo solo Beyblade X originali Takara Tomy, acquistati in Giappone. Su Instagram e sul sito trovi le foto dei prodotti arrivati e i feedback dei clienti." },
      { domanda: "Che differenza c'è tra Beyblade X Takara Tomy e Hasbro?", risposta: "Takara Tomy è il produttore giapponese di Beyblade X. Hasbro distribuisce una versione propria in Europa e negli Stati Uniti, con confezioni, catalogo e alcuni componenti diversi. Noi vendiamo solo la versione giapponese Takara Tomy." },
      { domanda: "Quali prodotti Beyblade X vendete?", risposta: "Trottole delle serie BX, UX e CX, lanciatori, grip, stadi (come lo Xtreme Stadium) e accessori. Per ora trattiamo solo la linea Beyblade X, non Burst né Metal." },
    ],
  },
  {
    id: "ordini-e-preordini",
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
    id: "riscatti-app",
    gruppo: "Riscatti app",
    domande: [
      { domanda: "Cosa sono i riscatti app?", risposta: "Sono premi che si ottengono con un codice dell'app Beyblade X. Ogni mese ci sono premi nuovi: li trovi nella pagina Riscatti app." },
      { domanda: "Come funziona il riscatto?", risposta: "Scegli il premio, lo metti nel carrello e quando ordini inserisci il codice dell'app: il codice sblocca il premio, che costa € 35. Il sito controlla il codice e poi te lo confermiamo su WhatsApp, prima di spedirti il premio." },
      { domanda: "Posso ordinare un riscatto insieme ad altri prodotti?", risposta: "No. Ogni riscatto è un ordine a sé: un solo premio per volta, senza altri prodotti, preordini o premi." },
    ],
  },
  {
    id: "pagamenti-e-prezzi",
    gruppo: "Pagamenti e prezzi",
    domande: [
      { domanda: "Come si paga?", risposta: "Dopo aver completato l'ordine sul sito vieni reindirizzato su WhatsApp, dove concordiamo il pagamento. Accettiamo PayPal, Revolut e bonifico bancario." },
      { domanda: "Il prezzo include la dogana?", risposta: "Sì. Il prezzo sul sito è tutto incluso: spedizione dal Giappone e dogana sono già comprese. Alla consegna non paghi nulla in più." },
    ],
  },
  {
    id: "spedizioni-e-consegne",
    gruppo: "Spedizioni e consegne",
    domande: [
      { domanda: "Quanto costa la spedizione?", risposta: "Italia € 8, Europa € 15, resto del mondo da € 50." },
      { domanda: "Fate consegne a mano?", risposta: "Sì, consegniamo a mano a Milano, Como e Varese. Il punto d'incontro si concorda su WhatsApp." },
      { domanda: "Spedite all'estero?", risposta: "Sì, in tutta Europa a € 15 e nel resto del mondo a partire da € 50." },
      { domanda: "Dove si trova APEBEESTORE?", risposta: "Siamo a Milano. Non abbiamo un negozio fisico: vendiamo online, consegniamo a mano a Milano, Como e Varese e portiamo i prodotti in alcune fiere." },
    ],
  },
  {
    id: "community",
    gruppo: "Community",
    domande: [
      { domanda: "Come resto aggiornato sulle nuove uscite?", risposta: "Seguici su Instagram @apebeestore o entra nella nostra community WhatsApp, con oltre 200 appassionati di Beyblade X." },
    ],
  },
];

export const faqEn: GruppoFaq[] = [
  {
    id: "prodotti",
    gruppo: "Products",
    domande: [
      { domanda: "What is APEBEESTORE?", risposta: "An online shop based in Milan that sells original Takara Tomy Beyblade X imported from Japan: tops, launchers, stadiums and accessories." },
      { domanda: "Are your Beyblade X original?", risposta: "Yes. We only sell original Takara Tomy Beyblade X, bought in Japan. On Instagram and on the site you'll find photos of the products we receive and feedback from our customers." },
      { domanda: "What's the difference between Takara Tomy and Hasbro Beyblade X?", risposta: "Takara Tomy is the Japanese maker of Beyblade X. Hasbro sells its own version in Europe and the United States, with different packaging, a different line-up and some different parts. We only sell the Japanese Takara Tomy version." },
      { domanda: "Which Beyblade X products do you sell?", risposta: "Tops from the BX, UX and CX series, launchers, grips, stadiums (like the Xtreme Stadium) and accessories. For now we only carry the Beyblade X line, not Burst or Metal." },
    ],
  },
  {
    id: "ordini-e-preordini",
    gruppo: "Orders and pre-orders",
    domande: [
      { domanda: "Are products in stock, ready to ship?", risposta: "No. For now every product is a special order: we buy it in Japan after you place your order." },
      { domanda: "How long does an order take to arrive?", risposta: "About 3–4 weeks from your order." },
      { domanda: "How do pre-orders work?", risposta: "For new Japanese releases we open pre-orders before the launch date. The product arrives about 3–4 weeks after its release in Japan. Pre-orders are ordered separately from other products." },
      { domanda: "Can I cancel an order or a pre-order?", risposta: "Yes. Just message us on WhatsApp: we refund what you paid within 14 days. If the product has already been shipped, the withdrawal rules below apply." },
      { domanda: "Do you accept returns?", risposta: "Yes. You have 14 days from delivery to withdraw from your purchase, without giving a reason. Message us on WhatsApp and we'll tell you where to send the product back, undamaged and in its original packaging; return shipping is at your expense. We refund you within 14 days with the same payment method, including the standard shipping paid with the order. We may wait until we've received the product before refunding you." },
      { domanda: "My product arrived damaged or faulty: what should I do?", risposta: "Message us on WhatsApp within 24 hours of delivery with photos of the box and the item, so we can open a claim with the courier straight away. After 24 hours the 2-year legal guarantee for defects still applies." },
    ],
  },
  {
    id: "riscatti-app",
    gruppo: "App rewards",
    domande: [
      { domanda: "What are app rewards?", risposta: "They're prizes you get with a code from the Beyblade X app. There are new prizes every month: you'll find them on the App rewards page." },
      { domanda: "How does redeeming work?", risposta: "Pick the prize, add it to your cart and enter your app code when you order: the code unlocks the prize, which costs €35. The site checks the code and then we confirm it with you on WhatsApp before sending you the prize." },
      { domanda: "Can I order a reward together with other products?", risposta: "No. Each reward is an order of its own: one prize at a time, with no other products, pre-orders or prizes." },
    ],
  },
  {
    id: "pagamenti-e-prezzi",
    gruppo: "Payments and prices",
    domande: [
      { domanda: "How do I pay?", risposta: "After you complete your order on the site you're taken to WhatsApp, where we arrange the payment. We accept PayPal, Revolut and bank transfer." },
      { domanda: "Does the price include customs?", risposta: "Yes. The price on the site includes everything: shipping from Japan and customs are already included. You pay nothing extra on delivery." },
    ],
  },
  {
    id: "spedizioni-e-consegne",
    gruppo: "Shipping and delivery",
    domande: [
      { domanda: "How much is shipping?", risposta: "Italy €8, Europe €15, rest of the world from €50." },
      { domanda: "Do you deliver by hand?", risposta: "Yes, we deliver by hand in Milan, Como and Varese. We agree on the meeting point on WhatsApp." },
      { domanda: "Do you ship abroad?", risposta: "Yes, anywhere in Europe for €15 and to the rest of the world from €50." },
      { domanda: "Where is APEBEESTORE based?", risposta: "We're in Milan. We don't have a physical shop: we sell online, deliver by hand in Milan, Como and Varese and bring our products to some fairs." },
    ],
  },
  {
    id: "community",
    gruppo: "Community",
    domande: [
      { domanda: "How do I keep up with new releases?", risposta: "Follow us on Instagram @apebeestore or join our WhatsApp community, with over 200 Beyblade X fans." },
    ],
  },
];
