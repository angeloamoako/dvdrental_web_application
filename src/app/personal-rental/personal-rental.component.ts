import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Apollo} from "apollo-angular";
import {Router} from "@angular/router";
import {DetailsComponent} from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';
import { FilmService } from "../services/film.service";
import { take } from "rxjs";
import { LogoutService } from "../services/logout.service";
import {RentService} from "../services/rent.service";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-personal-rental',
  templateUrl: './personal-rental.component.html',
  styleUrls: ['./personal-rental.component.css']
})
export class PersonalRentalComponent implements OnInit{
  private querySubscription: any;
  error: any;
  customer_id: any = parseInt(sessionStorage.getItem('customer_id') as string);
  userFirstName = sessionStorage.getItem('firstName') as string;
  userLastName = sessionStorage.getItem('lastName') as string;
  activeRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_date','rental_rate'];
  isSidenavOpen: boolean = false;

  constructor(private apollo: Apollo,
              private dialog: MatDialog,
              private router: Router,
              private filmService: FilmService,
              private rentService: RentService,
              private logoutService: LogoutService) {}
  datasource: any;

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {

    this.rentService.getActiveRentals(this.customer_id)
      .pipe(take(1))
      .subscribe( (outputQueryActiveRentals) => {
        this.activeRentalsFilms = outputQueryActiveRentals;
        this.datasource = new MatTableDataSource(this.activeRentalsFilms);

        setTimeout(() => {
          this.datasource.sort = this.sort;
        }, 1000);
      } , (error) => {
        console.log("rentService.getActiveRentals - c'è stato un problema durante la chiamata: ", error);
      })
  }

  openMovieDetails(movie: any){
    // recupero lista degli attori ed eventuali store in cui il film è disponibile

    let actors: any;
    let storesWithFilm: any;
    console.log("Selected movie details: ", movie);
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
                this.logoutService.logout();
              })


        },
        (error) => {
          console.log(`filmService.getActorsByFilm - si è verificato un errore durante la query: ${error}`);
          this.logoutService.logout();
        })

  }

  backToHome(){
    this.router.navigate(['/home']);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  openPastRental(){
    this.router.navigate(['/pastRental']);
  }
}
