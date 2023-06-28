import {Component, Inject, OnInit} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { GET_STORES_WITH_SPECIFIED_FILM_AVAILABLE} from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {MatTableDataSource} from "@angular/material/table";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
//import moment from "moment";

@Component({
  selector: 'app-rent-modal',
  templateUrl: './rent-modal.component.html',
  styleUrls: ['./rent-modal.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatButtonModule, FormsModule]
})
export class RentModalComponent implements OnInit {
  public selectedStore: string = '';
  public storesWithAvailableCopiesQuerySubscription: any;
  public storesWithAvailableCopies :any[] = [];
  public selectedDate!: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any, storesWithFilm: any[], },
              private apollo: Apollo) {

  }

  ngOnInit(): void {
    this.storesWithAvailableCopiesQuerySubscription = this.apollo.watchQuery({
      query: GET_STORES_WITH_SPECIFIED_FILM_AVAILABLE,
      variables: { filmTitle: this.data.movie.title }
    }).valueChanges.subscribe(({data}: any) => {
      this.storesWithAvailableCopies = data.storesWithSelectedFilmAvailable;
      console.log("Stores with copies: ", data);

    }, (error) => {
      console.log("C'è stato un errore durante la chiamata all'API GET_PAGINATED_FILMS: ", error);
    });
  }

   myFilter(data: Date | null): boolean {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    var after_tomorrow = new Date();
    after_tomorrow.setDate(today.getDate() + 2);

    // Tronca le date al formato "yyyy-mm-dd" per facilitare il confronto
    let dataCorrente = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let dataDomani = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    let dataDopodomani = new Date(after_tomorrow.getFullYear(), after_tomorrow.getMonth(), after_tomorrow.getDate());

    const tdata = data ? new Date(data.getFullYear(), data.getMonth(), data.getDate()) : null;
    // Confronta la data con la data corrente, domani e dopodomani
    return (tdata === null || tdata.getTime() === dataCorrente.getTime() || tdata.getTime() === dataDomani.getTime() || tdata.getTime() === dataDopodomani.getTime());
  }

  isDisabled(){
    /*
    if (this.selectedDate != null) {
      const a = moment(this.selectedDate).format('D-MM-YYYY');
      console.log("Formatted date: ", a);
    }
     */


    console.log("Selected date: ", this.selectedDate.getTime());
    // abilito il bottone di submit solo quando entrambi i campi sono stati compilati
    return (this.selectedDate == null) || (this.selectedStore == '');
  }


  onSubmit(){
    // chiamata alla mutation per il noleggio

  }

}
