import {Component, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog';
import { DetailsComponent } from '../details/details.component';
import { Router } from '@angular/router';
import {LogoutService} from "../services/logout.service";
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from "@angular/material/paginator";
import {FilmService} from "../services/film.service";
import { Subscription, take} from "rxjs";
import {NotificationService} from "../services/notification.service";
import {RentModalComponent} from "../rent-modal/rent-modal.component";

import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [LogoutService]
})
export class HomeComponent implements OnInit, OnDestroy {
  films: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchFilter: string = '';
  selectedCategory: string = '';
  currentPageSize: number = 20;
  currentPageNumber: number = 0;
  totalResults!: number;
  private subscription!: Subscription;
  categorySearchFieldFocused: boolean = false;

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
              this.dialog.open(DetailsComponent,
                {
                  data: { movie, actors, storesWithFilm }
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
      this.callPaginatedFilmAPI();
    }, 500);

  }

  onPageChange(event: PageEvent){
    //console.log(`Current page: ${event.pageIndex}`);
    this.currentPageNumber = event.pageIndex;
    //console.log(`Current page-size: ${event.pageSize}`);
    this.currentPageSize = event.pageSize;
    //console.log("Pagine totali: ",event.length);
    this.callPaginatedFilmAPI();
  }

  callPaginatedFilmAPI(){
    this.filmService.getPaginatedFilms(this.searchFilter, this.currentPageNumber, this.currentPageSize, this.selectedCategory)
      .subscribe((queryOutput) => {
          //console.log(`Risultato della query con parametri pageNumber: ${this.currentPageNumber} pageSize: ${this.currentPageSize}`);
          //console.log(queryOutput);
          this.films = queryOutput.filmList;

          // aggiungo un paginator per gestire il passaggio da una pagina all'altra
          this.totalResults = queryOutput.totalResults;
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




