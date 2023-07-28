# DVD RENTAL
Progetto per il corso di Applicazioni dinamiche per il Web (A.A 2022/23).

## Prerequisiti
Bisogna innanzitutto clonare questo repository ed installare la versione più recente di Node JS (il progetto è stato realizzato con la versione v18.16.0).

Successivamente sarà necessario scaricare in locale il sample database reperibile al seguente [link](https://www.postgresqltutorial.com/postgresql-getting-started/postgresql-sample-database/)
(nello specifico seguire le istruzioni presenti nella sezione "Download the PostgreSQL sample database").

Una volta fatto ciò, creare il database "utenti" eseguendo il contenuto del file "utenti.sql" presente nella directory root del progetto.

A questo punto non resta che installare le dipendenze tramite il comando 
npm install all'interno della cartella root del progetto.


## GraphQL API
L'applicazione espone i seguenti micro-servizi GraphQL:
* activeRentals: [Rental!] : restituisce l'elenco dei noleggi attivi per l'utente specificato
* actorsFromFilm: [Actor!] : restituisce l'elenco degli attori presenti nel film specificato
* categories: [Category!]! : restituisce l'elenco delle categorie di film presenti nel database
* paginatedFilms: PaginatedFilm: restituisce l'elenco dei film disponibili al noleggio divisi per pagina.
* pastRentals: [Rental!] : restituisce l'elenco dei noleggi passati dell'utente specificato.
* storesWithSelectedFilmAndNumCopies: [Store!]: restituisce l'elenco dei negozi con copie disponibili di un film ed il relativo numero di copie.

## Ulteriori informazioni
Per ulteriori informazioni vedere il file "Specifiche progetto" nella cartella root del progetto

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
