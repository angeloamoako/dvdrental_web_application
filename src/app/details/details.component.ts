import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {GET_ACTORS_BY_FILM, GET_STORES_WITH_SPECIFIED_FILM} from "../graphql/graphql.queries";
import {Apollo} from "apollo-angular";
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatTableModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit, OnDestroy {
  private querySubscription: any;
  actors: any[] = [];
  storesWithFilm: any[] = [];
  displayedColumns: string[] = ['address', 'copies'];
  copiesForStore:Map<String, number> = new Map();
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
    /* Recupero l'elenco degli attori dal server */
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

    /* Recupero i negozi che hanno copie del film specificato */
    this.querySubscription = this.apollo.watchQuery({
      query: GET_STORES_WITH_SPECIFIED_FILM,
      variables: { film_title: this.data.movie.title }
    }).valueChanges.subscribe(({ data, error }: any) => {
        this.storesWithFilm = data.storesWithSelectedFilm;
        console.log(`Negozi con copie disponibili del film ${this.data.movie.title}: `, data.storesWithSelectedFilm);
        this.error = error;


        /* Per ogni store recupero il numero di copie del film richiesto */
        for(const element of this.storesWithFilm){
          if(!this.copiesForStore.get(element.address))
            this.copiesForStore.set(element.address, 1);
          else{
            //const previousValue = this.copiesForStore.get(element.address);
            // il ?? 0 serve per dare un valore di default nel caso in cui il risultato sia undefined
            const previousValue = this.copiesForStore.get(element.address) ?? 0;
            this.copiesForStore.set(element.address, previousValue + 1);
          }
        }
        console.log("Copie per negozio: ", this.copiesForStore);


      }
    );

  }

}
