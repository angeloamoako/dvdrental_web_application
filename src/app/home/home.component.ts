import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import { DetailsComponent } from '../details/details.component';
import {GET_ACTORS_BY_FILM, GET_FILMS, GET_STORES_WITH_SPECIFIED_FILM, GET_PAGINATED_FILMS} from '../graphql/graphql.queries';
import { Router } from '@angular/router';
import {LogoutService} from "../logout.service";
import {MatTableDataSource} from "@angular/material/table";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LogoutService]
})
export class HomeComponent implements OnInit, OnDestroy {
  private filmQuerySubscription: any;
  private actorsByFilmQuerySubscription: any;
  private storesWithCopiesQuerySubscription: any;
  films: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchTitle: string = '';
  selectedCategory: string = '';
  initialFilms: any[] = [];
  customer_id = history.state.customer_id;
  userFirstName = history.state.firstName;
  userLastName = history.state.lastName;
  currentPageSize: number = 20;
  currentPageNumber: number = 0;
  totalResults!: number;
  datasource: any;

  //@ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router, private logoutService: LogoutService) { }


  ngOnInit(): void {

    /*
    this.filmQuerySubscription = this.apollo.watchQuery({
      query: GET_FILMS
    }).valueChanges.subscribe(({data, error}: any) => {
      this.films = data.films;
      this.initialFilms = this.films
      this.error = error;

      // aggiungo un paginator per ridurre il numero di righe nella pagina corrente
      this.datasource = new MatTableDataSource(this.films);
      this.datasource.paginator = this.paginator;
    })
    */
    this.callPaginatedFilmAPI();

  }

  ngOnDestroy(): void {
    this.filmQuerySubscription.unsubscribe();
    //this.actorsByFilmQuerySubscription.unsubscribe();
    //this.storesWithCopiesQuerySubscription.unsubscribe();
  }

  openMovieDetails(movie: any){
    /* faccio prima le chiamate all' API per reperire i dati.
       Se la chiamata va a buon fine allora apro la modale
       altrimenti redirigo alla login perché il token è scaduto
    */

    let actors: any;
    let storesWithFilm: any;
    let copiesForStore:Map<String, number> = new Map();

    /* Recupero l'elenco degli attori dal server */
    this.actorsByFilmQuerySubscription = this.apollo.watchQuery({
      query: GET_ACTORS_BY_FILM,
      variables: { filmName: movie.title }
    }).valueChanges.subscribe(({data}: any) => {
      actors = data.actorsFromFilm;
      console.log(`Lista degli attori per il film ${movie.title}: `, data.actorsFromFilm);


      /* Recupero i negozi che hanno copie del film specificato */

      this.storesWithCopiesQuerySubscription = this.apollo.watchQuery({
        query: GET_STORES_WITH_SPECIFIED_FILM,
        variables: { film_title: movie.title }
      }).valueChanges.subscribe(({data}: any) => {
        storesWithFilm = data.storesWithSelectedFilm;
        console.log(`Negozi con copie disponibili del film ${movie.title}: `, data.storesWithSelectedFilm);


        // Per ogni store recupero il numero di copie del film richiesto

        for(const element of storesWithFilm){
          if(!copiesForStore.get(element.address))
            copiesForStore.set(element.address, 1);
          else{
            //const previousValue = this.copiesForStore.get(element.address);
            // il ?? 0 serve per dare un valore di default nel caso in cui il risultato sia undefined
            const previousValue = copiesForStore.get(element.address) ?? 0;
            copiesForStore.set(element.address, previousValue + 1);
          }
        }
        console.log("Copie per negozio: ", copiesForStore);

        this.dialog.open(DetailsComponent,
          {
            data: { movie, actors, storesWithFilm, copiesForStore }
          });

      }, (err_stores) => {
        console.error("Errore durante la chiamata alla query GET_STORES_WITH_SPECIFIED_FILM: ", err_stores);
        this.logoutService.logout();
      });

    }, (error) => {
      console.error("Errore durante la chiamata API a GET_ACTORS_BY_FILM: ", error);
      this.error = error;
      this.logoutService.logout();
    });

  }



  searchBy(){
    console.log('Categoria selezionata:', this.selectedCategory);
    /*
    this.films = this.initialFilms.filter(film => film.title.toLowerCase().includes(this.searchTitle.toLowerCase()) &&
      film.genre.toLowerCase().includes(this.selectedCategory.toLowerCase()));
    this.datasource = new MatTableDataSource(this.films);
    */
    this.callPaginatedFilmAPI();
  }

  openPastRental(){
    this.router.navigate(['/pastRental'], {state: {
      customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }

  openPersonalRental(){
    this.router.navigate(['/personalRental'], {state: {
        customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }

  onPageChange(event: PageEvent){
    console.log(`Current page: ${event.pageIndex}`);
    this.currentPageNumber = event.pageIndex;
    console.log(`Current page-size: ${event.pageSize}`);
    this.currentPageSize = event.pageSize;
    console.log("Pagine totali: ",event.length);

    this.callPaginatedFilmAPI();
  }

  callPaginatedFilmAPI(){
    this.filmQuerySubscription = this.apollo.watchQuery({
      query: GET_PAGINATED_FILMS,
      variables: { pageNumber: this.currentPageNumber, pageSize: this.currentPageSize, filmTitle: this.searchTitle, category:this.selectedCategory }
    }).valueChanges.subscribe(({data}: any) => {
      this.films = data.paginatedFilms.filmList;
      this.initialFilms = this.films;
      console.log(`Output query GET_PAGINATED_FILMS con parametri pageNumber: ${this.currentPageNumber} pageSize: ${this.currentPageSize}`);
      console.log(data);

      // aggiungo un paginator per ridurre il numero di righe nella pagina corrente
      this.datasource = new MatTableDataSource(this.films);
      this.totalResults = data.paginatedFilms.totalResults;

    }, (error) => {
      console.log("C'è stato un errore durante la chiamata all'API GET_PAGINATED_FILMS: ", error);
      this.logoutService.logout();
    });
  }
}




