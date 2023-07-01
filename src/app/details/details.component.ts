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
  displayedColumns: string[] = ['address', 'copies'];
  public copiesForStore:Map<String, number> = new Map();


  /*
  * L’@Inject decorator è usato per specificare una dipendenza che deve essere
  * iniettata nel costruttore del componente.
  * In questo caso, stiamo iniettando il token MAT_DIALOG_DATA, che rappresenta
  * i dati passati alla modale quando viene aperta */
  constructor(@Inject(MAT_DIALOG_DATA) public data: {
                          movie: any,
                          actors: any[],
                          storesWithFilm: any[]},
              private dialog: MatDialog) {
    this.actors = data.actors;
    this.storesWithFilm = data.storesWithFilm;
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  openRentModal(){
    console.log("Storeswithfilm prima di aprire la modale: ", this.storesWithFilm);
    this.dialog.open(RentModalComponent,
      {
        data: {movie: this.data.movie, storesWithFilm: this.storesWithFilm }
      });
  }



}
