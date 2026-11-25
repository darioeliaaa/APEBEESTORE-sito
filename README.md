# APEBEESTORE

Sito di APEBEESTORE. Per ora ci sono la home e le pagine di prova, con prodotti e prezzi non reali.

Next.js, React, TypeScript, Tailwind.

## Avvio

```bash
npm install
npm run dev
```

Apri http://localhost:3000

## Dati di prova

Prodotti, preordini e FAQ sono in `src/data/demo.ts`.

## Google Sheet
Il catalogo viene letto dal foglio CATALOGO del Google Sheet, solo in lettura, e si aggiorna ogni 5 minuti.
Le chiavi vanno in `.env.local` (vedi `.env.example`). Senza chiavi il sito usa i dati di prova (sul sito vero no: senza chiavi la build si ferma).

Se il foglio non si legge o sembra rotto (nessun prodotto, una colonna sparita, troppe righe sbagliate) il sito non si aggiorna e resta all'ultima versione buona.

Le righe sbagliate (codice doppio, stato non valido, prezzo mancante...) non vanno sul sito e si vedono nella pagina `/controllo`, protetta dalla parola d'ordine `CONTROLLO_PASSWORD`.

### Banner della home
Le foto del banner in home si prendono dalla scheda **BANNER** dello stesso Google Sheet (una riga = una foto):

| Immagine (URL) | Link | Attivo |
|---|---|---|
| link della foto, deve iniziare con `https://` | facoltativo: dove porta il clic, es. `/preordini` | facoltativo: senza spunta la foto non si vede |

Con una foto il banner sta fermo, con due o più scorrono da sole. Le foto ideali sono quadrate (1080×1080); le altre si vedono intere con i lati riempiti dalla stessa foto sfocata. Se la scheda non c'è o è vuota, in home resta il disegno con l'ape.

## Catalogo diviso per linea
- Ogni linea della colonna "Linea" del foglio (Beyblade X, Pokémon...) ha la sua pagina: `/catalogo/beyblade-x`, `/catalogo/pokemon`. `/catalogo` mostra le linee da scegliere.
- Nell'header "Catalogo" è un menu a tendina con le linee; sul telefono si apre dentro il menu.
- Una linea nuova nel foglio compare da sola, nel menu e nel catalogo. Maiuscole e accenti non contano: "pokemon" e "Pokémon" sono la stessa linea.

## Ordini
- Carrello → `/ordine` (dati del cliente) → **Conferma l'ordine**: il sito manda l'ordine allo script di Nicholas (`/api/ordine`), che lo salva nella scheda Ordini del foglio, manda le email e risponde con il numero ORD-….
- Poi il tasto **Invia su WhatsApp** apre la chat con Nicholas con il messaggio già scritto, per il pagamento.
- Variabili: `ORDINI_URL` (URL `/exec` dello script) e `ORDINI_SEGRETO` (uguale alla proprietà `SITO_SEGRETO` dello script). Se mancano o lo script non risponde, l'ordine va comunque su WhatsApp con un codice APE-….
- Il link "riepilogo" nelle email porta a `/riepilogo?order=…&t=…`, che legge l'ordine dallo script.
- Come pubblicare lo script: `../script-sito/COME-PUBBLICARE.md`.

## Lingue
Il sito è in italiano e in inglese. L'italiano sta agli indirizzi di sempre (`/catalogo`), l'inglese sotto `/en` (`/en/catalogo`).
- Tutti i testi sono in `src/i18n/testi.ts` (le FAQ in `src/i18n/faq.ts`, Chi siamo in `src/pagine/ChiSiamo.tsx`): per cambiare una frase si cambia lì, in tutte e due le lingue.
- Le pagine vere stanno in `src/pagine/`; `src/app/(it)` e `src/app/en` dicono solo quale lingua usare.
- I nomi dei prodotti arrivano dal foglio e restano uguali; le categorie (Trottole, Arene, Accessori...) hanno la traduzione in `testi.ts`.
- Gli indirizzi che non esistono mostrano una pagina 404 unica, in italiano e in inglese (`src/app/global-not-found.tsx`).

## iCloud
La cartella è sul Desktop, che iCloud sincronizza: iCloud duplicava i file di lavoro di Next ("LOG 2") e `npm run dev` non partiva più.
In locale quei file vanno in `.next.nosync`, che iCloud non tocca (su Vercel resta `.next`).

