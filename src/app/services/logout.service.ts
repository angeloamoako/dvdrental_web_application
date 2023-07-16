import { Router } from '@angular/router';
import {Injectable} from "@angular/core";

@Injectable()
export class LogoutService {
  constructor(private router: Router) {};
  logout() {
    console.log("logoutService - entered");
    window.alert("Sessione scaduta, stai per essere rediretto alla pagina di login.");
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
