import { Injectable } from '@angular/core';
import { GET_PAGINATED_FILMS} from '../graphql/graphql.queries';
import {Apollo} from "apollo-angular";
import {map, Observable} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class FilmService {
  private filmQuerySubscription: any;
  constructor(private apollo: Apollo) { }

  getPaginatedFilms(searchFilter:string, currentPageNumber: number, currentPageSize: number, selectedCategory: string ): Observable<any> {
    this.filmQuerySubscription = this.apollo.watchQuery({
      query: GET_PAGINATED_FILMS,
      fetchPolicy: 'network-only',
      variables: {
        pageNumber: currentPageNumber,
        pageSize: currentPageSize,
        filmTitle: searchFilter,
        category: selectedCategory
      }
    }).valueChanges.pipe(
      map(({ data }: any) => data.paginatedFilms)
    );
    return this.filmQuerySubscription;
  }


  unsubscribeToAllQuery(){
    //this.filmQuerySubscription.unsubscribe();
  }

}
