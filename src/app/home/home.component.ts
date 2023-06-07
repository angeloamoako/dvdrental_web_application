import {Component, OnDestroy, OnInit} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog'; // per mostrare la modale
import { DetailsComponent } from '../details/details.component';
import { GET_FILMS } from '../graphql/graphql.queries';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private querySubscription: any;
  films: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchTitle: string = '';
  selectedCategory: string = '';
  initialFilms: any[] = [];
  customer_id = history.state.customer_id
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router) {  }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_FILMS
    }).valueChanges.subscribe(({data, error}: any) => {
      this.films = data.films;
      this.initialFilms = this.films
      this.error = error;
    })
  }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  openMovieDetails(movie: any){
    this.dialog.open(DetailsComponent,
      {
        data: { movie }
      });
  }

  searchByTitle() {
    this.films = this.initialFilms.filter(film => film.title.toLowerCase().includes(this.searchTitle.toLowerCase()));
  }

  searchByCategory() {
    this.searchTitle = "" //svuotare filtro al cambio di categoria
    this.films = this.initialFilms.filter(film => film.genre.toLowerCase().includes(this.selectedCategory.toLowerCase()));
  }

  openPastRental(){
    this.router.navigate(['/pastRental'], {state: {
      customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }

  openPersonalRental(){
    this.router.navigate(['/personalRental'], {state: {
        customer_id: this.customer_id, firstName: this.userFirstName, lastName: this.userLastName }});
  }
}




