import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatNativeDateModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from "@angular/material/dialog";
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Apollo } from "apollo-angular";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule } from "@angular/forms";
import moment from 'moment';
import { NotificationService } from "../services/notification.service";
import { FilmService } from "../services/film.service";
import { take } from "rxjs";
import {RentService} from "../services/rent.service";
import {MatCardModule} from "@angular/material/card";
import {LogoutService} from "../services/logout.service";


@Component({
  selector: 'app-rent-modal',
  templateUrl: './rent-modal.component.html',
  styleUrls: ['./rent-modal.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatDialogModule,
    MatCardModule
  ]
})
export class RentModalComponent implements OnInit, OnDestroy {
  public selectedStore: string = '';
  public storesWithAvailableCopies :any[] = [];
  public selectedDate!: Date;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any, storesWithFilm: any[], },
              private apollo: Apollo, private dialog: MatDialog,
              private notificationService: NotificationService,
              private filmService: FilmService,
              private rentService: RentService,
              private logoutService: LogoutService) {

  }

  ngOnInit(): void {

    this.filmService.getStoresWithSpecifiedFilmAndNumCopies(this.data.movie.title)
      .pipe( take(1) )
      .subscribe((outputQueryStoresWithCopies) => {
        this.storesWithAvailableCopies = outputQueryStoresWithCopies;
      },
        ({error}) => {
          console.log("filmService.getStoresWithSpecifiedFilmAndNumCopies - c'è stato un errore durante la chiamata: ", error);
          console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
          if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
            this.logoutService.logout();
          }
        })

  }

   myFilter(data: Date | null): boolean {

    const today = moment();
    const tomorrow = moment().add(1, 'day');
    const afterTomorrow= moment().add(2, 'day');
    const currentDateAsMoment = moment(data);

    return currentDateAsMoment.isSame(today, 'day') ||
        currentDateAsMoment.isSame(tomorrow, 'day') ||
        currentDateAsMoment.isSame(afterTomorrow, 'day');
  }

  isDisabled(){
    return (this.selectedDate == null) || (this.selectedStore == '');
  }


  rentDvd(){
    const formattedDate = moment(this.selectedDate).format('YYYY-MM-D');
    let store_id :any;

    for(let store of this.data.storesWithFilm) {
        if (store.address === this.selectedStore) {
          console.log(`Store found: ${store.address} with store_id: ${store.store_id}. store obj:`, store);
          store_id = store.store_id;
          break;
        }
    }

    this.rentService.rentMovie(this.data.movie.title, store_id, formattedDate)
      .pipe(take(1))
      .subscribe((outputRentMovie) => {
        window.alert("Hai prenotato con successo una copia del film " +  this.data.movie.title);
        this.dialog.closeAll();
        this.notificationService.sendNotification('Noleggio eseguito');

      }, (error) =>{
        console.log("rentService.rentMovie - C'è stato un errore durante la query: ", error);
        console.log("Errore graphQL: ",error.networkError.result.errors[0].message);
        if(error.networkError.result.errors[0].extensions.code === 'UNAUTHENTICATED'){
          this.logoutService.logout();
        }
      })

  }

  ngOnDestroy(): void {
  }

}
