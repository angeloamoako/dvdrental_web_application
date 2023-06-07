import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {PastRentalComponent} from "./past-rental/past-rental.component";
import {PersonalRentalComponent} from "./personal-rental/personal-rental.component";

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'pastRental', component: PastRentalComponent},
  { path: 'personalRental', component: PersonalRentalComponent},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})export class AppRoutingModule{}
