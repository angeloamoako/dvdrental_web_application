import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialog} from "@angular/material/dialog";
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {GET_PAGINATED_FILMS, GET_STORES_WITH_SPECIFIED_FILM_AVAILABLE, INSERT_RENT} from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import moment from 'moment';
import {NotificationService} from "../services/notification.service";


@Component({
  selector: 'app-rent-modal',
  templateUrl: './rent-modal.component.html',
  styleUrls: ['./rent-modal.component.css'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule, MatButtonModule, FormsModule]
})
export class RentModalComponent implements OnInit, OnDestroy {
  public selectedStore: string = '';
  public storesWithAvailableCopiesQuerySubscription: any;
  public storesWithAvailableCopies :any[] = [];
  public selectedDate!: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any, storesWithFilm: any[], },
              private apollo: Apollo, private dialog: MatDialog,
              private notificationService: NotificationService) {

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
    //console.log("Selected date: ", this.selectedDate.getTime());
    // abilito il bottone di submit solo quando entrambi i campi sono stati compilati
    return (this.selectedDate == null) || (this.selectedStore == '');
  }


  rentDvd(){
    // chiamata alla mutation per il noleggio
    const formattedDate = moment(this.selectedDate).format('YYYY-MM-D');
    let store_id :any;

    for(let store of this.data.storesWithFilm){
        if (store.address === this.selectedStore) {
          console.log(`Store found: ${store.address} with store_id: ${store.store_id}. store obj:`, store);
          store_id = store.store_id;
          break;
        }
    }

    console.log(`Store_id after for loop: ${store_id}`);

    this.apollo
      .mutate({
        mutation: INSERT_RENT,
        variables: {
          filmTitle: this.data.movie.title,
          customer_id: null,
          storeId: store_id,
          rentalDate: formattedDate
        }
      })
      .subscribe(
        ({ data }) => {
          console.log("Righe affette dal noleggio: ", data);
          window.alert("Hai prenotato con successo una copia del film " +  this.data.movie.title);
          this.dialog.closeAll();
          this.notificationService.sendNotification('Noleggio eseguito');
        },
        error => {
          console.log('there was an error sending the query', error);
        },
      );


  }

  ngOnDestroy(): void {
    this.storesWithAvailableCopiesQuerySubscription.unsubscribe();
  }

}
