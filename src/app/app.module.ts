import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { TestActorComponentComponent } from './test-actor-component/test-actor-component.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {HomeComponent} from "./home/home.component";
import {MatTableModule} from "@angular/material/table";
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import {NgIf, NgFor} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    TestActorComponentComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    NgIf,
    NgFor,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
