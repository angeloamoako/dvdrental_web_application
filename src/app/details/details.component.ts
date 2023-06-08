import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GET_ACTORS_BY_FILM } from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  private querySubscription: any;
  actors: any[] = [];
  error: any;

  /*
  * L’@Inject decorator è usato per specificare una dipendenza che deve essere
  * iniettata nel costruttore del componente.
  * In questo caso, stiamo iniettando il token MAT_DIALOG_DATA, che rappresenta
  * i dati passati alla modale quando viene aperta */
  constructor(@Inject(MAT_DIALOG_DATA) public data: { movie: any }, private apollo: Apollo) { }

  ngOnDestroy(): void {
    this.querySubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.querySubscription = this.apollo.watchQuery({
      query: GET_ACTORS_BY_FILM,
      variables: { filmName: this.data.movie.title }
    }).valueChanges.subscribe(({ data, error }: any) => {
        this.actors = data.actorsFromFilm;
        console.log(`Lista degli attori per il film ${this.data.movie.title}: `, data.actorsFromFilm);
        console.log("Data: ", this.data);
        this.error = error;
      }
    );
  }

}
