import { Component, OnDestroy, OnInit } from '@angular/core';
import { Apollo } from "apollo-angular";
import { GET_ACTIVE_RENTALS } from "../graphql/graphql.queries";
import { Router } from "@angular/router";
import { DetailsComponent } from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';
import { FilmService } from "../services/film.service";
import { take } from "rxjs";
import { LogoutService } from "../services/logout.service";
import {RentService} from "../services/rent.service";

@Component({
  selector: 'app-personal-rental',
  templateUrl: './personal-rental.component.html',
  styleUrls: ['./personal-rental.component.css']
})
export class PersonalRentalComponent implements OnInit, OnDestroy{
  private querySubscription: any;
  error: any;
  customer_id = parseInt(history.state.customer_id);
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  activeRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_rate'];
  isSidenavOpen: boolean = false;

  constructor(private apollo: Apollo,
              private dialog: MatDialog,
              private router: Router,
              private filmService: FilmService,
              private rentService: RentService,
              private logoutService: LogoutService) {}

  ngOnInit(): void {

    this.rentService.getActiveRentals(this.customer_id)
      .pipe(take(1))
      .subscribe( (outputQueryActiveRentals) => {
        this.activeRentalsFilms = outputQueryActiveRentals;
      } , (error) => {
        console.log("rentService.getActiveRentals - c'è stato un problema durante la chiamata: ", error);
      })
  }

  openMovieDetails(movie: any){
    // recupero lista degli attori ed eventuali store in cui il film è disponibile

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
    this.router.navigate(['/home'], {state: {
        customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  openPastRental(){
    this.router.navigate(['/pastRental'], {state: {
        customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }
}
