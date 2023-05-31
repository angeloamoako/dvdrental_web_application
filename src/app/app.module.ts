import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { TestActorComponentComponent } from './test-actor-component/test-actor-component.component';
import {ReactiveFormsModule, FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    TestActorComponentComponent
  ],
    imports: [
        BrowserModule,
        GraphQLModule,
        HttpClientModule,
        FormsModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
