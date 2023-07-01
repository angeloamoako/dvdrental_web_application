import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = sessionStorage.getItem('authToken');

    /* se il token è presente nel session storage allora l'utente si è autenticato quindi può
      accedere alla route */
    if(token) {
      return true;
    } else{
      this.router.navigate(['/login']);
      return false ;
    }
  }
}
