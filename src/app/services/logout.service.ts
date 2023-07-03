import { Router } from '@angular/router';
import {Injectable} from "@angular/core";

@Injectable()
export class LogoutService {
//private router: any;

/* Servizio disponibile a tutte le chiamate ad API. Nel momento in cui ricevo un error 404 faccio logout */
  constructor(private router: Router) {};
  logout() {
    console.log("logoutService - entered");
    window.alert("Sessione scaduta, stai per essere rediretto alla pagina di login.");
    // pulisco il session storage e redirigo l'utente alla pagina di login
    this.router.navigate(['/login']);
  }
}
