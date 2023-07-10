import { Injectable } from '@angular/core';
import {Apollo} from "apollo-angular";
import {GET_ACTIVE_RENTALS, GET_PAST_RENTALS, INSERT_RENT} from "../graphql/graphql.queries";
import {map, Observable, tap} from "rxjs";
import {LogoutService} from "./logout.service";
import {outputAst} from "@angular/compiler";

@Injectable({
  providedIn: 'root'
})
export class RentService {

  constructor(private apollo: Apollo, private logoutService: LogoutService) { }

  rentMovie(movieTitle: string, storeId: number, formattedDate: string){
    return this.apollo
      .mutate({
        mutation: INSERT_RENT,
        variables: {
          filmTitle: movieTitle,
          customer_id: null,        // il customer_id viene preso dal contextValue sul server
          storeId: storeId,
          rentalDate: formattedDate
        }
      })
      .pipe(
        map(({ data }: any) => data.insertRent),
        tap(outputInsertRent => console.log(`Righe affette dal noleggio del film ${movieTitle}: `, outputInsertRent))
      )

  }


  getActiveRentals(customerId: number, orderByAttribute: String){
    return this.apollo.watchQuery({
      query: GET_ACTIVE_RENTALS,
      fetchPolicy: 'network-only',
      variables: { customerId: customerId, orderByAttribute: orderByAttribute }
    }).valueChanges
      .pipe(
        map((outputQueryActiveRentals: any) => outputQueryActiveRentals.data.activeRentals),
        tap((mappedOutput) => console.log("Elenco dei noleggi attivi: ", mappedOutput))
      )

  }

  getPastRentals(customer_id: number, orderByAttribute: string): Observable<any> {
    return this.apollo.watchQuery({
      query: GET_PAST_RENTALS,
      fetchPolicy: 'network-only',
      variables: {customer_id: customer_id, category: orderByAttribute}
    }).valueChanges
      .pipe(
        map( (outputQueryPastRentals:any) => outputQueryPastRentals.data.pastRentals),
        tap( (mappedOutput) => console.log("Elenco dei noleggi passati: ", mappedOutput))
      )

  }


}
