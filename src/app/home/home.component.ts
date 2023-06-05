import {Component, OnInit} from '@angular/core';
import { Apollo } from 'apollo-angular';
import {GET_FILMS} from '../graphql/graphql.queries';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  films: any[] = [];
  error: any;
  displayedColumns: string[] = ['title', 'release_year', 'rating', 'genre', 'language', 'cost'];
  searchTitle: string = '';
  selectedCategory: string = '';

  constructor(private apollo: Apollo) {
  }

  // FILTRO DINAMICO PER TITOLO
  searchByTitle() {
    this.films = this.films.filter(film => film.title.toLowerCase().includes(this.searchTitle.toLowerCase()));
  }

  // RICERCA PER CATEROGIA
  searchByCategory() {
    this.films = this.films.filter(film => film.genre.toLowerCase().includes(this.selectedCategory.toLowerCase()));
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_FILMS
    }).valueChanges.subscribe(({data, error}: any) => {
      this.films = data.films;
      this.error = error;
    })
  }
}




