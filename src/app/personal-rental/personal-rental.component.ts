import { Component, OnDestroy, OnInit } from '@angular/core';
import {Apollo} from "apollo-angular";
import {GET_ACTIVE_RENTALS} from "../graphql/graphql.queries";
import {Router} from "@angular/router";
import {DetailsComponent} from "../details/details.component";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-personal-rental',
  templateUrl: './personal-rental.component.html',
  styleUrls: ['./personal-rental.component.css']
})
export class PersonalRentalComponent implements OnInit, OnDestroy{
  private querySubscription: any;
  error: any;
  customer_id = parseInt(history.state.customer_id);
  userFirstName = history.state.firstName
  userLastName = history.state.lastName
  activeRentalsFilms: any[] = [];
  displayedColumns: string[] = ['title', 'rental_rate'];

  constructor(private apollo: Apollo, private dialog: MatDialog, private router: Router){}

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_ACTIVE_RENTALS,
      variables: {customer_id: this.customer_id}
    }).valueChanges.subscribe(({data, error}: any) => {
      this.activeRentalsFilms = data.activeRentals;
      console.log("ACTIVE RENTALS", this.activeRentalsFilms)
      this.error = error;
    })
  }

  openMovieDetails(movie: any){
    this.dialog.open(DetailsComponent,
      {
        data: { movie }
      });
  }

  ngOnDestroy(): void{
    this.querySubscription.unsubscribe();
  }
}
