import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators } from "@angular/forms";
import { Apollo } from 'apollo-angular';
import { GET_ACTORS, GET_FILMS } from '../graphql/graphql.queries';


@Component({
  selector: 'app-test-actor-component',
  templateUrl: './test-actor-component.component.html',
  styleUrls: ['./test-actor-component.component.css']
})
export class TestActorComponentComponent implements OnInit{
  actors: any[] = [];
  films: any[] = [];
  error: any;

  actorForm = new FormGroup({
    name: new FormControl(''),
    description: new FormControl('')
  });

  constructor(private apollo: Apollo) { }
  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_ACTORS
    }).valueChanges.subscribe(({ data, error }: any) => {
        this.actors = data.actors;
        console.log("Dati letti dal server GraphQL: ",data);
        this.error = error;
      }
    );

    this.apollo.watchQuery({
      query: GET_FILMS
    }).valueChanges.subscribe(({data, error}: any) => {
      this.films = data.films;
      console.log("Film estratti dal server GraphQL: ", data);
      this.error = error;
    })
  }
}




