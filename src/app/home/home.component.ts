import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { Router } from '@angular/router';
import {LogoutService} from "../services/logout.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {FilmService} from "../services/film.service";
import { Subscription, take} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {RentModalComponent} from "../rent-modal/rent-modal.component";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LogoutService]
})
export class HomeComponent implements OnInit, OnDestroy {
  films: any[] = [];
  categories: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchFilter: string = '';
  selectedCategory: string = '';
  currentPageSize: number = 20;
  currentPageNumber: number = 0;
  totalResults!: number;
  datasource: any;
  notFromPageChange: boolean = true;
  orderByAttribute: string = '';

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  private subscription!: Subscription;
  categorySearchFieldFocused: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // ! per dire che oggetto non è NULL

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router,
              private logoutService: LogoutService,
              public filmService: FilmService,
              private notificationService: NotificationService) { }


  ngOnInit(): void {
    this.filmService.getCategories().subscribe((outputQuery) => {
      this.categories = outputQuery;
    }, (error) => {
      console.log("filmService.getCategories() - Errore durante la chiamata: ", error);
    })

    this.callPaginatedFilmAPI();

    this.subscription = this.notificationService.getNotification().subscribe(message => {
      console.log("Notifica ricevuta: ", message);
      console.log("Aggiornamento della vista...");
      this.callPaginatedFilmAPI();
    });

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  openMovieDetails(movie: any) {
    let actors: any;
    let storesWithFilm: any;
    let copiesForStore:Map<String, number> = new Map();

    this.filmService.getActorsByFilm(movie.title)
      .pipe(take(1))
      .subscribe((outputQueryActors) => {
        actors = outputQueryActors;

        // recupero i negozi che hanno copie disponibili del film
        this.filmService.getStoresWithSpecifiedFilmAndNumCopies(movie.title)
          .pipe(take(1))
          .subscribe((outputQueryStoresWithCopies) => {
              storesWithFilm = outputQueryStoresWithCopies;
              const fromHomePage:boolean = true;
              this.dialog.open(DetailsComponent,
                {
                  data: { movie, actors, storesWithFilm, fromHomePage },
                  width: '700px', // Dimensione orizzontale di default
                  height: 'auto', // Altezza calcolata in base al contenuto
                  maxWidth: '90vw', // Larghezza massima in viewport width
                  maxHeight: '90vh', // Altezza massima in viewport height
                });
          },
            (error) => {
              console.log(`filmService.getStoresWithSpecifiedFilmAndNumCopies - si è verificato un errore durante la query: ${error}`);
              this.logoutService.logout();
            })


      },
        (error) => {
          console.log(`filmService.getActorsByFilm - si è verificato un errore durante la query: ${error}`);
          this.logoutService.logout();
        })
  }


  openRentComponent(movie: any) {
    // recupero i negozi che hanno copie disponibili del film richiesto
    let storesWithFilm;
    this.filmService.getStoresWithSpecifiedFilmAndNumCopies(movie.title)
      .pipe(take(1))
      .subscribe(
        (outputQuery) => {
          storesWithFilm = outputQuery;

          const modalRef = this.dialog.open(RentModalComponent,
            {
              data: {movie: movie, storesWithFilm: storesWithFilm}
            });


        }, (error) => {
          console.log("filmService.getStoresWithSpecifiedFilmAndNumCopies - errore durante la query: ", error);
        }
      )
  }


  searchBy(){

    /* ritardo la chiamata ad API nel filtro di ricerca per evitare che le richieste arrivino al server troppo
      vicine l'una dall'altra.
     */
    const wait = setTimeout(() => {
      this.currentPageNumber = 0;
      this.notFromPageChange = true;
      this.callPaginatedFilmAPI();
    }, 500);

  }

  orderBy(attribute: string){
    console.log("Order by attribute: ", attribute);
    this.orderByAttribute = attribute;
    this.callPaginatedFilmAPI();
  }

  searchByCategory() {
    console.log('Categoria selezionata:', this.selectedCategory);
    this.paginator.pageIndex = 0;
    this.notFromPageChange = true;
    this.callPaginatedFilmAPI();
  }

  openPastRental() {
    this.router.navigate(['/pastRental']);
  }


  openPersonalRental() {
    this.router.navigate(['/personalRental']);
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
    this.notFromPageChange = false;

    this.callPaginatedFilmAPI();
  }

  callPaginatedFilmAPI(){
    console.log("callPaginatedFilmAPI() with params: ");
    console.log(`currentPageNumber: ${this.currentPageNumber}
    \ncurrentPageSize: ${this.currentPageSize}\n
    category: ${this.selectedCategory}\n
    orderByAttribute: ${this.orderByAttribute}`);
    this.filmService.getPaginatedFilms(this.searchFilter, this.currentPageNumber, this.currentPageSize, this.selectedCategory, this.orderByAttribute)
      .subscribe((queryOutput) => {
          console.log(`Risultato della query con parametri pageNumber: ${this.currentPageNumber} pageSize: ${this.currentPageSize}`);
          console.log(queryOutput);
          this.films = queryOutput.filmList;

          // aggiungo un paginator per gestire il passaggio da una pagina all'altra
          this.datasource = new MatTableDataSource(this.films);
          this.paginator.length = queryOutput.totalResults;

          if ((this.searchFilter != '' || this.selectedCategory != '') && this.notFromPageChange){
            this.notFromPageChange = false;
            this.paginator.pageIndex = 0;
            console.log("UPDATED: Paginator page index: ", this.paginator.pageIndex);
          }
        },
        (error) => {
          console.log(`Si è verificato un errore durante la query: ${error}`);
          this.logoutService.logout();
        });

    this.currentPageNumber = 0;
  }

  onCategorySearchFieldFocus() {
    this.categorySearchFieldFocused = true;
  }

  onCategorySearchFieldBlur() {
    this.categorySearchFieldFocused = false;
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.categorySearchFieldFocused) {
      return;
    }

    const options = ['', 'Action', 'Animation', 'Children', 'Classics', 'Comedy', 'Documentary', 'Drama', 'Family', 'Foreign', 'Games', 'Horror', 'Music', 'New', 'Sci-Fi', 'Sport', 'Travel'];
    const currentIndex = options.indexOf(this.selectedCategory);

    if (event.key === 'ArrowUp' && currentIndex > 0) {
      this.selectedCategory = options[currentIndex - 1];
      this.searchBy();
    } else if (event.key === 'ArrowDown' && currentIndex < options.length - 1) {
      this.selectedCategory = options[currentIndex + 1];
      this.searchBy();
    }
  }

}




