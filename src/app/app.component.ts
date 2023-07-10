import {Component} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  title = 'dvdrental';
  isSidenavOpen: boolean = false;

  constructor(public router: Router){}

  openPastRental() {
    this.router.navigate(['/pastRental']);
  }

  openPersonalRental() {
    this.router.navigate(['/personalRental']);
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  backToHome(){
    this.router.navigate(['/home']);
  }

  logout(){
    this.isSidenavOpen = !this.isSidenavOpen;
    sessionStorage.clear();
    this.router.navigate(['/login'])
  }

  protected readonly sessionStorage = sessionStorage;

}
