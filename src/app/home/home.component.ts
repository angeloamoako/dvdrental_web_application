import {Component, OnDestroy, OnInit} from '@angular/core';
import { Apollo } from 'apollo-angular';
import { MatDialog } from '@angular/material/dialog'; // per mostrare la modale
import { DetailsComponent } from '../details/details.component';
import { GET_FILMS } from '../graphql/graphql.queries';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  films: any[] = [];
  error: any;
  private querySubscription: any;

  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost', 'action'];
  searchTitle: string = '';
  selectedCategory: string = '';

  constructor(private apollo: Apollo, private dialog: MatDialog) {  }


  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_FILMS
    }).valueChanges.subscribe(({data, error}: any) => {
      this.films = data.films;
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

  // FILTRO DINAMICO PER TITOLO
  searchByTitle() {
    this.films = this.films.filter(film => film.title.toLowerCase().includes(this.searchTitle.toLowerCase()));
  }

  // RICERCA PER CATEROGIA
  searchByCategory() {
    this.films = this.films.filter(film => film.genre.toLowerCase().includes(this.selectedCategory.toLowerCase()));
  }

}




