import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import { GET_PAST_RENTALS } from "../graphql/graphql.queries";
import { Router } from "@angular/router";
import { DetailsComponent } from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';
import {take} from "rxjs";
import {FilmService} from "../services/film.service";
import {LogoutService} from "../services/logout.service";
import {RentService} from "../services/rent.service";

@Component({
  selector: 'app-past-rental',
  templateUrl: './past-rental.component.html',
  styleUrls: ['./past-rental.component.css']
})
export class PastRentalComponent implements OnInit, OnDestroy{
  private querySubscription: any;
  error: any;
  customer_id: any = parseInt(sessionStorage.getItem('customer_id') as string);
  userFirstName = sessionStorage.getItem('firstName') as string;
  userLastName = sessionStorage.getItem('lastName') as string;
  pastRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_date', 'return_date', 'amount'];
  totalAmount: number = 0;
  isSidenavOpen: boolean = false;
  constructor(private apollo: Apollo, private dialog: MatDialog,
              private router: Router,
              private filmService: FilmService,
              private rentalService: RentService,
              private logoutService: LogoutService) {  }

  ngOnInit(): void {

    this.rentalService.getPastRentals(this.customer_id)
      .pipe(take(1))
      .subscribe((outputQuery) => {
        this.pastRentalsFilms = outputQuery;

        // dentro la funzione perché è asincrona
        for (let i = 0; i < this.pastRentalsFilms.length; i++) {
          this.totalAmount += this.pastRentalsFilms[i].amount;
        }
        // per arrotondare due cifre dopo la virgola
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2));

      }, (error) => {
        console.log("rentalService.getPastRentals - c'è stato un errore durante la query: ", error);
      })

  }

  openMovieDetails(movie: any) {
    let actors: any;
    let storesWithFilm: any;

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

  ngOnDestroy(): void{
  }

  backToHome(){
    this.router.navigate(['/home']);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  openPersonalRental() {
    this.router.navigate(['/personalRental']);
  }
}
