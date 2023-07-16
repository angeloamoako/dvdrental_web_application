import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatCardModule} from '@angular/material/card';
import {LogoutService} from "../services/logout.service";
import {MatGridListModule} from '@angular/material/grid-list';
import {RentModalComponent} from "../rent-modal/rent-modal.component";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule, MatCardModule, MatGridListModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  providers: [LogoutService]

})
export class DetailsComponent implements OnInit, OnDestroy {
  actors: any[] = [];
  public storesWithFilm: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                          movie: any,
                          actors: any[],
                          storesWithFilm: any[],
                          fromHomePage: boolean},
              private dialog: MatDialog) {
    this.actors = data.actors;
    this.storesWithFilm = data.storesWithFilm;
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  openRentModal(){
    const modalRef = this.dialog.open(RentModalComponent,
      {
        data: {movie: this.data.movie, storesWithFilm: this.storesWithFilm }
      });
  }
}
