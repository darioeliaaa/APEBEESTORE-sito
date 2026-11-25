import Link from "next/link";
import { PageHead } from "@/components/Sections";
import { percorso, type Lingua } from "@/i18n/testi";
import { NUMERO_LEGGIBILE as numero } from "@/lib/whatsapp";

// Condizioni di vendita e Privacy. BOZZA: i dati tra [ ] arrivano da Nicholas,
// e i testi vanno fatti controllare al commercialista prima del lancio.

const bozza = {
  it: "Bozza da completare: i dati tra parentesi quadre e le parti segnate [da verificare] vanno sistemati prima della pubblicazione.",
  en: "Draft to be completed: the details in square brackets and the parts marked [to be checked] must be finalised before publication.",
};

function Bozza({ lang }: { lang: Lingua }) {
  return <p className="notice legale-bozza">{bozza[lang]}</p>;
}

export function CondizioniVendita({ lang }: { lang: Lingua }) {
  return lang === "en" ? <CondizioniEn /> : <CondizioniIt />;
}

export function Privacy({ lang }: { lang: Lingua }) {
  return lang === "en" ? <PrivacyEn /> : <PrivacyIt />;
}

function CondizioniIt() {
  const privacy = percorso("it", "/privacy");
  return (
    <>
      <PageHead label="Info legali" titolo="Condizioni di vendita" testo="Le regole degli acquisti su APEBEESTORE." stretto />
      <section className="block block--top">
        <div className="wrap narrow text legale">
          <Bozza lang="it" />

          <h2>1. Chi vende</h2>
          <p>
            Il venditore è [RAGIONE SOCIALE], con sede in [INDIRIZZO DELLA SEDE], P.IVA [P.IVA], email [EMAIL], WhatsApp{" "}
            {numero} (di seguito &quot;APEBEESTORE&quot;, &quot;noi&quot;).
          </p>

          <h2>2. A chi si applicano</h2>
          <p>
            Queste condizioni valgono per tutti gli acquisti fatti su questo sito. Se acquisti come consumatore, hai sempre i
            diritti previsti dal Codice del Consumo (D.Lgs. 206/2005), che queste condizioni non limitano in nessun modo.
          </p>
          <p>Per ordinare devi essere maggiorenne. Se sei minorenne, l&apos;ordine lo deve fare un genitore.</p>

          <h2>3. I prodotti</h2>
          <ul>
            <li>
              Vendiamo prodotti originali acquistati in Giappone. Le foto mostrano la confezione del prodotto e possono
              differire leggermente da quella che ricevi.
            </li>
            <li>
              <strong>Su ordinazione</strong>: il prodotto lo compriamo in Giappone dopo il tuo ordine. Arriva in circa 3–4
              settimane: è un tempo indicativo, non garantito.
            </li>
            <li>
              <strong>Preordine</strong>: prodotto non ancora uscito in Giappone. La data di uscita è quella annunciata dal
              produttore e può cambiare; il prodotto arriva circa 3–4 settimane dopo l&apos;uscita. I preordini si ordinano a
              parte dagli altri prodotti.
            </li>
            <li>
              <strong>Riscatti app</strong>: premi che si sbloccano con un codice dell&apos;app Beyblade X, al prezzo
              indicato. Un premio per ordine, senza altri prodotti. Controlliamo il codice prima di procedere: se non è
              valido l&apos;ordine viene annullato e non paghi nulla.
            </li>
            <li>
              <strong>Sold out</strong>: prodotto che non si trova più in Giappone. Resta visibile ma non si può ordinare.
            </li>
          </ul>

          <h2>4. Prezzi e spese di consegna</h2>
          <p>
            I prezzi sono in euro e comprendono la spedizione dal Giappone e la dogana per l&apos;importazione in Italia.
            [IVA: da verificare come indicarla.] A questi si aggiunge il costo della consegna che scegli:
          </p>
          <ul>
            <li>ritiro a mano a Milano, Como o Varese: gratis (luogo e ora si concordano su WhatsApp);</li>
            <li>spedizione in Italia: € 8;</li>
            <li>spedizione in Europa: € 15;</li>
            <li>spedizione nel resto del mondo: € 50.</li>
          </ul>
          <p>
            Il totale da pagare è sempre scritto prima di inviare l&apos;ordine. [Da verificare: per le spedizioni fuori
            dall&apos;Unione europea eventuali dazi e tasse del paese di arrivo sono a carico del cliente.]
          </p>

          <h2>5. Come si ordina e quando si conclude il contratto</h2>
          <ol>
            <li>Metti i prodotti nel carrello e compili i tuoi dati nella pagina dell&apos;ordine.</li>
            <li>
              Premendo &quot;Ordine con obbligo di pagamento&quot; invii l&apos;ordine: ricevi un numero d&apos;ordine
              (ORD-…) e un&apos;email di riepilogo, che conferma solo che l&apos;ordine ci è arrivato.
            </li>
            <li>Ci mandi l&apos;ordine su WhatsApp con il messaggio già scritto dal sito.</li>
            <li>
              Controlliamo la disponibilità in Giappone e ti confermiamo l&apos;ordine su WhatsApp con le istruzioni per
              pagare: il contratto si conclude in quel momento.
            </li>
          </ol>
          <p>
            Se un prodotto non è più disponibile te lo diciamo prima del pagamento; se avevi già pagato ti rimborsiamo
            l&apos;intera somma entro 14 giorni.
          </p>

          <h2>6. Pagamento</h2>
          <p>
            Il pagamento si concorda su WhatsApp. Accettiamo PayPal, Revolut e bonifico bancario. Ordiniamo il prodotto in
            Giappone dopo aver ricevuto il pagamento. Per i preordini le modalità si concordano su WhatsApp. [Da verificare:
            dopo quanti giorni senza pagamento l&apos;ordine si considera annullato.]
          </p>

          <h2>7. Consegna</h2>
          <p>
            Spediamo con corriere all&apos;indirizzo indicato nell&apos;ordine e ti mandiamo il numero di tracking. I tempi
            sono indicativi. Il rischio di perdita o danno passa a te quando ricevi il pacco.
          </p>
          <p>
            Se il pacco arriva danneggiato, scrivici entro 24 ore dalla consegna con le foto della confezione e del
            prodotto, così apriamo subito la pratica con il corriere. Questo non toglie nulla alla garanzia legale (punto
            9).
          </p>

          <h2>8. Annullamento e diritto di recesso</h2>
          <p>
            <strong>Prima della spedizione</strong> puoi annullare l&apos;ordine scrivendoci su WhatsApp o via email: ti
            restituiamo quanto hai pagato entro 14 giorni.
          </p>
          <p>
            <strong>Dopo la consegna</strong> hai 14 giorni di tempo per recedere dall&apos;acquisto senza dover indicare
            il motivo (art. 52 e seguenti del Codice del Consumo). Per farlo:
          </p>
          <ul>
            <li>
              comunicaci la tua decisione su WhatsApp, via email a [EMAIL] o con il modulo qui sotto (non è obbligatorio
              usarlo);
            </li>
            <li>
              rimandaci il prodotto entro 14 giorni dalla comunicazione, all&apos;indirizzo che ti indichiamo. Le spese di
              restituzione sono a tuo carico;
            </li>
            <li>
              ti rimborsiamo entro 14 giorni da quando riceviamo la tua comunicazione, compreso il costo della consegna
              standard, con lo stesso metodo di pagamento che hai usato. Possiamo aspettare di aver ricevuto il prodotto
              prima di rimborsarti.
            </li>
          </ul>
          <p>
            Sei responsabile della diminuzione di valore del prodotto dovuta a un uso diverso da quello necessario per
            verificarne natura e caratteristiche (per esempio una trottola usata in battaglia).
          </p>

          <h2>9. Garanzia legale</h2>
          <p>
            Tutti i prodotti hanno la garanzia legale di conformità di 24 mesi dalla consegna (art. 128 e seguenti del
            Codice del Consumo). Se trovi un difetto scrivici: ti chiediamo foto o video per capire il problema e poi
            concordiamo riparazione, sostituzione o rimborso come prevede la legge.
          </p>

          <h2>10. Assistenza e reclami</h2>
          <p>
            Per qualsiasi domanda o reclamo scrivici su WhatsApp al {numero} o via email a [EMAIL]. Rispondiamo il prima
            possibile.
          </p>

          <h2>11. Legge applicabile e foro</h2>
          <p>
            Queste condizioni sono regolate dalla legge italiana. Se sei un consumatore, restano valide le tutele più
            favorevoli del paese in cui vivi, e per le controversie è competente il giudice del luogo in cui risiedi.
          </p>

          <h2>12. Dati personali</h2>
          <p>
            Come usiamo i tuoi dati è spiegato nella pagina <Link href={privacy}>Privacy e cookie</Link>.
          </p>

          <h2 id="modulo-recesso">Modulo di recesso</h2>
          <p>Compila e invia questo modulo solo se vuoi recedere dal contratto.</p>
          <div className="legale-modulo">
            <p>Destinatario: [RAGIONE SOCIALE], [INDIRIZZO DELLA SEDE], [EMAIL]</p>
            <p>
              Con la presente io/noi (*) notifico/notifichiamo (*) il recesso dal mio/nostro (*) contratto di vendita dei
              seguenti beni: ……………………
            </p>
            <p>Numero d&apos;ordine: ……………………</p>
            <p>Ordinato il (*) / ricevuto il (*): ……………………</p>
            <p>Nome del/dei consumatore/i: ……………………</p>
            <p>Indirizzo del/dei consumatore/i: ……………………</p>
            <p>Firma del/dei consumatore/i (solo se il modulo è inviato su carta): ……………………</p>
            <p>Data: ……………………</p>
            <p>(*) Cancellare la dicitura inutile.</p>
          </div>

          <p className="legale-data">Ultimo aggiornamento: [DATA]</p>
        </div>
      </section>
    </>
  );
}

function CondizioniEn() {
  const privacy = percorso("en", "/privacy");
  return (
    <>
      <PageHead label="Legal" titolo="Terms of sale" testo="The rules for buying from APEBEESTORE." stretto />
      <section className="block block--top">
        <div className="wrap narrow text legale">
          <Bozza lang="en" />

          <h2>1. Who sells</h2>
          <p>
            The seller is [COMPANY NAME], registered office at [ADDRESS], VAT number [VAT NUMBER], email [EMAIL], WhatsApp{" "}
            {numero} (&quot;APEBEESTORE&quot;, &quot;we&quot;).
          </p>

          <h2>2. Scope</h2>
          <p>
            These terms apply to every purchase made on this site. If you buy as a consumer, you always keep the rights
            granted by Italian consumer law (Legislative Decree 206/2005, the &quot;Consumer Code&quot;), which these terms
            do not limit in any way.
          </p>
          <p>You must be 18 or over to order. If you are under 18, a parent must place the order.</p>

          <h2>3. Products</h2>
          <ul>
            <li>
              We sell original products bought in Japan. Photos show the product packaging and may differ slightly from the
              one you receive.
            </li>
            <li>
              <strong>Special order</strong>: we buy the product in Japan after you order. It arrives in about 3–4 weeks:
              this is an estimate, not a guarantee.
            </li>
            <li>
              <strong>Pre-order</strong>: a product not yet released in Japan. The release date is the one announced by the
              manufacturer and may change; the product arrives about 3–4 weeks after release. Pre-orders are ordered
              separately from other products.
            </li>
            <li>
              <strong>App rewards</strong>: prizes unlocked with a Beyblade X app code, at the price shown. One prize per
              order, with no other products. We check the code before going ahead: if it isn&apos;t valid the order is
              cancelled and you pay nothing.
            </li>
            <li>
              <strong>Sold out</strong>: a product no longer available in Japan. It stays visible but can&apos;t be ordered.
            </li>
          </ul>

          <h2>4. Prices and delivery costs</h2>
          <p>
            Prices are in euros and include shipping from Japan and import customs into Italy. [VAT: to be checked how to
            show it.] The cost of the delivery method you choose is added:
          </p>
          <ul>
            <li>hand delivery in Milan, Como or Varese: free (place and time agreed on WhatsApp);</li>
            <li>shipping within Italy: €8;</li>
            <li>shipping to Europe: €15;</li>
            <li>shipping to the rest of the world: €50.</li>
          </ul>
          <p>
            The total to pay is always shown before you send the order. [To be checked: for shipments outside the European
            Union, any duties and taxes of the destination country are paid by the customer.]
          </p>

          <h2>5. How to order and when the contract is made</h2>
          <ol>
            <li>Add products to your cart and fill in your details on the order page.</li>
            <li>
              Pressing &quot;Order with obligation to pay&quot; sends the order: you get an order number (ORD-…) and a
              summary email, which only confirms that we received your order.
            </li>
            <li>You send us the order on WhatsApp with the message prepared by the site.</li>
            <li>
              We check availability in Japan and confirm the order on WhatsApp with payment instructions: the contract is
              made at that moment.
            </li>
          </ol>
          <p>
            If a product is no longer available we tell you before payment; if you have already paid we refund the full
            amount within 14 days.
          </p>

          <h2>6. Payment</h2>
          <p>
            Payment is arranged on WhatsApp. We accept PayPal, Revolut and bank transfer. We order the product in Japan once
            we receive the payment. For pre-orders, payment terms are arranged on WhatsApp. [To be checked: after how many
            days without payment an order is considered cancelled.]
          </p>

          <h2>7. Delivery</h2>
          <p>
            We ship by courier to the address in your order and send you the tracking number. Delivery times are estimates.
            The risk of loss or damage passes to you when you receive the parcel.
          </p>
          <p>
            If the parcel arrives damaged, message us within 24 hours of delivery with photos of the box and the product, so
            we can open a claim with the courier straight away. This does not affect the legal guarantee (section 9).
          </p>

          <h2>8. Cancellation and right of withdrawal</h2>
          <p>
            <strong>Before shipping</strong> you can cancel the order by messaging us on WhatsApp or by email: we refund what
            you paid within 14 days.
          </p>
          <p>
            <strong>After delivery</strong> you have 14 days to withdraw from the purchase without giving any reason
            (articles 52 and following of the Consumer Code). To do so:
          </p>
          <ul>
            <li>tell us your decision on WhatsApp, by email to [EMAIL] or with the form below (using it is not required);</li>
            <li>
              send the product back within 14 days of telling us, to the address we give you. Return shipping costs are paid
              by you;
            </li>
            <li>
              we refund you within 14 days of receiving your notice, including the standard delivery cost, using the same
              payment method you used. We may wait until we have received the product before refunding you.
            </li>
          </ul>
          <p>
            You are responsible for any loss in value caused by handling the product beyond what is needed to check its
            nature and features (for example a top used in battle).
          </p>

          <h2>9. Legal guarantee</h2>
          <p>
            All products come with the 24-month legal guarantee of conformity from delivery (articles 128 and following of
            the Consumer Code). If you find a defect, message us: we&apos;ll ask for photos or a video to understand the
            problem and then arrange repair, replacement or refund as required by law.
          </p>

          <h2>10. Support and complaints</h2>
          <p>For any question or complaint message us on WhatsApp at {numero} or email [EMAIL]. We reply as soon as we can.</p>

          <h2>11. Governing law and jurisdiction</h2>
          <p>
            These terms are governed by Italian law. If you are a consumer, the more favourable protections of the country
            where you live still apply, and disputes are heard by the court of the place where you live.
          </p>

          <h2>12. Personal data</h2>
          <p>
            How we use your data is explained on the <Link href={privacy}>Privacy and cookies</Link> page.
          </p>

          <h2 id="modulo-recesso">Withdrawal form</h2>
          <p>Fill in and send this form only if you wish to withdraw from the contract.</p>
          <div className="legale-modulo">
            <p>To: [COMPANY NAME], [ADDRESS], [EMAIL]</p>
            <p>I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the following goods: ……………………</p>
            <p>Order number: ……………………</p>
            <p>Ordered on (*) / received on (*): ……………………</p>
            <p>Name of consumer(s): ……………………</p>
            <p>Address of consumer(s): ……………………</p>
            <p>Signature of consumer(s) (only if this form is sent on paper): ……………………</p>
            <p>Date: ……………………</p>
            <p>(*) Delete as appropriate.</p>
          </div>

          <p className="legale-data">Last updated: [DATE]</p>
        </div>
      </section>
    </>
  );
}

function PrivacyIt() {
  const condizioni = percorso("it", "/condizioni-di-vendita");
  return (
    <>
      <PageHead label="Info legali" titolo="Privacy e cookie" testo="Quali dati raccogliamo, perché e per quanto tempo." stretto />
      <section className="block block--top">
        <div className="wrap narrow text legale">
          <Bozza lang="it" />

          <h2>1. Titolare del trattamento</h2>
          <p>
            [RAGIONE SOCIALE], con sede in [INDIRIZZO DELLA SEDE], P.IVA [P.IVA], email [EMAIL]. Per qualsiasi richiesta
            sui tuoi dati puoi scrivere a questo indirizzo o su WhatsApp al {numero}.
          </p>

          <h2>2. Quali dati raccogliamo</h2>
          <ul>
            <li>
              <strong>Dati dell&apos;ordine</strong>: nome e cognome, telefono, email, indirizzo di consegna (o città di
              ritiro), prodotti ordinati, codice dell&apos;app per i riscatti e le note che scrivi.
            </li>
            <li>
              <strong>Messaggi</strong>: quello che ci scrivi su WhatsApp o via email.
            </li>
            <li>
              <strong>Recensioni</strong>: se ne lasci una sul sito, il nome, la città, il prodotto e il testo che scrivi.
            </li>
            <li>
              <strong>Dati tecnici</strong>: l&apos;indirizzo IP e le informazioni che il browser invia quando apri il sito,
              usati per farlo funzionare e proteggerlo.
            </li>
          </ul>
          <p>Il sito non ha account e non chiede password.</p>

          <h2>3. Perché li usiamo</h2>
          <ul>
            <li>
              gestire l&apos;ordine, la consegna, i pagamenti, i resi e l&apos;assistenza: è necessario per il contratto (art.
              6.1.b GDPR);
            </li>
            <li>tenere la contabilità e rispettare gli obblighi fiscali: lo chiede la legge (art. 6.1.c GDPR);</li>
            <li>
              proteggere il sito da ordini finti e abusi, per esempio limitando gli ordini inviati in poco tempo dallo
              stesso indirizzo IP: è un nostro legittimo interesse (art. 6.1.f GDPR);
            </li>
            <li>rispondere alle tue domande prima di un ordine (art. 6.1.b GDPR);</li>
            <li>
              pubblicare la tua recensione con il nome (solo l&apos;iniziale del cognome) e la città: lo fai tu con la spunta
              di consenso, che puoi ritirare quando vuoi scrivendoci (art. 6.1.a GDPR).
            </li>
          </ul>
          <p>
            I dati dell&apos;ordine servono per poterlo gestire: senza non possiamo accettarlo. Non usiamo i tuoi dati per
            pubblicità e non li vendiamo a nessuno.
          </p>

          <h2>4. Chi li vede</h2>
          <ul>
            <li>noi, per gestire gli ordini;</li>
            <li>Google, dove salviamo gli ordini (Google Sheets) e da cui partono le email di riepilogo (Gmail);</li>
            <li>Vercel, la società che ospita il sito;</li>
            <li>
              WhatsApp (Meta), quando ci scrivi o ci mandi l&apos;ordine: in quel caso vale anche l&apos;informativa di
              WhatsApp;
            </li>
            <li>i corrieri, solo i dati che servono per la consegna;</li>
            <li>il nostro commercialista, per gli adempimenti fiscali.</li>
          </ul>
          <p>
            Alcuni di questi fornitori possono trattare i dati fuori dall&apos;Unione europea (per esempio negli Stati
            Uniti), con le garanzie previste dal GDPR. [Da verificare: garanzie dei singoli fornitori.]
          </p>

          <h2>5. Per quanto tempo</h2>
          <ul>
            <li>dati degli ordini: 10 anni, come chiede la legge per la contabilità;</li>
            <li>messaggi e richieste senza ordine: il tempo necessario per rispondere;</li>
            <li>recensioni: finché restano sul sito o finché non ci chiedi di toglierle;</li>
            <li>indirizzo IP per il limite agli ordini: pochi minuti;</li>
            <li>dati tecnici di navigazione: per il tempo previsto dal fornitore che ospita il sito.</li>
          </ul>

          <h2>6. I tuoi diritti</h2>
          <p>
            Puoi chiederci in qualsiasi momento di vedere i tuoi dati, correggerli, cancellarli, limitarne l&apos;uso,
            averne una copia o opporti al loro uso (art. 15–22 GDPR). Alcuni dati degli ordini li dobbiamo comunque tenere
            per legge. Se pensi che i tuoi dati siano usati in modo scorretto puoi fare reclamo al Garante per la protezione
            dei dati personali (garanteprivacy.it).
          </p>

          <h2 id="cookie">7. Cookie</h2>
          <p>
            Il sito non usa cookie di profilazione, di statistica o di pubblicità, per questo non trovi il banner dei cookie.
          </p>
          <p>
            Salva nel tuo browser solo due cose che servono a farlo funzionare: il <strong>carrello</strong> (per 14
            giorni, così non lo perdi ricaricando la pagina) e la scelta del <strong>tema chiaro o scuro</strong>. Restano
            sul tuo dispositivo e non ci vengono inviate. Puoi cancellarle quando vuoi dalle impostazioni del browser.
          </p>
          <p>
            Le foto dei prodotti possono essere caricate da siti esterni (per esempio Google): aprendo la pagina il tuo
            browser si collega a quei siti, che ricevono il tuo indirizzo IP. I link a WhatsApp e Instagram aprono servizi
            esterni con le loro regole sulla privacy.
          </p>
          <p>Se un giorno aggiungeremo cookie non tecnici, prima ti chiederemo il consenso.</p>

          <h2>8. Minori</h2>
          <p>
            Per ordinare bisogna essere maggiorenni (vedi le <Link href={condizioni}>Condizioni di vendita</Link>). Se sei
            un genitore e pensi che tuo figlio ci abbia lasciato dei dati, scrivici e li cancelliamo.
          </p>

          <p className="legale-data">Ultimo aggiornamento: [DATA]</p>
        </div>
      </section>
    </>
  );
}

function PrivacyEn() {
  const condizioni = percorso("en", "/condizioni-di-vendita");
  return (
    <>
      <PageHead label="Legal" titolo="Privacy and cookies" testo="What data we collect, why and for how long." stretto />
      <section className="block block--top">
        <div className="wrap narrow text legale">
          <Bozza lang="en" />

          <h2>1. Data controller</h2>
          <p>
            [COMPANY NAME], registered office at [ADDRESS], VAT number [VAT NUMBER], email [EMAIL]. For any request about
            your data you can write to this address or message us on WhatsApp at {numero}.
          </p>

          <h2>2. What data we collect</h2>
          <ul>
            <li>
              <strong>Order details</strong>: full name, phone, email, delivery address (or pickup city), products ordered,
              app code for rewards and any notes you write.
            </li>
            <li>
              <strong>Messages</strong>: what you write to us on WhatsApp or by email.
            </li>
            <li>
              <strong>Reviews</strong>: if you leave one on the site, your name, city, product and the text you write.
            </li>
            <li>
              <strong>Technical data</strong>: your IP address and the information your browser sends when you open the
              site, used to run and protect it.
            </li>
          </ul>
          <p>The site has no accounts and never asks for a password.</p>

          <h2>3. Why we use it</h2>
          <ul>
            <li>to handle your order, delivery, payments, returns and support: needed for the contract (Art. 6.1.b GDPR);</li>
            <li>to keep our accounts and meet tax obligations: required by law (Art. 6.1.c GDPR);</li>
            <li>
              to protect the site from fake orders and abuse, for example by limiting orders sent in a short time from the
              same IP address: our legitimate interest (Art. 6.1.f GDPR);
            </li>
            <li>to answer your questions before an order (Art. 6.1.b GDPR);</li>
            <li>
              to publish your review with your name (only the initial of your surname) and city: you choose this with the
              consent box, and you can withdraw it at any time by messaging us (Art. 6.1.a GDPR).
            </li>
          </ul>
          <p>
            Order details are needed to handle the order: without them we can&apos;t accept it. We don&apos;t use your data
            for advertising and we never sell it.
          </p>

          <h2>4. Who sees it</h2>
          <ul>
            <li>us, to handle orders;</li>
            <li>Google, where we store orders (Google Sheets) and from which summary emails are sent (Gmail);</li>
            <li>Vercel, the company that hosts the site;</li>
            <li>WhatsApp (Meta), when you message us or send us your order: WhatsApp&apos;s privacy policy also applies;</li>
            <li>couriers, only the details needed for delivery;</li>
            <li>our accountant, for tax obligations.</li>
          </ul>
          <p>
            Some of these providers may process data outside the European Union (for example in the United States), with the
            safeguards required by the GDPR. [To be checked: safeguards of each provider.]
          </p>

          <h2>5. How long we keep it</h2>
          <ul>
            <li>order details: 10 years, as required by law for accounting;</li>
            <li>messages and requests without an order: as long as needed to reply;</li>
            <li>reviews: as long as they stay on the site or until you ask us to remove them;</li>
            <li>IP address for the order limit: a few minutes;</li>
            <li>technical browsing data: for the time set by the hosting provider.</li>
          </ul>

          <h2>6. Your rights</h2>
          <p>
            At any time you can ask us to access, correct or delete your data, restrict its use, get a copy of it or object
            to its use (Art. 15–22 GDPR). Some order details must be kept by law. If you think your data is being misused you
            can lodge a complaint with the Italian Data Protection Authority (garanteprivacy.it) or the authority of your
            country.
          </p>

          <h2 id="cookie">7. Cookies</h2>
          <p>The site uses no profiling, analytics or advertising cookies, which is why there is no cookie banner.</p>
          <p>
            It only saves two things in your browser that it needs to work: your <strong>cart</strong> (for 14 days, so you
            don&apos;t lose it when reloading the page) and your <strong>light or dark theme</strong> choice. They stay on
            your device and are never sent to us. You can delete them at any time from your browser settings.
          </p>
          <p>
            Product photos may be loaded from external sites (for example Google): when you open the page your browser
            connects to those sites, which receive your IP address. Links to WhatsApp and Instagram open external services
            with their own privacy rules.
          </p>
          <p>If we ever add non-technical cookies, we will ask for your consent first.</p>

          <h2>8. Minors</h2>
          <p>
            You must be 18 or over to order (see the <Link href={condizioni}>Terms of sale</Link>). If you are a parent and
            think your child has given us their details, message us and we will delete them.
          </p>

          <p className="legale-data">Last updated: [DATE]</p>
        </div>
      </section>
    </>
  );
}
