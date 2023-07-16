import {Component, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {Router} from "@angular/router";
import {DetailsComponent} from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';
import { FilmService } from "../services/film.service";
import { take } from "rxjs";
import { LogoutService } from "../services/logout.service";
import {RentService} from "../services/rent.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-personal-rental',
  templateUrl: './personal-rental.component.html',
  styleUrls: ['./personal-rental.component.css']
})
export class PersonalRentalComponent implements OnInit{
  error: any;
  customer_id: any = parseInt(sessionStorage.getItem('customer_id') as string);
  activeRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_date','rental_rate'];
  isSidenavOpen: boolean = false;
  private orderByAttribute: string = '';

  constructor(private apollo: Apollo,
              private dialog: MatDialog,
              private router: Router,
              private filmService: FilmService,
              private rentService: RentService,
              private logoutService: LogoutService) {}
  datasource: any;

  ngOnInit(): void {

    this.callPersonalRentalAPI();
  }

  openMovieDetails(movie: any){
    let actors: any;
    let storesWithFilm: any;
    console.log("Selected movie details: ", movie);
    this.filmService.getActorsByFilm(movie.title)
      .pipe(take(1))
      .subscribe((outputQueryActors) => {
          actors = outputQueryActors;

          this.filmService.getStoresWithSpecifiedFilmAndNumCopies(movie.title)
            .pipe(take(1))
            .subscribe((outputQueryStoresWithCopies) => {
                storesWithFilm = outputQueryStoresWithCopies;
                this.dialog.open(DetailsComponent,
                  {
                    data: { movie, actors, storesWithFilm },
                    width: '700px',
                    height: 'auto',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
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

  orderBy(attribute: string){
    console.log("Order by attribute: ", attribute);
    this.orderByAttribute = attribute;
    this.callPersonalRentalAPI();
  }

  callPersonalRentalAPI(){
    console.log('Calling active rentals with orderByAttr: ', this.orderByAttribute)
    this.rentService.getActiveRentals(this.customer_id, this.orderByAttribute)
      .pipe(take(1))
      .subscribe( (outputQueryActiveRentals) => {
        this.activeRentalsFilms = outputQueryActiveRentals;
        this.datasource = new MatTableDataSource(this.activeRentalsFilms);

      } , (error) => {
        console.log("rentService.getActiveRentals - c'è stato un problema durante la chiamata: ", error);
        console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
        if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
          this.logoutService.logout();
        }
      })
  }
}
