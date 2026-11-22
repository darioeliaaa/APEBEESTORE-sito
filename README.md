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

