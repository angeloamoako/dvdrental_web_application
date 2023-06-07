import {Component, OnInit} from '@angular/core';
import {GET_PAST_RENTALS} from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-past-rental',
  templateUrl: './past-rental.component.html',
  styleUrls: ['./past-rental.component.css']
})
export class PastRentalComponent implements OnInit{
  private querySubscription: any;
  error: any;
  customer_id = history.state.customer_id
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  pastRentalsFilms: any[] =[];
  displayedColums: string[] =  ['title', 'rental_duration', 'rental_rate', 'rental_id', 'durata', 'amount'];
  constructor(private apollo: Apollo, private router: Router) {  }

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_PAST_RENTALS,
      variables: { customer_id: this.customer_id }
    }).valueChanges.subscribe(({data, error}: any) => {
      this.pastRentalsFilms = data.pastRentalsFilms;
      console.log("NOLEGGI PASSATI RICEVUTI: ", this.pastRentalsFilms)
      this.error = error;
    })
  }
}
