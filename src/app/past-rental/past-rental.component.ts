import {Component, OnDestroy, OnInit} from '@angular/core';
import {Apollo} from "apollo-angular";
import {GET_PAST_RENTALS} from "../graphql/graphql.queries";
import {Router} from "@angular/router";

@Component({
  selector: 'app-past-rental',
  templateUrl: './past-rental.component.html',
  styleUrls: ['./past-rental.component.css']
})
export class PastRentalComponent implements OnInit{
  private querySubscription: any;
  error: any;
  customer_id = parseInt(history.state.customer_id);
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  pastRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_date', 'return_date', 'amount'];
  totalAmount: any;
  constructor(private apollo: Apollo, private router: Router) {  }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_PAST_RENTALS,
      variables: {customer_id: this.customer_id}
    }).valueChanges.subscribe(({data, error}: any) => {
      this.pastRentalsFilms = data.pastRentals;
      this.error = error;

      // dentro la funzione perché è asincrona
      for (let i= 0; i <= this.pastRentalsFilms.length; i++) {
        this.totalAmount += this.pastRentalsFilms[i].amount;
      }
    })
  }
}
