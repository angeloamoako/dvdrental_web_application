import {Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  customer_id!: number;
  userpassword!: string;

  constructor(private router: Router, private httpClient: HttpClient) {}
  headers = new Headers();


  ngOnInit(){
    sessionStorage.clear();
  }

  onSubmit(){
    const loginData = {
      customer_id: this.customer_id,
      userpassword: this.userpassword
    };

    // Send an HTTP POST request to the backend
    this.httpClient.post<any>('http://localhost:4000/users', loginData)
      .subscribe(
        response => {
          const firstName = response.firstName;
          const lastName = response.lastName;

          sessionStorage.setItem('authToken', response.authToken);
          sessionStorage.setItem('firstName', firstName);
          sessionStorage.setItem('lastName', lastName);
          sessionStorage.setItem('customer_id', String(this.customer_id));
          const token = response.authToken;


          this.router.navigate(['/home'], {state: {
            customer_id: this.customer_id, firstName: firstName, lastName: lastName }});
        },
        error => {
          this.router.navigate(['/login']);
        }
      );
  }
}
