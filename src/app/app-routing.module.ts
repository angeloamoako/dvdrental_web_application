import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {HomeComponent} from "./home/home.component";
import {PastRentalComponent} from "./past-rental/past-rental.component";
import {PersonalRentalComponent} from "./personal-rental/personal-rental.component";
import {AuthGuardService} from "./services/auth-guard.service";

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService]},
  { path: 'pastRental', component: PastRentalComponent, canActivate: [AuthGuardService]},
  { path: 'personalRental', component: PersonalRentalComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})export class AppRoutingModule{}
