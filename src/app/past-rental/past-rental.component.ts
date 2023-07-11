import {Component, OnDestroy, OnInit} from '@angular/core';
import { Apollo } from "apollo-angular";
import { GET_PAST_RENTALS } from "../graphql/graphql.queries";
import { Router } from "@angular/router";
import { DetailsComponent } from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';
import {take} from "rxjs";
import {FilmService} from "../services/film.service";
import {LogoutService} from "../services/logout.service";
import {RentService} from "../services/rent.service";
//import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-past-rental',
  templateUrl: './past-rental.component.html',
  styleUrls: ['./past-rental.component.css']
})
export class PastRentalComponent implements OnInit, OnDestroy{
  error: any;
  customer_id: any = parseInt(sessionStorage.getItem('customer_id') as string);
  orderByAttribute: string = '';
  pastRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_date', 'return_date', 'amount'];
  totalAmount: number = 0;
  isSidenavOpen: boolean = false;
  datasource: any;

  constructor(private apollo: Apollo, private dialog: MatDialog,
              private router: Router,
              private filmService: FilmService,
              private rentalService: RentService,
              private logoutService: LogoutService) {  }

  ngOnInit(): void {
    this.callPastRentalAPI();
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
                    data: { movie, actors, storesWithFilm },
                    width: '700px', // Dimensione orizzontale di default
                    height: 'auto', // Altezza calcolata in base al contenuto
                    maxWidth: '90vw', // Larghezza massima in viewport width
                    maxHeight: '90vh', // Altezza massima in viewport height

                  });
              },
              (error) => {
                console.log(`filmService.getStoresWithSpecifiedFilmAndNumCopies - si è verificato un errore durante la query: ${error}`);
                console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
                if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
                  this.logoutService.logout();
                }
              })


        },
        (error) => {
          console.log(`filmService.getActorsByFilm - si è verificato un errore durante la query: ${error}`);
          console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
          if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
            this.logoutService.logout();
          }
        })
  }


  callPastRentalAPI(){
    this.rentalService.getPastRentals(this.customer_id, this.orderByAttribute)
      .pipe(take(1))
      .subscribe((outputQuery:any) => {
        this.pastRentalsFilms = outputQuery;
        this.totalAmount = 0; // dentro la funzione perché è asincrona
        for (let i = 0; i < this.pastRentalsFilms.length; i++) {
          this.totalAmount += this.pastRentalsFilms[i].amount;
        }
        // per arrotondare due cifre dopo la virgola
        this.totalAmount = parseFloat(this.totalAmount.toFixed(2));
        this.datasource = new MatTableDataSource(this.pastRentalsFilms);
      }, (error) => {
        console.log("rentalService.getPastRentals - c'è stato un errore durante la query: ", error);
        console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
        if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
          this.logoutService.logout();
        }
      })

  }

  orderBy(attribute: string){
    console.log("Order by attribute: ", attribute);
    this.orderByAttribute = attribute;
    this.callPastRentalAPI();
  }

  ngOnDestroy(): void{
  }
}
