import { Component, OnDestroy, OnInit} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import {GET_ACTORS_BY_FILM, GET_STORES_WITH_SPECIFIED_FILM_AND_NUMCOPIES } from '../graphql/graphql.queries';
import { Router } from '@angular/router';
import {LogoutService} from "../services/logout.service";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {FilmService} from "../services/film.service";
import {Subject, Subscription} from "rxjs";
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LogoutService]
})
export class HomeComponent implements OnInit, OnDestroy {
  private filmQuerySubscription: any;
  private unsubscribe$ = new Subject<void>();

  private actorsByFilmQuerySubscription: any;
  private storesWithCopiesQuerySubscription: any;
  films: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchFilter: string = '';
  selectedCategory: string = '';
  customer_id = history.state.customer_id
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  isSidenavOpen: boolean = false;
  currentPageSize: number = 20;
  currentPageNumber: number = 0;
  totalResults!: number;
  datasource: any;

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  private periodicUpdate!: any;
  private subscription!: Subscription;

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router,
              private logoutService: LogoutService,
              public filmService: FilmService,
              private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.callPaginatedFilmAPI();

    this.subscription = this.notificationService.getNotification().subscribe(message => {
      console.log("Notifica ricevuta: ", message);
      console.log("Aggiornamento della vista...");
      this.callPaginatedFilmAPI();
    });

  }

  ngOnDestroy(): void {

    this.filmService.unsubscribeToAllQuery();
    this.subscription.unsubscribe();
  }

  openMovieDetails(movie: any){
    /* faccio prima le chiamate all' API per reperire i dati.
       Se la chiamata va a buon fine allora apro la modale
       altrimenti redirigo alla login perché il token è scaduto
    */

    let actors: any;
    let storesWithFilm: any;

    /* Recupero l'elenco degli attori dal server */
    this.actorsByFilmQuerySubscription = this.apollo.watchQuery({
      query: GET_ACTORS_BY_FILM,
      variables: { filmName: movie.title }
    }).valueChanges.subscribe(({data}: any) => {
      actors = data.actorsFromFilm;
      console.log(`Lista degli attori per il film ${movie.title}: `, data.actorsFromFilm);


      /* Recupero i negozi che hanno copie del film specificato */

      this.storesWithCopiesQuerySubscription = this.apollo.watchQuery({
        query: GET_STORES_WITH_SPECIFIED_FILM_AND_NUMCOPIES,
        fetchPolicy: 'network-only',
        variables: { film_title: movie.title }
      }).valueChanges.subscribe(({data}: any) => {
        storesWithFilm = data.storesWithSelectedFilmAndNumCopies;
        console.log(`Negozi con copie disponibili del film ${movie.title}: `, data.storesWithSelectedFilmAndNumCopies);

        this.dialog.open(DetailsComponent,
          {
            data: { movie, actors, storesWithFilm }
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

    /* ritardo la chiamata ad API nel filtro di ricerca per evitare che le richieste arrivino al server troppo
      vicine l'una dall'altra.
     */
    const wait = setTimeout(() => {
      this.callPaginatedFilmAPI();
    }, 500);

  }

  searchByCategory() {
    console.log('Categoria selezionata:', this.selectedCategory);
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

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
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
    this.filmService.getPaginatedFilms(this.searchFilter, this.currentPageNumber, this.currentPageSize, this.selectedCategory)
      .subscribe((queryOutput) => {
          console.log(`Risultato della query con parametri pageNumber: ${this.currentPageNumber} pageSize: ${this.currentPageSize}`);
          console.log(queryOutput);
          this.films = queryOutput.filmList;

          // aggiungo un paginator per ridurre il numero di righe nella pagina corrente
          this.datasource = new MatTableDataSource(this.films);
          this.totalResults = queryOutput.totalResults;

        },
        (error) => {
          console.log(`Si è verificato un errore durante la query: ${error}`);
          this.logoutService.logout();
        });

    this.currentPageNumber = 0;
  }

}




