import { Injectable } from '@angular/core';
import {
  GET_ACTORS_BY_FILM,
  GET_PAGINATED_FILMS,
  GET_STORES_WITH_SPECIFIED_FILM_AND_NUMCOPIES
} from '../graphql/graphql.queries';
import {Apollo} from "apollo-angular";
import {map, Observable, take, tap} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FilmService {

  constructor(private apollo: Apollo) { }

  getPaginatedFilms(searchFilter:string, currentPageNumber: number, currentPageSize: number, selectedCategory: string ): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_PAGINATED_FILMS,
      fetchPolicy: 'network-only',
      variables: {
        pageNumber: currentPageNumber,
        pageSize: currentPageSize,
        filmTitle: searchFilter,
        category: selectedCategory
      }
    }).valueChanges
      .pipe(
        map(({ data }: any) => data.paginatedFilms)
      );
  }




  getActorsByFilm(movieTitle: string){
    return this.apollo.watchQuery({
      query: GET_ACTORS_BY_FILM,
      fetchPolicy: 'network-only',
      variables: { filmName: movieTitle }
    }).valueChanges
      .pipe(
        map(({ data }: any) => data.actorsFromFilm),
        tap(mappedData => console.log(`Lista degli attori per il film ${movieTitle}: `, mappedData) )
      );
  }


  getStoresWithSpecifiedFilmAndNumCopies(movieTitle: string){
    return this.apollo.watchQuery({
      query: GET_STORES_WITH_SPECIFIED_FILM_AND_NUMCOPIES,
      fetchPolicy: 'network-only',
      variables: { film_title: movieTitle }
    }).valueChanges
      .pipe(
        map(({ data }: any) => data.storesWithSelectedFilmAndNumCopies),
        tap(mappedData => console.log(`Negozi con copie disponibili del film ${movieTitle}: `, mappedData))
      )
  }


}
