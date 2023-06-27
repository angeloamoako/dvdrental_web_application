import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//#const CryptoJS = require('crypto-js');
import { AES } from "crypto-js";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  customer_id: any;
  userpassword: any;
  constructor(private router: Router, private httpClient: HttpClient) {}
  headers = new Headers();

  onSubmit() {


    /* AES.encrypt(this.userpassword, 'secret-key');
    console.log("Password cifrata"AES.encrypt(this.userpassword, 'secret-key')) */
    const loginData = {
      customer_id: this.customer_id,
      userpassword: this.userpassword
    };

    // Send an HTTP POST request to the backend
    this.httpClient.post<any>('http://localhost:4000/users', loginData)
      .subscribe(
        response => {
          //console.log('Login successful:', response);
          const firstName = response.firstName;
          const lastName = response.lastName;

          // Salvo il token nel session storage così posso inviarlo nelle richieste successive
          sessionStorage.setItem('authToken', response.authToken);
          const token = response.authToken;


          this.router.navigate(['/home'], {state: {
            customer_id: this.customer_id, firstName: firstName, lastName: lastName }});
        },
        error => {
          //console.log('Login failed:', error);
          this.router.navigate(['/login']);
        }
      );
  }
}
